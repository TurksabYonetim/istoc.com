/**
 * Messages Page — TypeScript Interfaces
 */

export interface MessageConversation {
  id: string;
  avatar: string;
  name: string;
  company: string;
  preview: string;
  date: string;
  unreadCount: number;
  href: string;
}

export interface InboxCategory {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

export interface MessagesPageData {
  categories: InboxCategory[];
  conversations: MessageConversation[];
}
