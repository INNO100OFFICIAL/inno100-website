'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const AI_REFERRER_DOMAINS: Record<string, string> = {
  'chat.openai.com': 'chatgpt',
  'chatgpt.com': 'chatgpt',
  'gemini.google.com': 'gemini',
  'bard.google.com': 'gemini',
  'perplexity.ai': 'perplexity',
  'claude.ai': 'claude',
  'copilot.microsoft.com': 'copilot',
  'poe.com': 'poe',
  'you.com': 'you',
}

function detectAISource(referrer: string): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    for (const [domain, label] of Object.entries(AI_REFERRER_DOMAINS)) {
      if (host === domain.replace(/^www\./, '')) {
        return label
      }
    }
  } catch {
    return null
  }
  return null
}

export default function AIReferrerTracker() {
  useEffect(() => {
    const aiSource = detectAISource(document.referrer)
    if (aiSource && window.gtag) {
      window.gtag('event', 'ai_referral', {
        ai_source: aiSource,
        referrer_url: document.referrer,
      })
      try {
        sessionStorage.setItem('inno100_ai_source', aiSource)
      } catch {
        // sessionStorage unavailable, skip
      }
    }
  }, [])

  return null
}
