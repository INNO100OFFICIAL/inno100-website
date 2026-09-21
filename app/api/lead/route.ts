import { autoresponse, teamNotification, type Lead, type LeadKind } from '@/lib/email-templates'
import { subscribeLead } from '@/lib/mailchimp'

/**
 * Single endpoint behind both site forms (/contact and /visit).
 *
 * It does three things, in descending order of importance:
 *
 *   1. Records the lead. A submission must never be lost, so this is attempted
 *      through every configured channel and the response is 200 if *any* of
 *      them succeeded.
 *   2. Notifies the team, so someone can actually reply.
 *   3. Gets the visitor an automatic introduction — the thing this route was
 *      added for. See the section below on how that one is delivered, which is
 *      not from here.
 *
 * Why a server route at all, rather than Mailchimp's embed code as originally
 * suggested: the embed replaces our markup with Mailchimp's, which would lose
 * the site's styling, the GA4 events, the custom fields (planned date, group
 * size, inquiry type) and the team notification. Posting from here keeps all of
 * that and keeps every credential on the server, out of the client bundle.
 *
 * How the visitor's confirmation actually reaches them
 * -----------------------------------------------------
 * Through the Mailchimp audience, not from this route: subscribeLead() adds the
 * contact with their submitted details as merge fields and tags them, and a
 * Journey in Mailchimp sends the mail on that tag. That path was chosen because
 * it runs inside the marketing plan already being paid for, and because the
 * cheaper alternatives all failed on the same point — every one of them refuses
 * to deliver to a visitor's own address without more money:
 *
 *   - Mailchimp Transactional's free demo rejects any recipient outside our own
 *     verified domain. Confirmed by a live send, not inferred: the API answered
 *     `status: rejected, reject_reason: recipient-domain-mismatch`.
 *   - Paid Transactional is $20 per 25,000 emails on top of a Standard plan.
 *   - Formspree's autoresponse needs their $30/month tier, and custom copy and a
 *     custom From domain only unlock at $90/month.
 *
 * The cost of the Journey route, stated plainly because it is a real loss: the
 * copy lives in Mailchimp's editor rather than in lib/email-templates.ts where
 * it can be reviewed in a diff, only the fields promoted to merge fields survive
 * the trip, and delivery is whenever the Journey fires rather than immediately.
 *
 * The two mail transports below are therefore not the visitor's path. They send
 * the team notification, and they remain the way an instant autoresponse would
 * be sent if either one ever becomes viable:
 *
 *   - SMTP (sendMailSmtp), when SMTP_USER and SMTP_PASS are set. Goes through the
 *     Google Workspace account that already receives mail for inno100.ai, so it
 *     costs nothing and can reach any address.
 *   - Mailchimp Transactional (sendMail), otherwise. The sending domain
 *     mail.inno100.ai is fully verified there (SPF, DKIM, DMARC), so it works the
 *     moment a send block is bought.
 *
 * Ordering note: the autoresponse is sent *after* the team notification on
 * purpose. If a daily sending quota is hit, the mail we can least afford to
 * lose is the one that tells us a lead exists.
 */

export const runtime = 'nodejs'

/**
 * Where the team notification goes when LEAD_TEAM_EMAIL is unset.
 *
 * Deliberately not brand@inno100.group: that mailbox is Tencent-hosted and has
 * already hard-rejected notification mail with 550 邮件内容被拒绝, which is how
 * ten submissions sat unread in the Formspree dashboard instead of reaching
 * anyone. A lead notification is the one message in this system we cannot
 * afford to have bounced, so it goes somewhere with no rejection history.
 */
const DEFAULT_TEAM_EMAIL = 'inno1002026@outlook.com'

/**
 * Kept as a backstop even once our own sending works. Its notification mail is
 * what Tencent rejects, but the dashboard record survives that rejection — it
 * is how the ten stranded submissions were recovered — so it stays as a
 * durable second copy that does not depend on our own configuration.
 */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdllgoj'

/**
 * Mailchimp Transactional, the product formerly called Mandrill. The v1 API is
 * still under the mandrillapp.com host after the 2025 rebrand, and still takes
 * the API key in the JSON body rather than an Authorization header.
 */
const MANDRILL_ENDPOINT = 'https://mandrillapp.com/api/1.0/messages/send.json'

