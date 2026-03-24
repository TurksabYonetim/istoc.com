/**
 * Mock Support Tickets Data
 */

import { t } from '../i18n';

export interface TicketMessage {
  sender: 'user' | 'support';
  text: string;
  date: string;
}

export interface MockTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdDate: string;
  lastReply?: string;
  snippet?: string;
  messages: TicketMessage[];
}

export function getMockTickets(): MockTicket[] {
  return [
    {
      id: 'TK-2024001',
      subject: t('mockData.tickets.t1Subject'),
      category: t('mockData.tickets.categoryShipping'),
      status: 'open',
      priority: 'high',
      createdDate: '28 Şub 2026',
      lastReply: '1 Mar 2026',
      snippet: t('mockData.tickets.t1Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t1Msg1'), date: '28 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t1Msg2'), date: '1 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024002',
      subject: t('mockData.tickets.t2Subject'),
      category: t('mockData.tickets.categoryPayment'),
      status: 'pending',
      priority: 'normal',
      createdDate: '25 Şub 2026',
      lastReply: '27 Şub 2026',
      snippet: t('mockData.tickets.t2Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t2Msg1'), date: '25 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t2Msg2'), date: '27 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024003',
      subject: t('mockData.tickets.t3Subject'),
      category: t('mockData.tickets.categoryOrder'),
      status: 'open',
      priority: 'high',
      createdDate: '2 Mar 2026',
      lastReply: '3 Mar 2026',
      snippet: t('mockData.tickets.t3Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t3Msg1'), date: '2 Mar 2026' },
        { sender: 'support', text: t('mockData.tickets.t3Msg2'), date: '3 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024004',
      subject: t('mockData.tickets.t4Subject'),
      category: t('mockData.tickets.categoryOrder'),
      status: 'pending',
      priority: 'urgent',
      createdDate: '20 Şub 2026',
      lastReply: '22 Şub 2026',
      snippet: t('mockData.tickets.t4Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t4Msg1'), date: '20 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t4Msg2'), date: '22 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024005',
      subject: t('mockData.tickets.t5Subject'),
      category: t('mockData.tickets.categoryAccount'),
      status: 'closed',
      priority: 'normal',
      createdDate: '15 Şub 2026',
      lastReply: '16 Şub 2026',
      snippet: t('mockData.tickets.t5Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t5Msg1'), date: '15 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t5Msg2'), date: '16 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024006',
      subject: t('mockData.tickets.t6Subject'),
      category: t('mockData.tickets.categoryOrder'),
      status: 'open',
      priority: 'normal',
      createdDate: '3 Mar 2026',
      snippet: t('mockData.tickets.t6Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t6Msg1'), date: '3 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024007',
      subject: t('mockData.tickets.t7Subject'),
      category: t('mockData.tickets.categoryPayment'),
      status: 'open',
      priority: 'urgent',
      createdDate: '4 Mar 2026',
      lastReply: '4 Mar 2026',
      snippet: t('mockData.tickets.t7Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t7Msg1'), date: '4 Mar 2026' },
        { sender: 'support', text: t('mockData.tickets.t7Msg2'), date: '4 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024008',
      subject: t('mockData.tickets.t8Subject'),
      category: t('mockData.tickets.categoryShipping'),
      status: 'pending',
      priority: 'high',
      createdDate: '1 Mar 2026',
      lastReply: '2 Mar 2026',
      snippet: t('mockData.tickets.t8Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t8Msg1'), date: '1 Mar 2026' },
        { sender: 'support', text: t('mockData.tickets.t8Msg2'), date: '2 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024009',
      subject: t('mockData.tickets.t9Subject'),
      category: t('mockData.tickets.categoryOrder'),
      status: 'closed',
      priority: 'normal',
      createdDate: '10 Şub 2026',
      lastReply: '14 Şub 2026',
      snippet: t('mockData.tickets.t9Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t9Msg1'), date: '10 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t9Msg2'), date: '14 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024010',
      subject: t('mockData.tickets.t10Subject'),
      category: t('mockData.tickets.categoryPayment'),
      status: 'closed',
      priority: 'low',
      createdDate: '8 Şub 2026',
      lastReply: '9 Şub 2026',
      snippet: t('mockData.tickets.t10Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t10Msg1'), date: '8 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t10Msg2'), date: '9 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024011',
      subject: t('mockData.tickets.t11Subject'),
      category: t('mockData.tickets.categoryShipping'),
      status: 'closed',
      priority: 'normal',
      createdDate: '5 Şub 2026',
      lastReply: '6 Şub 2026',
      snippet: t('mockData.tickets.t11Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t11Msg1'), date: '5 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t11Msg2'), date: '6 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024012',
      subject: t('mockData.tickets.t12Subject'),
      category: t('mockData.tickets.categoryProductQuality'),
      status: 'pending',
      priority: 'normal',
      createdDate: '26 Şub 2026',
      lastReply: '28 Şub 2026',
      snippet: t('mockData.tickets.t12Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t12Msg1'), date: '26 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t12Msg2'), date: '28 Şub 2026' },
      ],
    },
    {
      id: 'TK-2024013',
      subject: t('mockData.tickets.t13Subject'),
      category: t('mockData.tickets.categoryAccount'),
      status: 'open',
      priority: 'low',
      createdDate: '4 Mar 2026',
      snippet: t('mockData.tickets.t13Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t13Msg1'), date: '4 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024014',
      subject: t('mockData.tickets.t14Subject'),
      category: t('mockData.tickets.categoryPayment'),
      status: 'open',
      priority: 'high',
      createdDate: '27 Şub 2026',
      lastReply: '1 Mar 2026',
      snippet: t('mockData.tickets.t14Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t14Msg1'), date: '27 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t14Msg2'), date: '1 Mar 2026' },
      ],
    },
    {
      id: 'TK-2024015',
      subject: t('mockData.tickets.t15Subject'),
      category: t('mockData.tickets.categoryOrder'),
      status: 'closed',
      priority: 'high',
      createdDate: '12 Şub 2026',
      lastReply: '15 Şub 2026',
      snippet: t('mockData.tickets.t15Snippet'),
      messages: [
        { sender: 'user', text: t('mockData.tickets.t15Msg1'), date: '12 Şub 2026' },
        { sender: 'support', text: t('mockData.tickets.t15Msg2'), date: '15 Şub 2026' },
      ],
    },
  ];
}
