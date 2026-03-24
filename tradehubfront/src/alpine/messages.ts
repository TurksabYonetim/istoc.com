import Alpine from 'alpinejs'
import { t } from '../i18n'

Alpine.data('messagesComponent', () => ({
  activeCategory: 'all',
  searchQuery: '',
  selectedConversation: null as any,
  newMessage: '',
  filterOpen: false,
  filterType: 'all',
  feedbackVisible: true,

  get categories() {
    return [
      { id: 'all', label: t('messages.allMessages'), icon: 'chat' },
      { id: 'unread', label: t('messages.unread'), icon: 'eye' },
    ];
  },

  conversations: [] as any[],

  _buildConversations() {
    return [
      {
        id: 'conv-001',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        name: 'Robert Song',
        company: 'Ningbo Happiness Statio...',
        preview: t('messages.previewRfqReply'),
        date: '2026-2-19',
        unreadCount: 2,
        messages: [
          { id: 'm1', sender: 'Robert Song', text: t('messages.conv1m1'), time: '09:15', isMe: false },
          { id: 'm2', sender: t('messages.me'), text: t('messages.conv1m2'), time: '09:30', isMe: true },
          { id: 'm3', sender: 'Robert Song', text: t('messages.conv1m3'), time: '10:05', isMe: false },
          { id: 'm4', sender: t('messages.me'), text: t('messages.conv1m4'), time: '10:20', isMe: true },
          { id: 'm5', sender: 'Robert Song', text: t('messages.conv1m5'), time: '11:00', isMe: false },
        ],
      },
      {
        id: 'conv-002',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
        name: 'Leo',
        company: 'Dg Excelpro Rubber Co., L...',
        preview: t('messages.previewRfqReply'),
        date: '2026-2-19',
        unreadCount: 2,
        messages: [
          { id: 'm1', sender: 'Leo', text: t('messages.conv2m1'), time: '14:00', isMe: false },
          { id: 'm2', sender: t('messages.me'), text: t('messages.conv2m2'), time: '14:15', isMe: true },
          { id: 'm3', sender: 'Leo', text: t('messages.conv2m3'), time: '14:45', isMe: false },
        ],
      },
      {
        id: 'conv-003',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
        name: 'Yue Luo',
        company: 'Sichuan Wang Zhihao Tra...',
        preview: t('messages.previewRfqReply'),
        date: '2026-2-19',
        unreadCount: 2,
        messages: [
          { id: 'm1', sender: 'Yue Luo', text: t('messages.conv3m1'), time: '16:00', isMe: false },
          { id: 'm2', sender: t('messages.me'), text: t('messages.conv3m2'), time: '16:10', isMe: true },
        ],
      },
      {
        id: 'conv-004',
        avatar: '',
        name: 'TradeHub.com',
        company: '',
        preview: t('messages.previewWelcome'),
        date: '2026-2-19',
        unreadCount: 1,
        messages: [
          { id: 'm1', sender: 'TradeHub.com', text: t('messages.conv4m1'), time: '08:00', isMe: false },
        ],
      },
    ];
  },

  init() {
    this.conversations = this._buildConversations();
    window.addEventListener('languageChanged', () => {
      this.conversations = this._buildConversations();
      this.selectedConversation = null;
    });
  },

  getUnreadTotal(): number {
    return this.conversations.reduce((sum: number, c: any) => sum + c.unreadCount, 0);
  },

  getFilteredConversations(): any[] {
    let list = [...this.conversations] as any[];
    if (this.activeCategory === 'unread') {
      list = list.filter((c: any) => c.unreadCount > 0);
    }
    if (this.filterType === 'unread') {
      list = list.filter((c: any) => c.unreadCount > 0);
    } else if (this.filterType === 'read') {
      list = list.filter((c: any) => c.unreadCount === 0);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
      );
    }
    return list;
  },

  setCategory(id: string) {
    this.activeCategory = id;
    this.filterType = 'all';
    this.filterOpen = false;
  },

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    const found = this.conversations.find((c: any) => c.id === conv.id);
    if (found) (found as any).unreadCount = 0;
    this.$nextTick(() => {
      const chatBody = document.getElementById('msg-chat-body');
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    });
  },

  backToList() {
    this.selectedConversation = null;
    this.newMessage = '';
  },

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const msg = {
      id: 'm' + Date.now(),
      sender: 'Me',
      text: this.newMessage.trim(),
      time: timeStr,
      isMe: true,
    };
    (this.selectedConversation as any).messages.push(msg);
    const found = this.conversations.find((c: any) => c.id === (this.selectedConversation as any).id);
    if (found) (found as any).preview = this.newMessage.trim();
    this.newMessage = '';
    this.$nextTick(() => {
      const chatBody = document.getElementById('msg-chat-body');
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    });
  },

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  },

  setFilter(type: string) {
    this.filterType = type;
    this.filterOpen = false;
  },

  dismissFeedback() {
    this.feedbackVisible = false;
  },
}));
