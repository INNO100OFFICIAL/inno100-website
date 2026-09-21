/**
 * Mailchimp Marketing (the audience/campaign side, not Transactional).
 *
 * Why this exists alongside the sending code in app/api/lead/route.ts: the
 * Transactional demo refuses any recipient outside our own verified domain —
 * verified by test, which came back `recipient-domain-mismatch` — and the mail
 * this site needs to send goes to a visitor, always an outside address. The
 * Marketing side has no such restriction: reaching external contacts is its
 * entire purpose, and it is already included in the account's Standard plan.
 *
 * The division of labour: this module puts the visitor in the audience and tags
 * them; a Journey in Mailchimp keyed on that tag sends the actual email. So the
 * copy for that mail lives in Mailchimp's editor rather than in
 * lib/email-templates.ts — a real cost of this route, and the reason the
 * templates file is kept rather than deleted.
 *
 * Subscribing is secondary to the visitor's actual request. Every failure here
 * is logged and returned as an outcome, never thrown, so a booking is never
 * lost to an email-marketing outage.
 */

import { createHash } from 'crypto'
import type { Lead } from '@/lib/email-templates'

export type SubscribeOutcome = 'sent' | 'failed' | 'skipped'

/**
 * Audience tags this site may apply. A Journey is triggered by one of these, so
 * the set is closed deliberately: a typo would silently create a new tag that
 * no Journey listens to, and the mail would never go out with nothing to show
 * why.
 */
const TAG_FOR_KIND = {
  visit: 'visit-booking',
  inquiry: 'brand-inquiry',
} as const

/**
 * Merge fields carrying the per-submission detail into the Journey's email.
 *
 * These have to exist in the audience before they can be written; Mailchimp
 * rejects an unknown tag rather than creating it. ensureMergeFields() below
 * creates any that are missing, which is why setup needs no dashboard clicking.
 *
 * `name` is what shows in the audience table, `tag` is what the email template
 * references as *|VISITDATE|* and so on. Kept short because Mailchimp caps a
 * merge tag at 10 characters.
 */
const MERGE_FIELDS = [
  { tag: 'VISITDATE', name: 'Planned visit date', type: 'text' },
  { tag: 'GROUPSIZE', name: 'Group size', type: 'text' },
  { tag: 'INQTYPE', name: 'Inquiry type', type: 'text' },
  { tag: 'COMPANY', name: 'Company', type: 'text' },
] as const

/** Mailchimp keys end in their datacenter, e.g. "…-us14". */
function datacenterFrom(apiKey: string): string | null {
  const suffix = apiKey.split('-').pop()
  return suffix && /^[a-z]{2}\d+$/.test(suffix) ? suffix : null
}

type Config = { base: string; auth: string }

/**
 * Resolves the credentials into everything a request needs, or null when the
 * integration is unconfigured — which is a normal state, not an error, so the
 * caller skips rather than fails.
 */
function config(): Config | null {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  if (!apiKey || !audienceId) return null

  const datacenter = process.env.MAILCHIMP_SERVER_PREFIX || datacenterFrom(apiKey)
  if (!datacenter) {
    console.warn('[mailchimp] Could not determine the datacenter from the API key.')
    return null
  }

  return {
    base: `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}`,
    /* Basic auth with any username and the key as the password — Mailchimp's
       documented scheme for the Marketing API. */
    auth: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
  }
}

/**
 * Creates the merge fields this module writes, skipping any that already exist.
 *
 * Safe to call on every submission: it reads the current list first and only
 * POSTs what is missing, so the steady state is one extra GET. That is cheaper
 * than the alternative — a missing field makes Mailchimp reject the whole
 * upsert, losing the contact rather than just the detail.
 */
async function ensureMergeFields({ base, auth }: Config): Promise<void> {
  try {
    const response = await fetch(`${base}/merge-fields?count=100`, {
      headers: { Authorization: auth },
    })
    if (!response.ok) {
      console.warn(`[mailchimp] Could not read merge fields (${response.status}); skipping setup.`)
      return
    }

    const body = (await response.json()) as { merge_fields?: Array<{ tag?: string }> }
    const existing = new Set((body.merge_fields ?? []).map((field) => field.tag))

    for (const field of MERGE_FIELDS) {
      if (existing.has(field.tag)) continue

      const created = await fetch(`${base}/merge-fields`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tag: field.tag,
          name: field.name,
          type: field.type,
          /* Not required on the form, so an inquiry with no visit date is still
             a valid contact. */
          required: false,
          public: false,
        }),
      })

      if (created.ok) {
        console.info(`[mailchimp] Created merge field ${field.tag}.`)
      } else {
        console.warn(`[mailchimp] Could not create ${field.tag} (${created.status}): ${await created.text()}`)
      }
    }
  } catch (error) {
    console.warn('[mailchimp] Merge-field setup threw; continuing without it:', error)
  }
}

/**
 * Adds the visitor to the audience and tags them so the Journey fires.
 *
 * Returns 'skipped' when unconfigured, 'sent' once the contact is in the
 * audience with its tag applied, 'failed' otherwise. 'sent' means Mailchimp
 * accepted the contact — not that any email has left, since the Journey sends
 * on its own schedule. Callers must not use this to tell a visitor their mail
 * is on the way.
 */
export async function subscribeLead(lead: Lead): Promise<SubscribeOutcome> {
  const settings = config()
  if (!settings) {
    console.warn('[mailchimp] MAILCHIMP_API_KEY or MAILCHIMP_AUDIENCE_ID unset; subscribe skipped.')
    return 'skipped'
  }

  const { base, auth } = settings
  await ensureMergeFields(settings)

  const [firstName = '', ...restOfName] = lead.name.split(/\s+/).filter(Boolean)
  /* Mailchimp addresses a contact by the MD5 of its lowercased address. */
  const subscriberHash = createHash('md5').update(lead.email.toLowerCase()).digest('hex')

  try {
    /* `status_if_new` subscribes a first-time sender but leaves an existing
       contact's status alone, so someone who previously unsubscribed is not
       silently resubscribed by filling in a form. */
    const upsert = await fetch(`${base}/members/${subscriberHash}`, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_address: lead.email,
        status_if_new: 'subscribed',
        merge_fields: {
          ...(firstName ? { FNAME: firstName } : {}),
          ...(restOfName.length ? { LNAME: restOfName.join(' ') } : {}),
          ...(lead.plannedVisitDate ? { VISITDATE: lead.plannedVisitDate } : {}),
          ...(lead.groupSize ? { GROUPSIZE: lead.groupSize } : {}),
          ...(lead.inquiryType ? { INQTYPE: lead.inquiryType } : {}),
          ...(lead.company ? { COMPANY: lead.company } : {}),
        },
      }),
    })

    if (!upsert.ok) {
      console.error(`[mailchimp] Upsert ${upsert.status}: ${await upsert.text()}`)
      return 'failed'
    }

    /* Tagging is a second call on purpose: the tags field on the upsert
       endpoint is only honoured when the contact is created, so a returning
       visitor would never be tagged — and the tag is what triggers the
       Journey. */
    const tagged = await fetch(`${base}/members/${subscriberHash}/tags`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: [{ name: TAG_FOR_KIND[lead.kind], status: 'active' }] }),
    })

    if (!tagged.ok) {
      /* The contact is saved but nothing will send. Reported as a failure
         because the mail is the point, and a silent success here would be
         indistinguishable from a working Journey. */
      console.error(`[mailchimp] Tagging ${tagged.status}: ${await tagged.text()}`)
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    console.error('[mailchimp] Request threw:', error)
    return 'failed'
  }
}
