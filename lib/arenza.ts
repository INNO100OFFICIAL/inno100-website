/**
 * Arenza event reporting — https://arenza.ai/docs/zh-CN/events
 *
 * We report from the browser, not the server: the docs allow only one of the
 * two per event, and the trigger we want (a form the visitor actually
 * completed) is a client-side fact. Reporting from /api/lead would mean
 * threading the visitor ID through the request and would double-report if this
 * ever stayed in place.
 *
 * The install ID is a public brand identifier, not a secret, so NEXT_PUBLIC_ is
 * correct here. When it is unset every function below is a no-op, which keeps
 * local development and preview deployments from reporting events.
 */

export interface ArenzaClient {
  init: () => Promise<unknown>
  track: () => Promise<unknown>
  getVisitorId: () => string
  stop: () => void
}

declare global {
  interface Window {
    /** Created by the SDK script once it loads. */
    arenzaEvents?: ArenzaClient
    /** Set by <ArenzaEvents />; resolves when the session credential is ready. */
    arenzaReady?: Promise<ArenzaClient>
  }
}

export const ARENZA_INSTALL_ID = process.env.NEXT_PUBLIC_ARENZA_INSTALL_ID ?? ''

/**
 * Checked against the documented prefix rather than merely non-empty, so a
 * half-filled environment variable fails closed instead of loading the SDK
 * with a value that cannot work.
 */
export const arenzaEnabled = ARENZA_INSTALL_ID.startsWith('arz_pub_')

/**
 * Report one event. Call this only where the business outcome is already
 * confirmed — after a successful submission, never in a validation or error
 * branch — because the SDK has no named event types, so every call is
 * indistinguishable in Arenza's reporting.
 *
 * Fire-and-forget by design: a reporting failure must not change what the
 * visitor sees, so this never throws and never blocks the caller.
 */
export function trackArenzaEvent(): void {
  if (!arenzaEnabled || typeof window === 'undefined') return

  const ready = window.arenzaReady
  if (!ready) {
    // The SDK has not finished loading, or was blocked. Dropping the event is
    // the right trade: the alternative is queueing work that outlives the page.
    return
  }

  void ready
    .then((client) => client.track())
    .catch(() => {
      console.warn('Arenza event could not be sent.')
    })
}

/**
 * The SDK's visitor ID, for correlating a server-side report with this
 * visitor's browsing. Reading it sends nothing. Unused today — we report from
 * the browser — and kept only because moving to server-side reporting needs it.
 */
export function getArenzaVisitorId(): string | null {
  if (!arenzaEnabled || typeof window === 'undefined') return null
  try {
    return window.arenzaEvents?.getVisitorId() ?? null
  } catch {
    return null
  }
}
