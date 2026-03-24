/**
 * ShippingAddressForm Component (C2)
 * Shipping address form + saved address selector/add modals.
 * Interactivity is handled by Alpine.js x-data="shippingForm" (see alpine.ts).
 */

import type { Country, Province } from '../../types/checkout';
import { countries, turkishProvinces, pageContent } from '../../data/mockCheckout';

export interface ShippingAddressFormProps {
  countries?: Country[];
  provinces?: Province[];
}

const ChevronDown = `<svg class="w-4 h-4 shrink-0 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>`;

function floatField(id: string, name: string, label: string, required: boolean, type = 'text', helperText?: string, helperAction?: string): string {
  return `
    <div class="relative mb-4 group checkout-field-container" data-field="${name}" x-bind:data-error="errors.${name}">
      <input
        class="peer w-full h-[48px] pt-[18px] px-3 pb-0 text-[14px] text-[var(--color-text-primary)] border border-[var(--color-border-medium)] rounded-lg bg-[var(--color-surface)] outline-none transition-colors focus:border-[var(--color-primary-500)] data-[error=true]:border-[var(--color-error-500)] placeholder-transparent"
        type="${type}"
        id="${id}"
        name="${name}"
        autocomplete="off"
        placeholder=" "
        ${required ? 'required' : ''}
        @input="clearError('${name}')"
      />
      <label
        class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#767676] transition-all duration-200 ease-in-out pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-[#767676] peer-focus:top-[12px] peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:text-[var(--color-primary-500)] peer-focus:bg-transparent group-data-[error=true]:text-[var(--color-error-500)] ${type !== 'tel' ? `peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px]` : ''}"
        for="${id}"
      >
        ${label}${required ? ' <span class="text-[var(--color-error-500)]">*</span>' : ''}
      </label>
      <div class="hidden text-[12px] text-[var(--color-error-500)] mt-1 group-data-[error=true]:block">${pageContent.requiredFieldError}</div>
      ${helperText ? `<p class="text-[14px] text-[#767676] mt-2">${helperText}</p>` : ''}
      ${helperAction ? helperAction : ''}
    </div>
  `;
}

function dropdownField(
  id: string,
  name: string,
  label: string,
  displayValue: string,
  items?: string,
  alpine?: { openProp: string; selectFn: string; displayProp?: string }
): string {
  const containerAlpine = alpine
    ? ` x-bind:data-open="${alpine.openProp}" x-bind:data-error="errors.${name}" @click.outside="${alpine.openProp} = false"`
    : '';
  const triggerAlpine = alpine
    ? `@click.prevent="toggleDropdown('${name}')" x-bind:aria-expanded="${alpine.openProp}"`
    : 'aria-expanded="false"';
  const displayAlpine = alpine?.displayProp ? ` x-text="${alpine.displayProp}"` : '';
  const listAlpine = alpine ? ` @click="${alpine.selectFn}"` : '';

  return `
    <div class="relative mb-4 group checkout-dropdown-container" data-field="${name}" data-dropdown="${id}"${containerAlpine}>
      <button
        type="button"
        class="w-full h-[48px] flex items-center justify-between pt-[18px] px-3 pb-0 text-[14px] text-[var(--color-text-primary)] border border-[var(--color-border-medium)] rounded-lg bg-[var(--color-surface)] cursor-pointer outline-none transition-colors focus:border-[var(--color-primary-500)] group-data-[error=true]:border-[var(--color-error-500)] dropdown-trigger"
        id="${id}"
        aria-haspopup="listbox"
        ${triggerAlpine}
      >
        <span class="text-left truncate pb-[6px]" data-display${displayAlpine}>${displayValue}</span>
        <span class="pb-[6px]">${ChevronDown}</span>
      </button>
      <label class="absolute left-3 top-[12px] -translate-y-1/2 text-[12px] text-[#767676] transition-all duration-200 ease-in-out pointer-events-none group-data-[error=true]:text-[var(--color-error-500)] dropdown-label">
        ${label} <span class="text-[var(--color-error-500)]">*</span>
      </label>
      <ul class="absolute top-full left-0 right-0 z-50 max-h-[260px] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border-medium)] rounded-lg shadow-lg mt-1 hidden group-data-[open=true]:block" role="listbox" data-list${listAlpine}>${items || ''}</ul>
      <div class="hidden text-[12px] text-[var(--color-error-500)] mt-1 group-data-[error=true]:block">${pageContent.requiredFieldError}</div>
    </div>
  `;
}

