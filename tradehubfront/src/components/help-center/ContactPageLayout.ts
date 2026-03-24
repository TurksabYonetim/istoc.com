/**
 * ContactPageLayout Component
 * Contact page with hero, contact method cards, form, and map section
 */

import { ContactMethodCard } from '../shared/ContactMethodCard';
import { t } from '../../i18n';

export function ContactPageLayout(): string {
  return `
    <div class="bg-gray-50 min-h-screen">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-primary-500 to-orange-500 py-10 sm:py-14">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">${t('helpCenter.contactTitle')}</h1>
          <p class="text-white/80 text-sm sm:text-base">${t('helpCenter.contactSubtitle')}</p>
        </div>
      </div>

      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <!-- Contact Method Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          ${ContactMethodCard({
            icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>',
            title: t('helpCenter.liveSupport'),
            description: t('helpCenter.liveSupportDesc'),
            ctaLabel: t('helpCenter.startChat'),
            variant: 'primary',
          })}
          ${ContactMethodCard({
            icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>',
            title: t('helpCenter.phone'),
            description: t('helpCenter.phoneDescription'),
            ctaLabel: t('helpCenter.phoneCall'),
            ctaHref: 'tel:+908001234567',
          })}
          ${ContactMethodCard({
            icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>',
            title: t('helpCenter.emailContact'),
            description: 'support@istoc.com',
            ctaLabel: t('helpCenter.emailSend'),
            ctaHref: 'mailto:support@istoc.com',
          })}
          ${ContactMethodCard({
            icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>',
            title: t('helpCenter.chatbot'),
            description: t('helpCenter.chatbotDesc'),
            ctaLabel: t('helpCenter.startChatbot'),
          })}
        </div>

        <!-- Contact Form -->
        <div class="max-w-[700px] mx-auto" x-data="contactPage()">
          <template x-if="!formSubmitted">
            <div class="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">${t('helpCenter.contactForm')}</h2>

              <div class="space-y-4">
                <!-- Name -->
                <div>
                  <label for="contact-name" class="block text-sm font-medium text-gray-700 mb-1">${t('helpCenter.fullNameLabel')}</label>
                  <input id="contact-name" type="text" x-model="name" class="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" :class="errors.name ? 'border-red-400' : 'border-gray-300'" placeholder="${t('helpCenter.fullNamePlaceholder')}">
                  <p x-show="errors.name" x-text="errors.name" class="text-xs text-red-500 mt-1"></p>
                </div>

                <!-- Email -->
                <div>
                  <label for="contact-email" class="block text-sm font-medium text-gray-700 mb-1">${t('helpCenter.emailLabel')}</label>
                  <input id="contact-email" type="email" x-model="email" class="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" :class="errors.email ? 'border-red-400' : 'border-gray-300'" placeholder="ornek@email.com">
                  <p x-show="errors.email" x-text="errors.email" class="text-xs text-red-500 mt-1"></p>
                </div>

                <!-- Subject -->
                <div>
                  <label for="contact-subject" class="block text-sm font-medium text-gray-700 mb-1">${t('helpCenter.contactSubjectLabel')}</label>
                  <select id="contact-subject" x-model="subject" class="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" :class="errors.subject ? 'border-red-400' : 'border-gray-300'">
                    <option value="">${t('helpCenter.contactSubjectPlaceholder')}</option>
                    <template x-for="opt in subjectOptions" :key="opt">
                      <option :value="opt" x-text="opt"></option>
                    </template>
                  </select>
                  <p x-show="errors.subject" x-text="errors.subject" class="text-xs text-red-500 mt-1"></p>
                </div>

                <!-- Message -->
                <div>
                  <label for="contact-message" class="block text-sm font-medium text-gray-700 mb-1">${t('helpCenter.messageLabel')}</label>
                  <textarea id="contact-message" x-model="message" rows="5" class="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-y" :class="errors.message ? 'border-red-400' : 'border-gray-300'" placeholder="${t('helpCenter.messagePlaceholder')}"></textarea>
                  <p x-show="errors.message" x-text="errors.message" class="text-xs text-red-500 mt-1"></p>
                </div>

                <!-- File attachment -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">${t('helpCenter.fileAttachment')}</label>
                  <input type="file" @change="attachment = $event.target.files[0]" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 file:cursor-pointer">
                </div>

                <!-- Submit -->
                <button @click="submitForm()" :disabled="formSubmitting" class="th-btn w-full disabled:opacity-50 cursor-pointer">
                  <span x-show="!formSubmitting">${t('helpCenter.submitForm')}</span>
                  <span x-show="formSubmitting" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    ${t('helpCenter.submitting')}
                  </span>
                </button>
              </div>
            </div>
          </template>

          <!-- Success State -->
          <template x-if="formSubmitted">
            <div class="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">${t('helpCenter.messageSent')}</h3>
              <p class="text-sm text-gray-500 mb-6">${t('helpCenter.messageSentDesc')}</p>
              <button @click="resetForm()" class="th-btn cursor-pointer">${t('helpCenter.sendNewMessage')}</button>
            </div>
          </template>
        </div>

        <!-- Map / Address Section -->
        <div class="mt-12 bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">${t('helpCenter.addressInfo')}</h2>
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <div class="space-y-3 text-sm text-gray-600">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                  <div>
                    <p class="font-medium text-gray-800">${t('helpCenter.addressCompany')}</p>
                    <p>${t('helpCenter.addressLine1')}</p>
                    <p>${t('helpCenter.addressLine2')}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-primary-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p>${t('helpCenter.businessHours')}</p>
                </div>
              </div>
            </div>
            <div class="flex-1 bg-gray-100 rounded-lg h-[200px] flex items-center justify-center text-sm text-gray-400">
              <svg class="w-8 h-8 mr-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>
              ${t('helpCenter.mapArea')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
