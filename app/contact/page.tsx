'use client'

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

export default function Contact() {
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
                      href="https://www.linkedin.com/company/inno100-store/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('social_click', { social_network: 'linkedin' })}
                      className="text-gray-600 hover:text-black transition"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div id="contact-form" className="bg-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-8">Brand Inquiry Form</h2>
              <form
                action="https://formspree.io/f/mzdllgoj"
                method="POST"
                className="space-y-6"
                onSubmit={() => trackEvent('form_submit', { form_name: 'brand_inquiry' })}
              >
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
                    <option value="Visit Reception">Visit Reception</option>
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

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