const defaultCountry = countries.find(c => c.code === 'TR') ?? countries[0];

function renderAddressSelectorModal(): string {
  return `
    <div
      class="fixed inset-0 z-[80] bg-black/45 p-4 flex items-center justify-center"
      x-cloak
      x-show="isAddressSelectorOpen"
      @keydown.escape.window="closeAddressSelector()"
    >
      <div class="w-full max-w-[840px] max-h-[88vh] overflow-hidden rounded-xl bg-white shadow-xl">
        <div class="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-[#e5e7eb]">
          <h3 class="text-lg sm:text-xl xl:text-[32px] font-bold text-[#111827] leading-tight">Select shipping address</h3>
          <button type="button" class="text-[#111827] hover:opacity-70" @click="closeAddressSelector()">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="px-4 py-4 sm:px-6 sm:py-5 overflow-y-auto max-h-[56vh]">
          <button
            type="button"
            class="h-10 sm:h-12 rounded-full border border-[#111827] px-4 sm:px-6 text-sm sm:text-[16px] font-semibold text-[#111827] hover:bg-[#f9fafb]"
            @click="openAddAddressModal()"
          >
            + Add an address
          </button>

          <div class="mt-4 sm:mt-5 border-t border-[#e5e7eb] pt-4 sm:pt-5 space-y-3 sm:space-y-4">
            <template x-for="address in savedAddresses" :key="address.id">
              <div
                class="rounded-lg border p-3 sm:p-4"
                :class="pendingAddressId === address.id ? 'border-[#111827]' : 'border-[#e5e7eb]'"
              >
                <div class="flex items-start gap-2 sm:gap-3">
                  <input
                    type="radio"
                    class="mt-1 h-4 w-4 sm:h-5 sm:w-5 accent-[#111827]"
                    :value="address.id"
                    x-model="pendingAddressId"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 sm:gap-3">
                      <div>
                        <p class="text-sm sm:text-[16px] font-semibold text-[#111827]" x-text="address.firstName + ' ' + address.lastName"></p>
                        <p class="mt-1 text-xs sm:text-[14px] text-[#374151]" x-text="address.fullAddress"></p>
                        <p class="mt-1 text-xs sm:text-[14px] text-[#374151]" x-text="address.phonePrefix + ' ' + address.phone"></p>
                        <button
                          type="button"
                          class="mt-2 text-xs sm:text-[14px] underline text-[#374151] hover:text-[#111827]"
                          x-show="!address.isDefault"
                          @click="setDefaultAddress(address.id)"
                        >
                          Set as default
                        </button>
                      </div>
                      <div class="flex items-center gap-1.5 sm:gap-2">
                        <button type="button" class="text-[#374151] hover:text-[#111827]" @click="startEditAddress(address.id)">
                          <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="text-[#374151] hover:text-[#111827]" @click="deleteAddress(address.id)">
                          <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#e5e7eb] px-4 py-4 sm:px-6 sm:py-5">
          <button
            type="button"
            class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn-outline th-btn-pill"
            @click="closeAddressSelector()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn th-btn-pill"
            @click="confirmSelectedAddress()"
          >
            Ship to this address
          </button>
        </div>
      </div>
    </div>
  `.trim();
}