/**
 * SMTP defaults, used when SMTP_USER and SMTP_PASS are set. They point at Gmail
 * because inno100.ai's MX is Google Workspace, so an account there can already
 * send as an address on the domain with no new service and no new DNS.
 *
 * Why this path exists alongside Mandrill: Mandrill's free demo will only
 * deliver to addresses on our own verified domain, and the message this route
 * exists to send goes to a visitor — always an outside address. The demo
 * therefore cannot send the one mail that matters, while a Workspace account
 * can, at roughly 2,000 recipients a day.
 *
 * Port 465 with implicit TLS rather than 587 with STARTTLS: both work, but 465
 * is encrypted from the first byte, so a proxy that strips the STARTTLS verb
 * cannot silently downgrade the session to plaintext.
 */
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)

type Outcome = 'sent' | 'failed' | 'skipped'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Deliberately loose. The receiving mail server is the real authority on
 * whether an address exists; this only turns away obvious junk before we spend
 * API calls on it.
 */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

type SendArgs = {
  /**
   * The sending credential. Mandrill reads it as an API key; SMTP reads it as
   * the account password. One field rather than two because the caller picks the
   * transport and passes the matching secret, and a second optional field would
   * only create a state where neither or both are set.
   */
  apiKey: string
  from: string
  to: string
  replyTo?: string
  subject: string
  html: string
  text: string
}

/**
 * Splits a `Name <addr@example.com>` value into the separate fields Mandrill
 * wants. A bare address is passed through with no display name, which is
 * valid — the inbox then shows the address itself.
 */
function parseFrom(from: string): { email: string; name?: string } {
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (!match) return { email: from.trim() }
  const [, name, email] = match
  return name ? { email: email.trim(), name } : { email: email.trim() }
}

async function sendMail({ apiKey, from, to, replyTo, subject, html, text }: SendArgs): Promise<Outcome> {
  const sender = parseFrom(from)

  try {
    const response = await fetch(MANDRILL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: apiKey,
        message: {
          from_email: sender.email,
          ...(sender.name ? { from_name: sender.name } : {}),
          to: [{ email: to, type: 'to' }],
          subject,
          html,
          text,
          // Reply-To has no dedicated field in this API; it goes through headers.
          ...(replyTo ? { headers: { 'Reply-To': replyTo } } : {}),
          track_opens: false,
          track_clicks: false,
        },
      }),
    })

    // A transport-level failure (bad key, invalid payload) arrives as non-2xx
    // with a JSON error body; the body is the part worth logging.
    if (!response.ok) {
      console.error(
        `[lead] Mailchimp Transactional ${response.status} sending to ${to}: ${await response.text()}`,
      )
      return 'failed'
    }

    /**
     * The important difference from most send APIs: a 200 does not mean the mail
     * was accepted. Per-recipient outcomes come back in the body, and a rejected
     * address (unsigned sending domain, suppression list, hard bounce history)
     * looks like success at the HTTP layer. Treating 200 as sent would make the
     * confirmation page promise an email that Mandrill had already dropped.
     */
    const results = (await response.json()) as
      | Array<{ email?: string; status?: string; reject_reason?: string | null }>
      | { status?: string; message?: string }

    if (!Array.isArray(results)) {
      console.error(`[lead] Mailchimp Transactional unexpected reply sending to ${to}:`, results)
      return 'failed'
    }

    // 'queued' and 'scheduled' are accepted-for-delivery, not failures.
    const accepted = results.some(
      (result) => result.status === 'sent' || result.status === 'queued' || result.status === 'scheduled',
    )

    if (!accepted) {
      const detail = results
        .map((result) => `${result.email ?? to}: ${result.status ?? 'unknown'}${result.reject_reason ? ` (${result.reject_reason})` : ''}`)
        .join('; ')
      console.error(`[lead] Mailchimp Transactional refused ${to} — ${detail}`)
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    console.error(`[lead] Mailchimp Transactional request threw sending to ${to}:`, error)
    return 'failed'
  }
}

/**
 * Sends the same message over SMTP. Deliberately the same signature and the same
 * return values as sendMail, so the caller picks a transport once and the rest
 * of the handler is unaware of which one it got.
 *
 * `apiKey` carries the SMTP password here. The field keeps its name because the
 * two senders share SendArgs; renaming it to suit this one would misname it for
 * Mandrill, which really does take an API key.
 *
 * nodemailer is imported inside the function so it is only loaded when SMTP is
 * configured. It is a Node-only package, which is legal here solely because of
 * `runtime = 'nodejs'` at the top of this file — an edge runtime could not load it.
 */
