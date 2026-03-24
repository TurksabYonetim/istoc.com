/**
 * Mock Messages Data
 * Static data for the messages/inbox page — TR TradeHub B2B style.
 */

import type { MessagesPageData, InboxCategory, MessageConversation } from '../types/messages';
import { t } from '../i18n';

export function mockInboxCategories(): InboxCategory[] {
  return [
    { id: 'all', label: t('common.all'), icon: 'chat' },
    { id: 'unread', label: t('messages.unread'), icon: 'eye', count: 7 },
  ];
}

export function mockConversations(): MessageConversation[] {
  return [
    {
      id: 'conv-001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      name: 'Robert Song',
      company: 'Ningbo Happiness Statio...',
      preview: t('messages.previewRfqReply'),
      date: '2026-2-19',
      unreadCount: 2,
      href: '/messages/conv-001',
    },
    {
      id: 'conv-002',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
      name: 'Leo',
      company: 'Dg Excelpro Rubber Co., L...',
      preview: t('messages.previewRfqReply'),
      date: '2026-2-19',
      unreadCount: 2,
      href: '/messages/conv-002',
    },
    {
      id: 'conv-003',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      name: 'Yue Luo',
      company: 'Sichuan Wang Zhihao Tra...',
      preview: t('messages.previewRfqReply'),
      date: '2026-2-19',
      unreadCount: 2,
      href: '/messages/conv-003',
    },
    {
      id: 'conv-004',
      avatar: '',
      name: 'TradeHub.com',
      company: '',
      preview: t('messages.previewWelcome'),
      date: '2026-2-19',
      unreadCount: 1,
      href: '/messages/conv-004',
    },
  ];
}

export function mockMessagesData(): MessagesPageData {
  return {
    categories: mockInboxCategories(),
    conversations: mockConversations(),
  };
}