function renderAddAddressModal(countryOptions: string): string {
  return `
    <div
      class="fixed inset-0 z-[90] bg-black/45 p-4 flex items-center justify-center"
      x-cloak
      x-show="isAddAddressModalOpen"
      @keydown.escape.window="closeAddAddressModal()"
    >
      <div class="w-full max-w-[980px] max-h-[92vh] overflow-hidden rounded-xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div>
            <h3 class="text-xl sm:text-2xl xl:text-[32px] font-bold text-[#111827]" x-text="isEditingAddress ? 'Edit address' : 'Add address'">Add address</h3>
            <p class="mt-1 text-[14px] text-[#198f35]">Your information is encrypted and secure</p>
          </div>
          <button type="button" class="text-[#111827] hover:opacity-70" @click="closeAddAddressModal()">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="px-6 py-5 overflow-y-auto max-h-[62vh]">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-[14px] text-[#6b7280] mb-1">Country / region *</label>
              <select class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" x-model="addAddressForm.country" @change="syncAddAddressCountry()">
                ${countryOptions}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[14px] text-[#6b7280] mb-1">First name and Last name *</label>
                <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.fullName" />
                <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.fullName">Required</p>
              </div>
              <div>
                <label class="block text-[14px] text-[#6b7280] mb-1">Phone number *</label>
                <div class="flex gap-2">
                  <div class="w-[84px] h-12 rounded-lg border border-[#d1d5db] flex items-center justify-center text-[14px] text-[#111827]" x-text="addAddressForm.phonePrefix"></div>
                  <input class="flex-1 h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="tel" x-model="addAddressForm.phone" />
                </div>
                <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.phone">Required</p>
              </div>
            </div>

            <div>
              <label class="block text-[14px] text-[#6b7280] mb-1">Street address or P.O. box *</label>
              <div class="relative">
                <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.street" />
              </div>
              <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.street">Required</p>
            </div>

            <div>
              <label class="block text-[14px] text-[#6b7280] mb-1">Apartment, suite, unit, building, floor (optional)</label>
              <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.apartment" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[14px] text-[#6b7280] mb-1">State / province *</label>
                <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.state" />
                <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.state">Required</p>
              </div>
              <div>
                <label class="block text-[14px] text-[#6b7280] mb-1">City *</label>
                <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.city" />
                <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.city">Required</p>
              </div>
              <div>
                <label class="block text-[14px] text-[#6b7280] mb-1">Postal code *</label>
                <input class="w-full h-12 rounded-lg border border-[#d1d5db] px-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]" type="text" x-model="addAddressForm.postalCode" />
                <p class="mt-1 text-[12px] text-[#dc2626]" x-show="addFormErrors.postalCode">Required</p>
              </div>
            </div>

            <label class="inline-flex items-center gap-2 text-[14px] text-[#374151]">
              <input type="checkbox" class="h-4 w-4 rounded border-[#d1d5db] accent-[#111827]" x-model="addAddressForm.isDefaultAddress" />
              <span>Set as default shipping address</span>
            </label>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#e5e7eb] px-4 py-4 sm:px-6 sm:py-5">
          <button
            type="button"
            class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn-outline th-btn-pill"
            @click="closeAddAddressModal()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="min-w-0 w-full sm:min-w-[200px] sm:w-auto th-btn th-btn-pill"
            @click="submitAddAddress()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  `.trim();
}

