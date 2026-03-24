/**
 * AddressAutocomplete Component (C8)
 * Dark popup showing saved address suggestion near the State dropdown.
 * Clicking the saved address fills ALL form fields.
 *
 * Interactivity handled by the parent Alpine.js x-data="shippingForm" (see alpine.ts).
 * Popup visibility controlled via autocompleteOpen state on shippingForm.
 * Form fill logic handled by fillSavedAddress() method on shippingForm.
 */

import { savedAddress, pageContent } from '../../data/mockCheckout';

export function AddressAutocomplete(): string {
  const truncatedAddress = savedAddress.fullAddress.length > 50
    ? savedAddress.fullAddress.substring(0, 50) + '…'
    : savedAddress.fullAddress;

  return `
    <div
      id="address-autocomplete"
      class="checkout-autocomplete"
      :class="{ 'checkout-autocomplete--open': autocompleteOpen }"
      aria-label="Saved address suggestions"
    >
      <div class="checkout-autocomplete__header">
        ${pageContent.savedAddressLabel}
      </div>
      <button type="button" class="checkout-autocomplete__item" @click="fillSavedAddress()">
        <div class="checkout-autocomplete__city">${savedAddress.city}, ${savedAddress.state}</div>
        <div class="checkout-autocomplete__address">${truncatedAddress}</div>
      </button>
    </div>
  `.trim();
}

/** @deprecated Migrated to Alpine.js via parent shippingForm component — see alpine.ts */
export function initAddressAutocomplete(): void {
  // No-op: autocomplete interactions now handled by Alpine.js shippingForm component
}
