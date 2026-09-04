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

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdllgoj'

export default function VisitForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      trackEvent('form_submit', { form_name: 'visit_booking' })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Book Your Visit</h2>
        <p className="text-gray-700 leading-relaxed">
          We&apos;ve received your visit plan! See you at INNO100 — Shenzhen Bay Culture
          Square, open daily 10 AM – 10 PM.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-8">Book Your Visit</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="form_type" value="Visit Booking" />

        <div>
          <label htmlFor="visit-name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            id="visit-name"
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="visit-email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="visit-email"
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="visit-date" className="block text-sm font-medium mb-2">
            Planned Visit Date
          </label>
          <input
            id="visit-date"
            type="date"
            name="planned_visit_date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="visit-group-size" className="block text-sm font-medium mb-2">
            Group Size
          </label>
          <select
            id="visit-group-size"
            name="group_size"
            defaultValue=""
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          >
            <option value="">Select an option</option>
            <option value="Just me">Just me</option>
            <option value="2-5 people">2–5 people</option>
            <option value="6-10 people">6–10 people</option>
            <option value="10+ people">10+ people</option>
          </select>
        </div>

        <div>
          <label htmlFor="visit-message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="visit-message"
            name="message"
            rows={5}
            placeholder="Anything you'd like us to know? Special requests, group type, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600">
            Something went wrong submitting your visit plan. Please try again, or email us
            directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending...' : 'Confirm Visit'}
        </button>
      </form>
    </div>
  )
}