async function sendMailSmtp({
  apiKey: pass,
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: SendArgs): Promise<Outcome> {
  const user = process.env.SMTP_USER ?? ''
  const declared = parseFrom(from)

  /**
   * Gmail will not send as an address that is neither the authenticated mailbox
   * nor an alias confirmed under Settings → Accounts → "Send mail as". Rather
   * than let a stale LEAD_FROM_EMAIL become a rejection we only discover from
   * the logs, the display name is kept and the address is forced to the account
   * that actually authenticated.
   */
  const sameAddress = declared.email.toLowerCase() === user.toLowerCase()
  const sender = sameAddress ? declared : { email: user, name: declared.name }

  if (!sameAddress) {
    console.warn(
      `[lead] LEAD_FROM_EMAIL (${declared.email}) is not the SMTP account (${user}); sending as the account instead.`
    )
  }

  try {
    const nodemailer = await import('nodemailer')

    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user, pass },
    })

    const result = await transport.sendMail({
      from: sender.name ? { name: sender.name, address: sender.email } : sender.email,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    })

    /**
     * The same caution the Mandrill path needs, for a different reason: a
     * resolved promise means the server accepted the session, not that it
     * accepted the recipient. nodemailer reports both lists, so the address has
     * to appear in `accepted` before the visitor is told mail is on its way.
     */
    if (result.rejected?.length || !result.accepted?.length) {
      console.error(`[lead] SMTP refused ${to} — server said: ${result.response ?? 'nothing'}`)
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    console.error(`[lead] SMTP request threw sending to ${to}:`, error)
    return 'failed'
  }
}

/** Mirrors the submission into Formspree so a record exists off our own stack. */
async function forwardToFormspree(lead: Lead): Promise<Outcome> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        form_type: lead.kind === 'visit' ? 'Visit Booking' : 'Brand Inquiry',
        name: lead.name,
        email: lead.email,
        message: lead.message,
        ...(lead.company ? { company: lead.company } : {}),
        ...(lead.inquiryType ? { inquiry_type: lead.inquiryType } : {}),
        ...(lead.plannedVisitDate ? { planned_visit_date: lead.plannedVisitDate } : {}),
        ...(lead.groupSize ? { group_size: lead.groupSize } : {}),
      }),
    })

    if (!response.ok) {
      console.error(`[lead] Formspree ${response.status}: ${await response.text()}`)
      return 'failed'
    }
    return 'sent'
  } catch (error) {
    console.error('[lead] Formspree request threw:', error)
    return 'failed'
  }
}

/**
 * Accepts both a JSON body (the fetch path, which keeps the visitor on the page)
 * and a form-encoded one (a plain browser form submit). The second exists so
 * /contact keeps working with JavaScript disabled, as it did when it posted
 * straight to Formspree — switching it to fetch alone would have quietly
 * removed that.
 */
async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await request.json()
    } catch {
      return null
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    try {
      const form = await request.formData()
      const entries: Record<string, unknown> = {}
      form.forEach((value, key) => {
        if (typeof value === 'string') entries[key] = value
      })
      return entries
    } catch {
      return null
    }
  }

  return null
}

/** A browser form submit wants a page back, not JSON. */
function wantsHtml(request: Request): boolean {
  return !(request.headers.get('accept') ?? '').includes('application/json')
}

