import { autoresponse, teamNotification, type Lead, type LeadKind } from '@/lib/email-templates'

/**
 * Single endpoint behind both site forms (/contact and /visit).
 *
 * It does three things, in descending order of importance:
 *
 *   1. Records the lead. A submission must never be lost, so this is attempted
 *      through every configured channel and the response is 200 if *any* of
 *      them succeeded.
 *   2. Notifies the team, so someone can actually reply.
 *   3. Sends the visitor an automatic introduction — the thing this route was
 *      added for.
 *
 * Why a server route at all, rather than Mailchimp's embed code as originally
 * suggested: the embed replaces our markup with Mailchimp's, which would lose
 * the site's styling, the GA4 events, the custom fields (planned date, group
 * size, inquiry type) and the team notification. Posting from here keeps all of
 * that and keeps every credential on the server, out of the client bundle.
 *
 * Why Mailchimp Transactional rather than a Marketing Automation Flow: this mail
 * has to leave the moment the form is submitted, and it carries per-submission
 * detail (planned date, group size, inquiry type). A Flow would need each of
 * those as a synced audience field and would move the copy into Mailchimp's
 * editor, away from review in this repo. The trade-off is cost — Transactional
 * is billed in blocks on top of the marketing plan.
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

  const apiKey = process.env.MAILCHIMP_TRANSACTIONAL_API_KEY
  const from = process.env.LEAD_FROM_EMAIL
  const teamEmail = process.env.LEAD_TEAM_EMAIL || DEFAULT_TEAM_EMAIL

  let notified: Outcome = 'skipped'
  let autoreplied: Outcome = 'skipped'

  if (apiKey && from) {
    const notification = teamNotification(lead)
    notified = await sendMail({
      apiKey,
      from,
      to: teamEmail,
      // Reply goes to the visitor, so answering is one tap from the phone.
      replyTo: lead.email,
      ...notification,
    })

    const intro = autoresponse(lead)
    autoreplied = await sendMail({
      apiKey,
      from,
      to: lead.email,
      replyTo: teamEmail,
      ...intro,
    })
  } else {
    console.warn(
      '[lead] MAILCHIMP_TRANSACTIONAL_API_KEY or LEAD_FROM_EMAIL unset; email step skipped.'
    )
  }

  const recorded = await forwardToFormspree(lead)

  /* The visitor sees success if the lead survived anywhere. Only a total
     failure — no mail sent and no record kept — is worth asking them to retry,
     because that is the only case where retrying changes anything. */
  const captured = notified === 'sent' || recorded === 'sent'

  if (!captured) {
    console.error('[lead] Nothing captured this submission.', { notified, recorded, autoreplied })
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

  return json({ ok: true, notified, autoreplied, recorded })
}
