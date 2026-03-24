/**
 * MessagesLayout Component
 * Alpine.js-driven 3-panel messages layout: InboxPanel | MessageList | MessageContent/ChatView
 */

import { InboxPanel } from './InboxPanel';
import { MessageList } from './MessageList';
import { MessageContent } from './MessageContent';
import { t } from '../../i18n';

export function MessagesLayout(): string {
  return `
    <div x-data="messagesComponent" class="flex flex-col h-[calc(100vh-48px)] max-2xl:h-auto max-2xl:min-h-[calc(100vh-48px)] bg-(--color-surface,#ffffff) rounded-lg max-sm:rounded-none overflow-hidden" x-cloak>
      <!-- 3-panel grid -->
      <div class="relative flex flex-1 min-h-0 max-2xl:flex-col">
        ${InboxPanel()}
        ${MessageList()}
        ${MessageContent()}
      </div>

      <!-- Feedback Banner -->
      <div x-show="feedbackVisible" x-transition class="flex items-center justify-between px-5 py-2.5 max-sm:px-3 bg-gradient-to-br from-blue-500 to-blue-400 text-(--color-surface)">
        <span class="text-[13px]" data-i18n="messages.feedbackBanner">${t('messages.feedbackBanner')}</span>
        <button @click="dismissFeedback()" class="flex items-center justify-center w-6 h-6 border-none bg-transparent text-(--color-surface) cursor-pointer opacity-80 hover:opacity-100 transition-opacity" aria-label="${t('common.close')}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

export function initMessagesLayout(): void {
  // Alpine.js handles all interactivity now — no manual event listeners needed
}