export function ShippingAddressForm(props: ShippingAddressFormProps = {}): string {
  const ctrs = props.countries ?? countries;
  const provinces = props.provinces ?? turkishProvinces;

  const countryItems = ctrs.map(c =>
    `<li class="px-3 py-2 text-[14px] text-[var(--color-text-primary)] cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors flex items-center gap-2 ${c.code === defaultCountry.code ? 'bg-blue-50 text-blue-800' : ''}" role="option" data-value="${c.code}" data-flag="${c.flag}" data-name="${c.name}" data-prefix="${c.phonePrefix}">${c.flag} ${c.name}</li>`
  ).join('');

  const countryOptions = ctrs.map((c) => `<option value="${c.code}">${c.name}</option>`).join('');

  const provinceItems = provinces.map(p =>
    `<li class="px-3 py-2 text-[14px] text-[var(--color-text-primary)] cursor-pointer hover:bg-[#f5f5f5] transition-colors" role="option" data-value="${p.name}">${p.name}</li>`
  ).join('');

  return `
    <section class="checkout-section mb-4" id="shipping-address-section" x-data="shippingForm">
      <div class="flex items-center gap-3 p-3 sm:p-4 xl:p-5">
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary-500)] text-white text-sm font-semibold shrink-0">1</div>
        <h2 class="text-base xl:text-lg font-semibold text-[var(--color-text-primary)]">${pageContent.shippingAddressTitle}</h2>
      </div>

      <div class="checkout-section__content px-3 sm:px-4 xl:px-5 pb-5">
        <div
          class="rounded-xl border border-[#e5e7eb] bg-white p-4"
          x-cloak
          x-show="selectedAddressId && !showAddressForm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-[14px] font-semibold text-[#111827]">Shipping address</p>
              <p class="mt-2 text-[15px] font-semibold text-[#111827]" x-text="selectedAddressName"></p>
              <p class="mt-1 text-[15px] text-[#374151]" x-text="selectedAddressPhone"></p>
              <p class="mt-1 text-[15px] text-[#374151]" x-text="selectedAddressLine"></p>
            </div>
            <button type="button" class="text-[14px] font-semibold underline text-[#111827] hover:opacity-70" @click="openAddressSelector()">
              Change
            </button>
          </div>
        </div>

        <form id="shipping-address-form" class="mt-2" novalidate @submit.prevent="handleSubmit()" x-cloak x-show="showAddressForm">
          <div class="flex flex-col gap-0">
            <div class="flex items-center gap-2 mb-4 text-[#008a00] text-[14px] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="shrink-0"><path d="M18 10v-3.5A6.5 6.5 0 105 6.5V10H4v12h16V10h-2zm-2 0H8v-3.5a4.5 4.5 0 119 0V10zm-3 5.5v3h-2v-3h2z" fill="currentColor"/></svg>
              <span>Your information is encrypted and secure</span>
            </div>

            ${dropdownField(
              'country-dropdown',
              'country',
              'Country / region',
              `${defaultCountry.flag} ${defaultCountry.name}`,
              countryItems,
              { openProp: 'countryOpen', selectFn: 'selectCountryItem($event)', displayProp: 'countryDisplay' }
            )}

            ${floatField('first-name', 'firstName', 'First name and Last name', true)}

            <div class="relative mb-4 group checkout-field-container flex gap-2" data-field="phone" x-bind:data-error="errors.phone">
              <div class="flex items-center justify-center w-[70px] h-[48px] rounded-lg border border-[var(--color-border-medium)] bg-transparent text-[14px] text-[var(--color-text-primary)] shrink-0">
                <span id="phone-prefix" x-text="phonePrefix">${defaultCountry.phonePrefix}</span>
              </div>
              <div class="relative flex-1">
                <input
                  class="peer w-full h-[48px] pt-[18px] px-3 pb-0 text-[14px] text-[var(--color-text-primary)] border border-[var(--color-border-medium)] rounded-lg bg-[var(--color-surface)] outline-none transition-colors focus:border-[var(--color-primary-500)] data-[error=true]:border-[var(--color-error-500)] placeholder-transparent"
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder=" "
                  @input="clearError('phone')"
                />
                <label
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#767676] transition-all duration-200 ease-in-out pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-[#767676] peer-focus:top-[12px] peer-focus:-translate-y-1/2 peer-focus:text-[12px] peer-focus:text-[var(--color-primary-500)] peer-focus:bg-transparent peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px] group-data-[error=true]:text-[var(--color-error-500)]"
                  for="phone"
                >
                  ${pageContent.phoneLabel} <span class="text-[var(--color-error-500)]">*</span>
                </label>
              </div>
              <p class="absolute top-[100%] left-[78px] text-[14px] text-[#767676] mt-[8px]">Only used to contact you for delivery updates</p>
            </div>
            <div class="h-[30px]"></div>

            ${floatField('street-address', 'streetAddress', pageContent.streetAddressLabel, true, 'text')}

            ${floatField('apartment', 'apartment', pageContent.apartmentLabel, false)}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="relative">
                ${dropdownField(
                  'state-dropdown',
                  'state',
                  'State / province',
                  '',
                  provinceItems,
                  { openProp: 'stateOpen', selectFn: 'selectStateItem($event)', displayProp: 'stateDisplay' }
                )}
              </div>

              <div class="relative mb-4 group checkout-dropdown-container" data-field="city" data-dropdown="city-dropdown" x-bind:data-open="cityOpen" x-bind:data-error="errors.city" @click.outside="cityOpen = false">
                <button
                  type="button"
                  class="w-full h-[48px] flex items-center justify-between pt-[18px] px-3 pb-0 text-[14px] text-[var(--color-text-primary)] border border-[var(--color-border-medium)] rounded-lg bg-[var(--color-surface)] cursor-pointer outline-none transition-colors focus:border-[var(--color-primary-500)] group-data-[error=true]:border-[var(--color-error-500)] dropdown-trigger"
                  id="city-dropdown"
                  aria-haspopup="listbox"
                  @click.prevent="toggleDropdown('city')"
                  x-bind:aria-expanded="cityOpen"
                >
                  <span class="text-left truncate pb-[6px]" data-display x-text="cityDisplay"></span>
                  <span class="pb-[6px]">${ChevronDown}</span>
                </button>
                <label class="absolute left-3 top-[12px] -translate-y-1/2 text-[12px] text-[#767676] transition-all duration-200 ease-in-out pointer-events-none group-data-[error=true]:text-[var(--color-error-500)] dropdown-label">
                  City <span class="text-[var(--color-error-500)]">*</span>
                </label>
                <ul class="absolute top-full left-0 right-0 z-50 max-h-[260px] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border-medium)] rounded-lg shadow-lg mt-1 hidden group-data-[open=true]:block" role="listbox" data-list @click="selectCityItem($event)">
                  <template x-for="city in cityOptions" :key="city">
                    <li class="px-3 py-2 text-[14px] text-[var(--color-text-primary)] cursor-pointer hover:bg-[#f5f5f5] transition-colors" role="option" :data-value="city" x-text="city"></li>
                  </template>
                  <li x-show="cityOptions.length === 0" class="px-3 py-2 text-[13px] text-[#9ca3af] cursor-not-allowed" role="option" data-disabled="true">
                    Once state / province secin
                  </li>
                </ul>
                <div class="hidden text-[12px] text-[var(--color-error-500)] mt-1 group-data-[error=true]:block">${pageContent.requiredFieldError}</div>
              </div>

              ${floatField('postal-code', 'postalCode', 'Postal code', true, 'text')}
            </div>

            <div class="flex items-center gap-2 mt-2 mb-4">
              <input
                type="checkbox"
                id="default-address"
                name="isDefaultAddress"
                class="w-4 h-4 rounded border-[var(--color-border-medium)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
              />
              <label for="default-address" class="text-sm text-[var(--color-text-secondary)] cursor-pointer select-none">
                ${pageContent.defaultAddressCheckbox}
              </label>
            </div>

            <button
              type="submit"
              id="continue-payment-btn"
              class="th-btn th-btn-pill self-start"
            >
              Save and continue
            </button>
          </div>
        </form>
      </div>

      ${renderAddressSelectorModal()}
      ${renderAddAddressModal(countryOptions)}
    </section>
  `.trim();
}

/** @deprecated Migrated to Alpine.js x-data="shippingForm" — see alpine.ts */
export function initShippingAddressForm(): void {
  // No-op: interactions are handled by Alpine.js shippingForm component
}
