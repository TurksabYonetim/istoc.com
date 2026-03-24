import Alpine from 'alpinejs'
import { initLinkRewriter } from '../utils/url'

// Import all Alpine.data() module registrations (side-effect imports)
import './orders'
import './remittance'
import './coupons'
import './product'
import './cart'
import './checkout'
import './auth'
import './settings'
import './dashboard'
import './messages'
import './sidebar'
import './products-filter'
import './shared'
import './help'
import './legal'
import './seller'

// Augment Window interface for Alpine global access (debugging)
declare global {
  interface Window {
    Alpine: typeof Alpine
  }
}

window.Alpine = Alpine;

/**
 * Start Alpine.js. MUST be called AFTER:
 * 1. All Alpine.data() registrations above
 * 2. The page HTML has been injected into #app via innerHTML
 *
 * Do NOT call at module import time — Alpine won't find directives in
 * elements that don't exist in the DOM yet.
 */
export function startAlpine(): void {
  initLinkRewriter();
  Alpine.start();
}
