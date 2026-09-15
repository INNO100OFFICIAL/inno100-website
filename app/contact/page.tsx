'use client'

import { useState } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/** Our own route: notifies the team, and sends the visitor an introduction. */
const LEAD_ENDPOINT = '/api/lead'

/**
 * Offered alongside the form rather than instead of it. A submission can be
 * accepted by the form backend and still never reach the team inbox — from the
 * visitor's side a bounced notification is indistinguishable from success — so
 * the address is always on the page as a route they control.
 */
const CONTACT_EMAIL = 'brand@inno100.group'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  /**
   * Whether the visitor's introduction email actually went out. Read from the
   * route's reply rather than assumed, so the confirmation never promises an
   * email that was skipped (no sending key configured) or refused by the
   * provider. Telling someone to check their inbox for mail that was never sent
   * is worse than saying nothing.
   */
  const [autoreplied, setAutoreplied] = useState(false)

  /**
   * Progressive enhancement over the form's own action. The <form> keeps a real
   * action and method, so with JavaScript off the browser posts normally and the
   * route answers with an HTML page. With JavaScript on, this intercepts and
   * keeps the visitor here instead of navigating away — which is also what makes
   * the GA4 event reliable, since a native submit can unload the page before the
   * beacon leaves.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      // A missing or unreadable flag is treated as "not sent" on purpose: the
      // fallback wording is correct either way, an over-promise is not.
      const result = await response.json().catch(() => null)
      setAutoreplied(result?.autoreplied === 'sent')

      trackEvent('form_submit', { form_name: 'brand_inquiry' })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            Get in touch with INNO100 for brand partnerships and inquiries.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600">
                    Shenzhen Bay Culture Square<br />
                    Nanshan District<br />
                    Shenzhen, China
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 10:00 AM - 10:00 PM
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Enquiry%20-%20INNO100`}
                      onClick={() => trackEvent('email_click', { source: 'contact_details' })}
                      className="hover:text-black transition underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Brand Partnership</h3>
                  <p className="text-gray-600 mb-4">
                    Interested in featuring your product at INNO100? We'd love to hear from you.
                  </p>
                  <a
                    href="#contact-form"
                    onClick={() => trackEvent('cta_click', { cta_name: 'submit_inquiry_link' })}
                    className="text-black font-medium hover:text-gray-600 transition"
                  >
                    Submit Your Inquiry →
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/inno100_official/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'instagram' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://x.com/INNO100OFFICIAL"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'x' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      X
                    </a>
                    <a
                      href="https://www.youtube.com/@INNO100_Official"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'youtube' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      YouTube
                    </a>
                    <a
                      href="https://www.linkedin.com/company/inno100-store"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'linkedin' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://www.tripadvisor.com/Attraction_Review-g297415-d34534030-Reviews-INNO100-Shenzhen_Guangdong.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'tripadvisor' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      TripAdvisor
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div id="contact-form" className="bg-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-8">Brand Inquiry Form</h2>
              {status === 'success' ? (
                <div>
                  {/* Only claims an email was sent when the route confirms one was.
                      Promising an introduction that never arrives is worse than
                      promising nothing. */}
                  <p className="text-gray-700 leading-relaxed">
                    {autoreplied
                      ? 'Thanks — your inquiry has reached us, and we’ve sent you an introduction to INNO100 by email. We aim to reply within two working days.'
                      : 'Thanks — your inquiry has reached us. We aim to reply within two working days.'}
                  </p>
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                    {autoreplied ? 'Nothing in your inbox? Check your spam folder, or email' : 'You can also email'}
                    {' '}us directly at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Brand%20inquiry%20-%20INNO100`}
                      onClick={() => trackEvent('email_click', { source: 'contact_form_success' })}
                      className="font-medium text-gray-900 underline hover:no-underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              ) : (
              <form
                action={LEAD_ENDPOINT}
                method="POST"
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                {/* Honeypot: positioned off-screen rather than display:none, since
                    some bots skip hidden inputs but fill in everything else. No
                    human sees it, so any value in it marks the post as automated. */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label htmlFor="contact-website-url">Website</label>
                  <input
                    type="text"
                    id="contact-website-url"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                  <select
                    name="inquiry_type"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="">Select an option</option>
                    <option value="Product Purchase">Product Purchase</option>
                    <option value="Event Collaboration">Event Collaboration</option>
                    <option value="Business Reception">Business Reception</option>
                    <option value="Settlement Cooperation">Settlement Cooperation</option>
                    <option value="Media Coverage">Media Coverage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600">
                    We couldn&apos;t send that. Please try again, or email us directly at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Brand%20inquiry%20-%20INNO100`}
                      onClick={() => trackEvent('email_click', { source: 'contact_form_error' })}
                      className="font-medium underline hover:no-underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
                </button>

                <p className="text-sm text-gray-600 leading-relaxed">
                  We aim to reply within two working days. If you don&apos;t hear back,
                  please email us directly at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Brand%20inquiry%20-%20INNO100`}
                    onClick={() => trackEvent('email_click', { source: 'contact_form_footnote' })}
                    className="font-medium text-gray-900 underline hover:no-underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {' '}— your message may not have reached us.
                </p>
              </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
