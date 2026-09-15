/**
 * Email bodies for the two things a form submission should trigger: an
 * introduction sent back to the visitor, and a notification sent to the team.
 *
 * Kept out of the route handler because the copy is the part that gets reviewed
 * and edited, and because it is provider-independent — if the sending service
 * changes, these strings do not.
 *
 * Every template returns both `html` and `text`. Sending a text/plain
 * alternative alongside the HTML is not politeness, it materially lowers the
 * spam score: an HTML-only machine-generated mail is one of the cheapest things
 * for a filter to reject, which is exactly how the previous notifications died.
 *
 * All factual claims here are drawn from the public site (app/visit/page.tsx,
 * app/page.tsx) so the mail cannot drift out of step with what we publish.
 */

const SITE_URL = 'https://inno100.ai'
const TEAM_EMAIL = 'brand@inno100.group'

const ADDRESS_EN = 'Level 1, North Hall, Shenzhen Bay Culture Square, Nanshan District, Shenzhen'
const ADDRESS_CN = '深圳市南山区深圳湾文化广场北馆 L1'
const HOURS = 'Every day, 10:00 – 22:00'

export type LeadKind = 'visit' | 'inquiry'

export type Lead = {
  kind: LeadKind
  name: string
  email: string
  message: string
  /** Brand inquiries only. */
  company?: string
  inquiryType?: string
  /** Visit bookings only. */
  plannedVisitDate?: string
  groupSize?: string
}

/**
 * Visitor-supplied values are interpolated into HTML, so they are escaped even
 * though the destination is an inbox rather than a browser. Several mail
 * clients render enough HTML for an unescaped value to break the layout or
 * smuggle in a link, and the same values are echoed to the team.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** First name only, for the greeting. Falls back to a neutral opener. */
function greeting(name: string): string {
  const first = name.trim().split(/\s+/)[0]
  return first ? `Hi ${first},` : 'Hello,'
}

/**
 * Wraps a plain-text paragraph to a fixed column.
 *
 * Used wherever a sentence carries an interpolated value. Hard-wrapping such a
 * line in the source only looks right for one length of input — an inquiry type
 * or a long name pushes it well past the margin in the recipient's client —
 * so the wrapping is computed from the finished string instead.
 */
