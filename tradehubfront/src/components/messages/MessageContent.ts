/**
 * MessageContent Component (Alpine.js)
 * Right panel: empty state when no conversation selected, full chat view when selected.
 * On mobile (max-md): replaces the list panels when a conversation is active.
 */

import { t } from '../../i18n';

const TRADEHUB_CHAT_AVATAR = `<svg class="w-full h-full" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#FFF2E8"/>
  <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="600" fill="#E67A00">T</text>
</svg>`;

export function MessageContent(): string {
  return `
    <!-- Empty state (no conversation selected) — hidden on mobile always, hidden on lg+ when conversation selected -->
    <div x-show="!selectedConversation"
         class="flex-1 flex items-center justify-center bg-(--color-surface,#ffffff) min-w-0 max-2xl:hidden">
      <div class="flex flex-col items-center gap-5 p-10 text-center">
        <div class="w-[160px] h-[120px]">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
            <rect x="20" y="20" width="90" height="60" rx="4" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="1.5"/>
            <rect x="28" y="28" width="74" height="44" rx="2" fill="#fff"/>
            <path d="M10 80h110c0 4-4 8-8 8H18c-4 0-8-4-8-8z" fill="#E5E7EB"/>
            <circle cx="100" cy="75" r="20" fill="#FFF7ED"/>
            <path d="M100 58l12 6v10c0 8-5 15-12 18-7-3-12-10-12-18V64l12-6z" fill="#F97316" opacity="0.15"/>
            <path d="M100 58l12 6v10c0 8-5 15-12 18-7-3-12-10-12-18V64l12-6z" stroke="#F97316" stroke-width="1.5" fill="none"/>
            <path d="M94 74l4 4 8-8" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="115" y="30" width="35" height="24" rx="4" fill="#FFEDD5" stroke="#FB923C" stroke-width="1"/>
            <circle cx="125" cy="42" r="2" fill="#FB923C"/>
            <circle cx="132" cy="42" r="2" fill="#FB923C"/>
            <circle cx="139" cy="42" r="2" fill="#FB923C"/>
            <polygon points="120,54 126,54 120,60" fill="#FFEDD5" stroke="#FB923C" stroke-width="1"/>
          </svg>
        </div>
        <p class="text-sm text-(--color-text-body,#333333) leading-relaxed">
          <span data-i18n="messages.emptyStateText">${t('messages.emptyStateText')}</span>
        </p>
        <a href="/help" class="inline-block px-6 py-2 border border-(--color-border-medium,#d1d5db) rounded-full text-sm text-(--color-text-body,#333333) no-underline transition-[border-color,background] duration-150 hover:border-(--color-text-placeholder) hover:bg-(--color-surface-muted,#fafafa)"><span data-i18n="common.learnMore">${t('common.learnMore')}</span></a>
      </div>
    </div>

    <!-- Chat View (conversation selected) -->
    <div x-show="selectedConversation"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         class="flex-1 flex flex-col bg-(--color-surface,#ffffff) min-w-0 max-2xl:absolute max-2xl:inset-0 max-2xl:z-10">

      <!-- Chat Header -->
      <div class="flex items-center gap-3 px-5 max-sm:px-3 py-3 border-b border-(--color-border-light,#f0f0f0) flex-shrink-0">
        <!-- Back button (mobile) -->
        <button @click="backToList()"
                class="2xl:hidden flex items-center justify-center w-8 h-8 border-none bg-transparent text-(--color-text-body,#333333) cursor-pointer rounded-full hover:bg-(--color-surface-muted,#fafafa) transition-colors flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Avatar -->
        <div class="relative w-9 h-9 flex-shrink-0 rounded-full overflow-hidden">
          <template x-if="selectedConversation?.avatar">
            <img :src="selectedConversation.avatar" :alt="selectedConversation.name" class="w-9 h-9 rounded-full object-cover" />
          </template>
          <template x-if="!selectedConversation?.avatar">
            ${TRADEHUB_CHAT_AVATAR}
          </template>
        </div>

        <!-- Name & Company -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-(--color-text-heading,#111827) truncate" x-text="selectedConversation?.name"></h4>
          <p x-show="selectedConversation?.company"
             class="text-xs text-(--color-text-placeholder,#999999) truncate"
             x-text="selectedConversation?.company"></p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button class="flex items-center justify-center w-8 h-8 border-none bg-transparent text-(--color-text-placeholder,#999999) cursor-pointer rounded-full hover:bg-(--color-surface-muted,#fafafa) hover:text-(--color-text-body,#333333) transition-colors"
                  aria-label="${t('common.search')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path stroke-linecap="round" d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="flex items-center justify-center w-8 h-8 border-none bg-transparent text-(--color-text-placeholder,#999999) cursor-pointer rounded-full hover:bg-(--color-surface-muted,#fafafa) hover:text-(--color-text-body,#333333) transition-colors"
                  aria-label="${t('common.more')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div id="msg-chat-body" class="flex-1 overflow-y-auto px-5 max-sm:px-3 py-4 space-y-4 bg-(--color-surface-muted,#fafafa)">
        <!-- Date separator -->
        <div class="flex items-center justify-center">
          <span class="text-xs text-(--color-text-placeholder,#999999) bg-(--color-surface,#ffffff) px-3 py-1 rounded-full shadow-sm border border-(--color-border-light,#f0f0f0)" x-text="selectedConversation?.date"></span>
        </div>

        <template x-for="msg in selectedConversation?.messages || []" :key="msg.id">
          <div class="flex" :class="msg.isMe ? 'justify-end' : 'justify-start'">
            <!-- Other person's message -->
            <template x-if="!msg.isMe">
              <div class="flex items-end gap-2 max-w-[75%] max-sm:max-w-[85%]">
                <div class="w-7 h-7 flex-shrink-0 rounded-full overflow-hidden">
                  <template x-if="selectedConversation?.avatar">
                    <img :src="selectedConversation.avatar" class="w-7 h-7 rounded-full object-cover" />
                  </template>
                  <template x-if="!selectedConversation?.avatar">
                    <svg class="w-full h-full" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="#FFF2E8"/>
                      <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="600" fill="#E67A00">T</text>
                    </svg>
                  </template>
                </div>
                <div>
                  <div class="bg-(--color-surface,#ffffff) rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-(--color-border-light,#f0f0f0)">
                    <p class="text-[13px] text-(--color-text-body,#333333) leading-relaxed whitespace-pre-wrap break-words" x-text="msg.text"></p>
                  </div>
                  <span class="text-[11px] text-(--color-text-placeholder,#999999) mt-1 ml-1 block" x-text="msg.time"></span>
                </div>
              </div>
            </template>

            <!-- My message -->
            <template x-if="msg.isMe">
              <div class="flex items-end gap-2 max-w-[75%] max-sm:max-w-[85%] flex-row-reverse">
                <div>
                  <div class="bg-(--color-cta-primary,#cc9900)/10 rounded-2xl rounded-br-sm px-4 py-2.5">
                    <p class="text-[13px] text-(--color-text-body,#333333) leading-relaxed whitespace-pre-wrap break-words" x-text="msg.text"></p>
                  </div>
                  <span class="text-[11px] text-(--color-text-placeholder,#999999) mt-1 mr-1 block text-right" x-text="msg.time"></span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- Message Input -->
      <div class="flex-shrink-0 border-t border-(--color-border-light,#f0f0f0) bg-(--color-surface,#ffffff) px-4 max-sm:px-3 py-3">
        <form @submit.prevent="sendMessage()" class="flex items-end gap-2">
          <!-- Attachment button -->
          <button type="button"
                  class="flex items-center justify-center w-9 h-9 border-none bg-transparent text-(--color-text-placeholder,#999999) cursor-pointer rounded-full hover:bg-(--color-surface-muted,#fafafa) hover:text-(--color-text-body,#333333) transition-colors flex-shrink-0"
                  aria-label="${t('messages.attachFile')}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
            </svg>
          </button>

          <!-- Text input -->
          <div class="flex-1 relative">
            <textarea x-model="newMessage"
                      @keydown.enter.prevent="if (!$event.shiftKey) sendMessage()"
                      rows="1"
                      class="w-full resize-none border border-(--color-border-default,#e5e5e5) rounded-2xl px-4 py-2.5 text-[13px] text-(--color-text-body,#333333) bg-(--color-surface-muted,#fafafa) outline-none transition-[border-color] duration-150 placeholder:text-(--color-text-placeholder,#999999) focus:border-(--color-cta-primary,#cc9900) focus:bg-(--color-surface,#ffffff) max-h-24 overflow-y-auto leading-snug"
                      placeholder="${t('messages.typePlaceholder')}"
                      style="field-sizing: content;"></textarea>
          </div>

          <!-- Send button -->
          <button type="submit"
                  class="flex items-center justify-center w-9 h-9 rounded-full border-none cursor-pointer transition-all duration-150 flex-shrink-0"
                  :class="newMessage.trim() ? 'bg-(--color-cta-primary,#cc9900) text-(--color-surface,#ffffff) hover:opacity-90' : 'bg-(--color-surface-muted,#fafafa) text-(--color-text-placeholder,#999999) cursor-not-allowed'"
                  :disabled="!newMessage.trim()"
                  aria-label="${t('messages.send')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
          </button>
        </form>

        <!-- Tip text -->
        <p class="text-[11px] text-(--color-text-placeholder,#999999) mt-1.5 text-center max-sm:hidden">
          ${t('messages.sendTip')}
        </p>
      </div>
    </div>
  `;
}