function htmlThankYou(heading: string, detail: string, status = 200) {
  return new Response(
    `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${heading} — INNO100</title></head>
<body style="margin:0;background:#f6f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;padding:80px 24px;">
    <h1 style="font-size:28px;margin:0 0 16px;">${heading}</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 28px;color:#4a4a4a;">${detail}</p>
    <a href="https://inno100.ai" style="color:#2B7A8F;font-weight:500;">Back to inno100.ai</a>
  </div>
</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function POST(request: Request) {
  const asHtml = wantsHtml(request)
  const body = await readBody(request)

  if (!body) {
    return asHtml
      ? htmlThankYou('Something went wrong', 'We could not read that submission. Please try again.', 400)
      : json({ error: 'Expected a JSON or form-encoded body.' }, 400)
  }

  /* Honeypot. A field no human sees and no real submission fills in. Answered
     with a plain success rather than an error so a bot learns nothing from the
     response, but nothing is sent or recorded. */
  if (asString(body.website_url)) {
    return asHtml ? htmlThankYou('Thank you', 'Your message has been received.') : json({ ok: true })
  }

  const email = asString(body.email).toLowerCase()
  if (!looksLikeEmail(email)) {
    return asHtml
      ? htmlThankYou(
          'That email looks wrong',
          'Please go back and check the address you entered, so we can reply to you.',
          400
        )
      : json({ error: 'A valid email address is required.' }, 400)
  }

  /* /visit sends kind directly; a no-JS /contact post carries form_type. */
  const kind: LeadKind =
    body.kind === 'visit' || asString(body.form_type) === 'Visit Booking' ? 'visit' : 'inquiry'

  const lead: Lead = {
    kind,
    email,
    name: asString(body.name).slice(0, 200),
    message: asString(body.message).slice(0, 5000),
    company: asString(body.company).slice(0, 200) || undefined,
    inquiryType: asString(body.inquiry_type).slice(0, 100) || undefined,
    plannedVisitDate: asString(body.planned_visit_date).slice(0, 100) || undefined,
    groupSize: asString(body.group_size).slice(0, 100) || undefined,
  }

  const teamEmail = process.env.LEAD_TEAM_EMAIL || DEFAULT_TEAM_EMAIL

  /**
   * Transport selection. SMTP wins when it is configured, because it is the only
   * one of the two that can reach a visitor's own address — see the SMTP_HOST
   * comment above. Mandrill stays as the alternative so that switching back is a
   * change of environment variables rather than a change of code.
   *
   * `credential` is the API key or the SMTP password depending on which branch
   * this took; both travel in the same SendArgs field.
   */
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const mandrillKey = process.env.MAILCHIMP_TRANSACTIONAL_API_KEY
  const useSmtp = Boolean(smtpUser && smtpPass)

  const send = useSmtp ? sendMailSmtp : sendMail
  const credential = useSmtp ? smtpPass! : mandrillKey
  /* Gmail overrides this with the authenticated account anyway; the fallback
     matters only for the Mandrill branch, where the domain is what we verified. */
  const from = process.env.LEAD_FROM_EMAIL || (useSmtp ? smtpUser! : '')

  let notified: Outcome = 'skipped'
  let autoreplied: Outcome = 'skipped'

  if (credential && from) {
    const notification = teamNotification(lead)
    notified = await send({
      apiKey: credential,
      from,
      to: teamEmail,
      // Reply goes to the visitor, so answering is one tap from the phone.
      replyTo: lead.email,
      ...notification,
    })

    const intro = autoresponse(lead)
    autoreplied = await send({
      apiKey: credential,
      from,
      to: lead.email,
      replyTo: teamEmail,
      ...intro,
    })
  } else {
    console.warn(
      '[lead] No sending transport configured (set SMTP_USER + SMTP_PASS, or MAILCHIMP_TRANSACTIONAL_API_KEY + LEAD_FROM_EMAIL); email step skipped.'
    )
  }

  /**
   * Both remaining channels are independent of each other and of the mail above,
   * so they run together rather than in sequence — this route is on the visitor's
   * critical path, and two round trips one after the other is the difference they
   * would actually feel.
   */
  const [recorded, subscribed] = await Promise.all([
    forwardToFormspree(lead),
    subscribeLead(lead),
  ])

  /* The visitor sees success if the lead survived anywhere. Only a total
     failure — nothing sent, nothing recorded, nobody added — is worth asking
     them to retry, because that is the only case where retrying changes
     anything. A contact in the audience counts: it is a durable record we can
     act on, even though it reaches us through Mailchimp rather than an inbox. */
  const captured = notified === 'sent' || recorded === 'sent' || subscribed === 'sent'

  if (!captured) {
    console.error('[lead] Nothing captured this submission.', {
      notified,
      recorded,
      subscribed,
      autoreplied,
    })
    return asHtml
      ? htmlThankYou(
          'That did not go through',
          `Please email us directly at ${teamEmail} so your message is not lost.`,
          502
        )
      : json({ error: 'We could not record your message. Please email us directly.' }, 502)
  }

  if (asHtml) {
    return htmlThankYou(
      'Thank you — we have your message',
      autoreplied === 'sent'
        ? 'A confirmation with everything you need is on its way to your inbox. We aim to reply within two working days.'
        : 'We aim to reply within two working days.'
    )
  }

  return json({ ok: true, notified, autoreplied, recorded, subscribed })
}