function wrapText(paragraph: string, width = 78): string {
  const lines: string[] = []
  let line = ''

  for (const word of paragraph.split(/\s+/).filter(Boolean)) {
    if (!line) {
      line = word
    } else if (`${line} ${word}`.length <= width) {
      line += ` ${word}`
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)

  return lines.join('\n')
}

const wrap = (bodyHtml: string) => `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f6f6f4;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e2e2de;margin:32px 0 16px;" />
    <p style="font-size:13px;color:#6b6b6b;margin:0;">
      INNO100 · ${ADDRESS_EN}<br />
      ${ADDRESS_CN}<br />
      <a href="${SITE_URL}" style="color:#2B7A8F;">inno100.ai</a>
    </p>
  </div>
</body>
</html>`

/** Rows of submitted values, echoed back so the visitor has a record. */
function detailRows(pairs: [string, string | undefined][]): { html: string; text: string } {
  const present = pairs.filter((pair): pair is [string, string] => Boolean(pair[1]?.trim()))
  if (!present.length) return { html: '', text: '' }

  const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;font-size:14px;">
    ${present
      .map(
        ([label, value]) =>
          `<tr><td style="padding:2px 16px 2px 0;color:#6b6b6b;vertical-align:top;">${escapeHtml(
            label
          )}</td><td style="padding:2px 0;">${escapeHtml(value)}</td></tr>`
      )
      .join('\n    ')}
  </table>`

  const text = present.map(([label, value]) => `${label}: ${value}`).join('\n')
  return { html, text }
}

/* ------------------------------------------------------------------ *
 * To the visitor
 * ------------------------------------------------------------------ */

function visitAutoresponse(lead: Lead) {
  const details = detailRows([
    ['Planned date', lead.plannedVisitDate],
    ['Group size', lead.groupSize],
  ])

  const html = wrap(`
    <p style="margin:0 0 20px;">${escapeHtml(greeting(lead.name))}</p>

    <p style="margin:0 0 20px;">Thanks for planning a visit to INNO100. We have your request, and someone from our team will follow up to confirm the details.</p>

    ${details.html ? `<p style="margin:0 0 8px;font-weight:600;">What you told us</p>${details.html}` : ''}

    <p style="margin:0 0 8px;font-weight:600;">What INNO100 is</p>
    <p style="margin:0 0 20px;">A Global Innovation Flagship Store in Shenzhen — 1,100 m² with over 112 global brands on the floor. Almost everything is out of the box and hands-on, from a string-less guitar and robot dogs to an AI tennis robot and 3D printers running live. New arrivals land every week, so the floor looks different month to month. It is also home to Kickstarter's first China location and the world's first Bambu Lab store.</p>

    <p style="margin:0 0 8px;font-weight:600;">Getting here</p>
    <p style="margin:0 0 20px;">
      ${ADDRESS_EN}<br />
      ${ADDRESS_CN}<br />
      Come in through the northeast entrance, next to Talent Park.
    </p>
    <p style="margin:0 0 20px;">
      <strong>Metro</strong> — Talent Park Station (Line 13), Exit B1, about a 5-minute walk. Or Houhai Station (Line 11), Exit K2, about 10 minutes.<br />
      <strong>From Hong Kong</strong> — Shenzhen Bay Port is 2.6 km away.
    </p>

    <p style="margin:0 0 20px;"><strong>Opening hours</strong> — ${HOURS}.</p>

    <p style="margin:0 0 20px;">Anything you need before you arrive? Reply to this email and it reaches us directly.</p>

    <p style="margin:0;">See you at Shenzhen Bay.<br />The INNO100 team</p>
  `)

  const text = `${greeting(lead.name)}

Thanks for planning a visit to INNO100. We have your request, and someone from
our team will follow up to confirm the details.
${details.text ? `\nWhat you told us\n${details.text}\n` : ''}
WHAT INNO100 IS
A Global Innovation Flagship Store in Shenzhen - 1,100 m2 with over 112 global
brands on the floor. Almost everything is out of the box and hands-on, from a
string-less guitar and robot dogs to an AI tennis robot and 3D printers running
live. New arrivals land every week, so the floor looks different month to month.
It is also home to Kickstarter's first China location and the world's first
Bambu Lab store.

GETTING HERE
${ADDRESS_EN}
${ADDRESS_CN}
Come in through the northeast entrance, next to Talent Park.

Metro - Talent Park Station (Line 13), Exit B1, about a 5-minute walk.
        Or Houhai Station (Line 11), Exit K2, about 10 minutes.
From Hong Kong - Shenzhen Bay Port is 2.6 km away.

OPENING HOURS
${HOURS}.

Anything you need before you arrive? Reply to this email and it reaches us
directly.

See you at Shenzhen Bay.
The INNO100 team

--
INNO100 · ${ADDRESS_EN}
${ADDRESS_CN}
${SITE_URL}`

  return {
    subject: 'Your visit to INNO100 — what to know before you arrive',
    html,
    text,
  }
}

function inquiryAutoresponse(lead: Lead) {
  const about = lead.inquiryType ? ` about ${lead.inquiryType.toLowerCase()}` : ''

  const details = detailRows([
    ['Company', lead.company],
    ['Inquiry type', lead.inquiryType],
  ])

  const html = wrap(`
    <p style="margin:0 0 20px;">${escapeHtml(greeting(lead.name))}</p>

    <p style="margin:0 0 20px;">Thanks for getting in touch${escapeHtml(
      about
    )}. Your message has reached our team, and we aim to reply within two working days.</p>

    ${details.html ? `<p style="margin:0 0 8px;font-weight:600;">What you told us</p>${details.html}` : ''}

    <p style="margin:0 0 8px;font-weight:600;">Who we are, briefly</p>
    <p style="margin:0 0 20px;">INNO100 is a Global Innovation Flagship Store in Shenzhen Bay — 1,100 m² carrying over 112 global brands, across consumer robotics, AI hardware, 3D printing and maker tools. More than 512,780 visitors have come through the door, and we host over 100 international guests a day. Kickstarter chose us for its first China location, and we run the world's first Bambu Lab store.</p>

    <p style="margin:0 0 20px;">For a brand, that makes the floor somewhere a product gets into real hands — and in front of the media, buyers and delegations who come through every week.</p>

    <p style="margin:0 0 8px;font-weight:600;">If you would like to see it first</p>
    <p style="margin:0 0 20px;">
      ${ADDRESS_EN}<br />
      ${ADDRESS_CN}<br />
      Open ${HOURS.toLowerCase()}. You can plan a visit at <a href="${SITE_URL}/visit" style="color:#2B7A8F;">inno100.ai/visit</a>.
    </p>

    <p style="margin:0 0 20px;">Replying to this email reaches us directly.</p>

    <p style="margin:0;">Best regards,<br />The INNO100 team</p>
  `)

  const text = `${greeting(lead.name)}

${wrapText(
  `Thanks for getting in touch${about}. Your message has reached our team, and we aim to reply within two working days.`
)}
${details.text ? `\nWhat you told us\n${details.text}\n` : ''}
WHO WE ARE, BRIEFLY
INNO100 is a Global Innovation Flagship Store in Shenzhen Bay - 1,100 m2
carrying over 112 global brands, across consumer robotics, AI hardware, 3D
printing and maker tools. More than 512,780 visitors have come through the
door, and we host over 100 international guests a day. Kickstarter chose us for
its first China location, and we run the world's first Bambu Lab store.

For a brand, that makes the floor somewhere a product gets into real hands -
and in front of the media, buyers and delegations who come through every week.

IF YOU WOULD LIKE TO SEE IT FIRST
${ADDRESS_EN}
${ADDRESS_CN}
Open ${HOURS.toLowerCase()}. You can plan a visit at ${SITE_URL}/visit

Replying to this email reaches us directly.

Best regards,
The INNO100 team

--
INNO100 · ${ADDRESS_EN}
${ADDRESS_CN}
${SITE_URL}`

  return {
    subject: 'Thanks for your inquiry — about INNO100',
    html,
    text,
  }
}

/** The introduction sent back to whoever filled in the form. */
export function autoresponse(lead: Lead) {
  return lead.kind === 'visit' ? visitAutoresponse(lead) : inquiryAutoresponse(lead)
}

/* ------------------------------------------------------------------ *
 * To the team
 * ------------------------------------------------------------------ */

/**
 * Deliberately plain. The point is that it arrives and is scannable on a phone,
 * and that hitting reply writes to the visitor rather than to us — the route
 * sets Reply-To to their address.
 */
export function teamNotification(lead: Lead) {
  const label = lead.kind === 'visit' ? 'Visit booking' : 'Brand inquiry'

  const rows: [string, string | undefined][] =
    lead.kind === 'visit'
      ? [
          ['Name', lead.name],
          ['Email', lead.email],
          ['Planned date', lead.plannedVisitDate],
          ['Group size', lead.groupSize],
        ]
      : [
          ['Name', lead.name],
          ['Email', lead.email],
          ['Company', lead.company],
          ['Inquiry type', lead.inquiryType],
        ]

  const details = detailRows(rows)
  const messageBlock = lead.message.trim()

  const html = wrap(`
    <p style="margin:0 0 20px;font-weight:600;">${label} — ${escapeHtml(lead.name || lead.email)}</p>
    ${details.html}
    ${
      messageBlock
        ? `<p style="margin:0 0 8px;font-weight:600;">Message</p>
           <div style="white-space:pre-wrap;padding:12px 16px;background:#f0f0ed;border-radius:6px;margin:0 0 20px;">${escapeHtml(
             messageBlock
           )}</div>`
        : '<p style="margin:0 0 20px;color:#6b6b6b;">No message included.</p>'
    }
    <p style="margin:0;font-size:14px;color:#6b6b6b;">Reply to this email to answer ${escapeHtml(
      lead.email
    )} directly. They have already received an automatic introduction.</p>
  `)

  const text = `${label} — ${lead.name || lead.email}

${details.text}

Message
${messageBlock || '(none)'}

--
Reply to this email to answer ${lead.email} directly.
They have already received an automatic introduction.`

  return {
    subject: `${label}: ${lead.name || lead.email}`,
    html,
    text,
  }
}
