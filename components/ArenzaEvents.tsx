'use client'

import Script from 'next/script'
import { ARENZA_INSTALL_ID, arenzaEnabled, type ArenzaClient } from '@/lib/arenza'

/**
 * Loads the Arenza SDK and prepares its session credential.
 *
 * The docs show two script tags, where the second assumes the first has already
 * run. next/script does not guarantee that order between separate tags, so we
 * initialise from this tag's onLoad instead — at that point window.arenzaEvents
 * definitely exists.
 *
 * Renders nothing when the install ID is unset, so preview deployments and
 * local development do not report events.
 */
export default function ArenzaEvents() {
  if (!arenzaEnabled) return null

  return (
    <Script
      src="https://arenza.ai/sdk/v1.js"
      data-arenza-install-id={ARENZA_INSTALL_ID}
      strategy="afterInteractive"
      onLoad={() => {
        const client = window.arenzaEvents
        if (!client) {
          console.warn('Arenza SDK loaded without initialising.')
          return
        }

        // Held as a promise so a form submitted while init is still in flight
        // waits for the credential rather than dropping the event.
        window.arenzaReady = client.init().then(() => client as ArenzaClient)
        window.arenzaReady.catch(() => {
          console.warn('Arenza initialization failed.')
        })
      }}
      onError={() => {
        console.warn('Arenza SDK failed to load.')
      }}
    />
  )
}
