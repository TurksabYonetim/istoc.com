/**
 * MegaMenu Component — Dynamic multi-view Alibaba-style
 * Each SubHeader nav item triggers a different mega menu view:
 * - "All Categories" → category sidebar + product panels
 * - "Featured Selections" → featured cards + quick links
 * - "Order Protections" → trade assurance info
 *
 * Uses opacity/pointer-events for show/hide (no display:none)
 * Fixed position overlay below SubHeader nav
 */

import { t } from '../../i18n';
import { callMethod } from '../../utils/api';

/* ════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════ */

export interface MegaMenuCategory {
  id: string;
  name: string;
  icon: string;
  products: { name: string; href: string; badge?: boolean }[];
}

export const megaCategories: MegaMenuCategory[] = [
  {
    id: 'apparel',
    name: 'Apparel & Accessories',
    icon: 'shirt',
    products: [
      { name: 'Bridesmaid Dresses', href: 'products.html?q=bridesmaid+dresses' },
      { name: 'Carnival Costume', href: 'products.html?q=carnival+costume' },
      { name: 'Rhinestones', href: 'products.html?q=rhinestones' },
      { name: 'Camouflage', href: 'products.html?q=camouflage' },
      { name: 'Polyester Ties', href: 'products.html?q=polyester+ties' },
      { name: 'Ice Hockey', href: 'products.html?q=ice+hockey' },
      { name: 'Mittens', href: 'products.html?q=mittens' },
    ],
  },
  {
    id: 'consumer-electronics',
    name: 'Consumer Electronics',
    icon: 'chip',
    products: [
      { name: 'Smart Watches', href: 'products.html?q=smart+watches' },
      { name: 'Wireless Earbuds', href: 'products.html?q=wireless+earbuds' },
      { name: 'Bluetooth Speakers', href: 'products.html?q=bluetooth+speakers' },
      { name: 'Action Cameras', href: 'products.html?q=action+cameras' },
      { name: 'LED Monitors', href: 'products.html?q=led+monitors' },
      { name: 'Drone', href: 'products.html?q=drone' },
      { name: 'VR Headset', href: 'products.html?q=vr+headset' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Entertainment',
    icon: 'trophy',
    products: [
      { name: 'Fitness Equipment', href: 'products.html?q=fitness+equipment' },
      { name: 'Yoga Mats', href: 'products.html?q=yoga+mats' },
      { name: 'Boxing Gloves', href: 'products.html?q=boxing+gloves' },
      { name: 'Camping Tents', href: 'products.html?q=camping+tents' },
      { name: 'Fishing Rods', href: 'products.html?q=fishing+rods' },
      { name: 'Skateboard', href: 'products.html?q=skateboard' },
      { name: 'Golf Clubs', href: 'products.html?q=golf+clubs' },
    ],
  },
  {
    id: 'sportswear',
    name: 'Sportswear & Outdoor Apparel',
    icon: 'running',
    products: [
      { name: 'Running Shoes', href: 'products.html?q=running+shoes' },
      { name: 'Track Suits', href: 'products.html?q=track+suits' },
      { name: 'Hiking Boots', href: 'products.html?q=hiking+boots' },
      { name: 'Windbreakers', href: 'products.html?q=windbreakers' },
      { name: 'Ski Jackets', href: 'products.html?q=ski+jackets' },
      { name: 'Cycling Wear', href: 'products.html?q=cycling+wear' },
      { name: 'Sports Bras', href: 'products.html?q=sports+bras' },
    ],
  },
  {
    id: 'shoes',
    name: 'Shoes & Accessories',
    icon: 'shoe',
    products: [
      { name: 'Sneakers', href: 'products.html?q=sneakers' },
      { name: 'Leather Boots', href: 'products.html?q=leather+boots' },
      { name: 'Sandals', href: 'products.html?q=sandals' },
      { name: 'High Heels', href: 'products.html?q=high+heels' },
      { name: 'Belts', href: 'products.html?q=belts' },
      { name: 'Sunglasses', href: 'products.html?q=sunglasses' },
      { name: 'Wallets', href: 'products.html?q=wallets' },
    ],
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: 'home',
    products: [
      { name: 'Garden Furniture', href: 'products.html?q=garden+furniture' },
      { name: 'Kitchen Appliances', href: 'products.html?q=kitchen+appliances' },
      { name: 'Bed Sheets', href: 'products.html?q=bed+sheets' },
      { name: 'LED Lights', href: 'products.html?q=led+lights' },
      { name: 'Curtains', href: 'products.html?q=curtains' },
      { name: 'Storage Boxes', href: 'products.html?q=storage+boxes' },
      { name: 'Wall Decor', href: 'products.html?q=wall+decor' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: 'sparkles',
    products: [
      { name: 'Skincare Set', href: 'products.html?q=skincare+set' },
      { name: 'Hair Extensions', href: 'products.html?q=hair+extensions' },
      { name: 'Makeup Brushes', href: 'products.html?q=makeup+brushes' },
      { name: 'Perfume', href: 'products.html?q=perfume' },
      { name: 'Nail Art', href: 'products.html?q=nail+art' },
      { name: 'Face Masks', href: 'products.html?q=face+masks' },
      { name: 'Hair Dryers', href: 'products.html?q=hair+dryers' },
    ],
  },
  {
    id: 'jewelry',
    name: 'Jewelry, Eyewear & Watches',
    icon: 'diamond',
    products: [
      { name: 'Fashion Rings', href: 'products.html?q=fashion+rings' },
      { name: 'Necklaces', href: 'products.html?q=necklaces' },
      { name: 'Wrist Watches', href: 'products.html?q=wrist+watches' },
      { name: 'Earrings', href: 'products.html?q=earrings' },
      { name: 'Bracelets', href: 'products.html?q=bracelets' },
      { name: 'Reading Glasses', href: 'products.html?q=reading+glasses' },
      { name: 'Pendants', href: 'products.html?q=pendants' },
    ],
  },
  {
    id: 'luggage',
    name: 'Luggage, Bags & Cases',
    icon: 'bag',
    products: [
      { name: 'Travel Suitcase', href: 'products.html?q=travel+suitcase' },
      { name: 'Backpacks', href: 'products.html?q=backpacks' },
      { name: 'Laptop Bags', href: 'products.html?q=laptop+bags' },
      { name: 'Cosmetic Bags', href: 'products.html?q=cosmetic+bags' },
      { name: 'Messenger Bags', href: 'products.html?q=messenger+bags' },
      { name: 'Phone Cases', href: 'products.html?q=phone+cases' },
      { name: 'Wallets', href: 'products.html?q=wallets' },
    ],
  },
  {
    id: 'packaging',
    name: 'Packaging & Printing',
    icon: 'box',
    products: [
      { name: 'Gift Boxes', href: 'products.html?q=gift+boxes' },
      { name: 'Paper Bags', href: 'products.html?q=paper+bags' },
      { name: 'Labels', href: 'products.html?q=labels' },
      { name: 'Bubble Wrap', href: 'products.html?q=bubble+wrap' },
      { name: 'Stickers', href: 'products.html?q=stickers' },
      { name: 'Tape', href: 'products.html?q=packaging+tape' },
      { name: 'Tissue Paper', href: 'products.html?q=tissue+paper' },
    ],
  },
  {
    id: 'kids',
    name: 'Parents, Kids & Toys',
    icon: 'baby',
    products: [
      { name: 'Building Blocks', href: 'products.html?q=building+blocks' },
      { name: 'Strollers', href: 'products.html?q=strollers' },
      { name: 'Plush Toys', href: 'products.html?q=plush+toys' },
      { name: 'Diapers', href: 'products.html?q=diapers' },
      { name: 'Baby Clothes', href: 'products.html?q=baby+clothes' },
      { name: 'RC Cars', href: 'products.html?q=rc+cars' },
      { name: 'Puzzles', href: 'products.html?q=puzzles' },
    ],
  },
];

/* ──── Featured Selections data ──── */

const featureCards = [
  {
    titleKey: 'mega.topRanking',
    href: '/top-ranking',
    icon: `<svg class="w-10 h-10" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="#222" stroke-width="1.5"/><circle cx="20" cy="20" r="7" stroke="#222" stroke-width="1.5"/><circle cx="20" cy="20" r="2" fill="#222"/><line x1="20" y1="2" x2="20" y2="8" stroke="#222" stroke-width="1.5"/><line x1="20" y1="32" x2="20" y2="38" stroke="#222" stroke-width="1.5"/><line x1="2" y1="20" x2="8" y2="20" stroke="#222" stroke-width="1.5"/><line x1="32" y1="20" x2="38" y2="20" stroke="#222" stroke-width="1.5"/></svg>`,
  },
  {
    titleKey: 'mega.newArrivals',
    href: '/new-arrivals',
    icon: `<svg class="w-10 h-10" viewBox="0 0 40 40" fill="none"><rect x="4" y="8" width="32" height="24" rx="3" stroke="#222" stroke-width="1.5"/><rect x="8" y="13" width="24" height="14" rx="1.5" stroke="#222" stroke-width="1"/><text x="20" y="24" text-anchor="middle" font-size="10" font-weight="700" fill="#222" font-family="sans-serif">NEW</text></svg>`,
  },
  {
    titleKey: 'mega.topDeals',
    href: '/pages/top-deals.html',
    icon: `<svg class="w-10 h-10" viewBox="0 0 40 40" fill="none"><path d="M17 5h-7a4 4 0 0 0-4 4v7.17a4 4 0 0 0 1.17 2.83l13.66 13.66a4 4 0 0 0 5.66 0l7.17-7.17a4 4 0 0 0 0-5.66L19.83 6.17A4 4 0 0 0 17 5Z" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12.5" cy="12.5" r="2" fill="#222"/></svg>`,
  },
];

const quickLinks = [
  { labelKey: 'mega.dropshippingCenter', href: '/dropshipping', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>` },
  { labelKey: 'mega.sampleCenter', href: '/samples', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/></svg>` },
  { labelKey: 'mega.fastCustomization', href: '/customization', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>` },
  { labelKey: 'mega.onlineTradeShow', href: '/trade-show', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558"/></svg>` },
];

/* ──── Order Protections data ──── */

const protectionCards = [
  {
    titleKey: 'mega.safePayments',
    href: '/order-protections/payments',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>`,
  },
  {
    titleKey: 'mega.moneyBack',
    href: '/order-protections/refund',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
  },
  {
    titleKey: 'mega.shippingLogistics',
    href: '/order-protections/shipping',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
  },
  {
    titleKey: 'mega.afterSales',
    href: '/order-protections/after-sales',
    icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/></svg>`,
  },
];

/* ════════════════════════════════════════════════════
   ICON MAP
   ════════════════════════════════════════════════════ */

export function getCategoryIcon(iconName: string): string {
  const icons: Record<string, string> = {
    star:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>`,
    shirt:       `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>`,
    chip:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"/></svg>`,
    trophy:      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 0 1-3.815 1.274m0 0a6.003 6.003 0 0 1-3.815-1.274"/></svg>`,
    running:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>`,
    shoe:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z"/></svg>`,
    home:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
    sparkles:    `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>`,
    diamond:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3L2 9l10 13 10-13-10-6z"/></svg>`,
    bag:         `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>`,
    box:         `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/></svg>`,
    baby:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/></svg>`,
    // ── Yeni iconlar ──
    food:        `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 16.5v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 9 10.125v-1.5M15 16.5h-6m6 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0"/></svg>`,
    textile:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.241-.106l.738.148a4.5 4.5 0 0 1 3.452 5.216l-.049.232a4.5 4.5 0 0 1-5.002 3.519l-1.228-.152a4.5 4.5 0 0 1-2.316-.88l-.422-.296"/></svg>`,
    chemistry:   `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/></svg>`,
    agriculture: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`,
    health:      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`,
    building:    `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"/></svg>`,
    machinery:   `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>`,
    tools:       `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"/></svg>`,
    car:         `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>`,
    paper:       `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>`,
    electrical:  `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/></svg>`,
    furniture:   `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>`,
    shopping:    `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/></svg>`,
  };
  return icons[iconName] || icons['star'];
}

/**
 * Kategori adındaki anahtar kelimelere göre otomatik icon seçer.
 * icon_class backend'de set edilmemişse bu fonksiyon devreye girer.
 */
export function getIconByName(name: string): string {
  const n = name.toLowerCase();
  if (/gıda|yiyecek|içecek|food|drink|tarim ürün|baharat|kahve|çay/.test(n))      return getCategoryIcon('food');
  if (/tekstil|kumaş|iplik|elyaf|bez|doku/.test(n))                                return getCategoryIcon('textile');
  if (/hammadde|kimya|kimyasal|boya|solvent|reçine|plastik/.test(n))               return getCategoryIcon('chemistry');
  if (/giyim|moda|kıyafet|elbise|konfeksiyon|fashion/.test(n))                     return getCategoryIcon('shirt');
  if (/tarım|hayvancılık|bitki|tohum|gübre|ziraat|agri/.test(n))                   return getCategoryIcon('agriculture');
  if (/sağlık|medikal|tıp|ilaç|hastane|eczane|medical|health/.test(n))             return getCategoryIcon('health');
  if (/inşaat|yapı|bina|çimento|demir|beton|construction/.test(n))                 return getCategoryIcon('building');
  if (/makine|endüstri|fabrika|ekipman|machinery|industrial/.test(n))              return getCategoryIcon('machinery');
  if (/elektron|elektrik|kablo|devre|electronic/.test(n))                          return getCategoryIcon('chip');
  if (/ambalaj|paket|baskı|karton|packaging/.test(n))                              return getCategoryIcon('box');
  if (/mobilya|ev|yaşam|dekor|furniture/.test(n))                                  return getCategoryIcon('home');
  if (/otomotiv|araç|oto|taşıt|yedek parça|automotive/.test(n))                   return getCategoryIcon('car');
  if (/kağıt|ofis|kırtasiye|paper|office/.test(n))                                 return getCategoryIcon('paper');
  if (/güzellik|kozmetik|kişisel bakım|beauty|cosmetic/.test(n))                   return getCategoryIcon('sparkles');
  if (/takı|mücevher|aksesuar|jewelry/.test(n))                                    return getCategoryIcon('diamond');
  if (/oyuncak|bebek|çocuk|toy|baby|kids/.test(n))                                 return getCategoryIcon('baby');
  if (/spor|eğlence|sport|fitness/.test(n))                                        return getCategoryIcon('trophy');
  if (/alet|el aleti|donanım|tools|hardware/.test(n))                              return getCategoryIcon('tools');
  if (/bavul|çanta|valiz|bag|luggage/.test(n))                                     return getCategoryIcon('bag');
  return getCategoryIcon('star');
}

/* ════════════════════════════════════════════════════
   VIEW: Categories (sidebar + panels)
   ════════════════════════════════════════════════════ */

function renderCategoriesView(): string {
  return `
    <div data-mega-view="categories" class="hidden">
      <div class="flex flex-col lg:flex-row">
        <!-- Sidebar -->
        <div class="w-full lg:w-72 xl:w-80 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r dark:border-gray-700 overflow-y-auto overflow-x-hidden dark:bg-gray-900" style="background-color:var(--mega-sidebar-bg);border-color:var(--mega-border-color);-webkit-overflow-scrolling:touch" id="mega-sidebar">
          <ul class="py-1">
            <li class="px-4 py-6 text-center" id="mega-sidebar-loading">
              <svg class="w-5 h-5 animate-spin text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            </li>
          </ul>
        </div>
        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6" style="max-height:min(520px, 60vh);-webkit-overflow-scrolling:touch" id="mega-content">
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   VIEW: Featured Selections
   ════════════════════════════════════════════════════ */

function renderFeaturedView(): string {
  return `
    <div data-mega-view="featured" class="hidden py-4 sm:py-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <!-- Left: 3 Feature cards -->
        ${featureCards.map(card => `
          <a href="${card.href}" class="th-card th-mega-card flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all group">
            <span class="transition-colors" style="color:var(--mega-icon-color)">
              ${card.icon}
            </span>
            <span class="text-sm font-semibold transition-colors" style="color:var(--mega-heading-color)" data-i18n="${card.titleKey}">${t(card.titleKey)}</span>
          </a>
        `).join('')}
        <!-- Right: Quick links -->
        <div class="flex flex-col justify-center">
          <ul class="space-y-4">
            ${quickLinks.map(link => `
              <li>
                <a href="${link.href}" class="th-mega-link flex items-center gap-2.5 text-sm transition-colors">
                  <span style="color:var(--mega-icon-color)">${link.icon}</span>
                  <span data-i18n="${link.labelKey}">${t(link.labelKey)}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   VIEW: Order Protections
   ════════════════════════════════════════════════════ */

function renderProtectionsView(): string {
  return `
    <div data-mega-view="protections" class="hidden py-8">
      <div class="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
        <!-- Left: Trade Assurance branding -->
        <div class="w-full md:w-2/5 md:flex-shrink-0">
          <div class="flex items-center gap-3 mb-4">
            <span class="flex items-center justify-center w-10 h-10 rounded-full" style="background-color:var(--mega-accent-bg)">
              <svg class="w-6 h-6" style="color:var(--mega-accent-color)" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </span>
            <h3 class="text-lg font-bold" style="color:var(--mega-heading-color)">Trade Assurance</h3>
          </div>
          <p class="text-xl font-semibold leading-snug mb-6" style="color:var(--mega-heading-color)">Enjoy protection from payment to delivery</p>
          <a href="/order-protections" class="th-btn th-btn-pill inline-block px-6 py-2.5 transition-colors" data-i18n="common.learnMore">
            ${t('common.learnMore')}
          </a>
        </div>
        <!-- Right: 2x2 protection cards -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          ${protectionCards.map(card => `
            <a href="${card.href}" class="th-card th-mega-card flex items-center gap-4 hover:shadow-md transition-all group">
              <span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full" style="background-color:var(--mega-accent-bg)">
                <span style="color:var(--mega-accent-color)">${card.icon}</span>
              </span>
              <span class="flex-1 text-sm font-semibold transition-colors" style="color:var(--mega-heading-color)" data-i18n="${card.titleKey}">${t(card.titleKey)}</span>
              <svg class="w-5 h-5 transition-colors flex-shrink-0" style="color:var(--mega-icon-color)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   VIEW: Buyer Central
   ════════════════════════════════════════════════════ */

interface BuyerCentralColumn {
  titleKey: string;
  links: { labelKey: string; href: string }[];
}

const buyerCentralColumns: BuyerCentralColumn[] = [
  {
    titleKey: 'mega.getStarted',
    links: [
      { labelKey: 'mega.whatIsIstoc', href: '/pages/legal/about.html' },
    ],
  },
  {
    titleKey: 'mega.whyIstoc',
    links: [
      { labelKey: 'mega.howSourcingWorks', href: '/how-sourcing-works' },
      { labelKey: 'mega.membershipProgram', href: '/membership' },
    ],
  },
  {
    titleKey: 'mega.tradeServices',
    links: [
      { labelKey: 'mega.orderProtections', href: '/order-protections' },
      { labelKey: 'mega.letterOfCredit', href: '/letter-of-credit' },
      { labelKey: 'mega.productionMonitoring', href: '/inspection' },
      { labelKey: 'mega.taxCompliance', href: '/tax-compliance' },
    ],
  },
  {
    titleKey: 'mega.resources',
    links: [
      { labelKey: 'mega.successStories', href: '/success-stories' },
      { labelKey: 'mega.blogs', href: '/blogs' },
      { labelKey: 'mega.industryReports', href: '/reports' },
      { labelKey: 'mega.helpCenter', href: '/pages/help/help-center.html' },
    ],
  },
  {
    titleKey: 'mega.webinars',
    links: [
      { labelKey: 'mega.overview', href: '/webinars' },
      { labelKey: 'mega.meetThePeers', href: '/webinars/peers' },
      { labelKey: 'mega.ecommerceAcademy', href: '/ecommerce-academy' },
      { labelKey: 'mega.howToSource', href: '/how-to-source' },
    ],
  },
];

function renderBuyerCentralView(): string {
  return `
    <div data-mega-view="buyer-central" class="hidden py-4 sm:py-8 px-2 sm:px-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8">
        ${buyerCentralColumns.map(col => `
          <div>
            <h4 class="text-sm font-bold mb-4" style="color:var(--mega-heading-color)" data-i18n="${col.titleKey}">${t(col.titleKey)}</h4>
            <ul class="space-y-3">
              ${col.links.map(link => `
                <li>
                  <a href="${link.href}" class="th-mega-link text-sm" data-i18n="${link.labelKey}">
                    ${t(link.labelKey)}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   VIEW: Help Center
   ════════════════════════════════════════════════════ */

function renderHelpCenterView(): string {
  return `
    <div data-mega-view="help-center" class="hidden py-8 px-4">
      <div class="flex flex-col md:flex-row gap-6 md:gap-8">
        <!-- Left: Two cards -->
        <div class="flex gap-6 flex-1">
          <a href="/help/buyers" class="flex-1 flex flex-col items-center justify-center gap-4 border border-dashed rounded-md p-8 transition-all group" style="border-color:var(--mega-border-color)">
            <span class="flex items-center justify-center w-14 h-14 rounded-full transition-colors" style="background-color:var(--mega-icon-bg)">
              <svg class="w-7 h-7 transition-colors" style="color:var(--mega-icon-color)" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
            </span>
            <span class="text-sm font-semibold transition-colors" style="color:var(--mega-heading-color)" data-i18n="mega.forBuyers">${t('mega.forBuyers')}</span>
          </a>
          <a href="/help/suppliers" class="flex-1 flex flex-col items-center justify-center gap-4 border border-dashed rounded-md p-8 transition-all group" style="border-color:var(--mega-border-color)">
            <span class="flex items-center justify-center w-14 h-14 rounded-full transition-colors" style="background-color:var(--mega-icon-bg)">
              <svg class="w-7 h-7 transition-colors" style="color:var(--mega-icon-color)" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
              </svg>
            </span>
            <span class="text-sm font-semibold transition-colors" style="color:var(--mega-heading-color)" data-i18n="mega.forSuppliers">${t('mega.forSuppliers')}</span>
          </a>
        </div>
        <!-- Right: Links -->
        <div class="w-full md:w-56 flex flex-col justify-center">
          <ul class="space-y-4">
            <li>
              <a href="/help/dispute" class="th-mega-link text-sm" data-i18n="mega.openDispute">
                ${t('mega.openDispute')}
              </a>
            </li>
            <li>
              <a href="/help/ipr" class="th-mega-link text-sm" data-i18n="mega.reportIpr">
                ${t('mega.reportIpr')}
              </a>
            </li>
            <li>
              <a href="/help/abuse" class="th-mega-link text-sm" data-i18n="mega.reportAbuse">
                ${t('mega.reportAbuse')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   VIEW: App & Extension
   ════════════════════════════════════════════════════ */

function renderAppExtensionView(): string {
  return `
    <div data-mega-view="app-extension" class="hidden py-8 px-4">
      <div class="flex flex-col md:flex-row">
        <!-- Left: Get the app -->
        <div class="flex-1 md:pr-10">
          <h4 class="text-lg font-bold mb-2" style="color:var(--mega-heading-color)" data-i18n="mega.getApp">${t('mega.getApp')}</h4>
          <p class="text-sm mb-5 max-w-sm" style="color:var(--mega-body-text)" data-i18n="mega.appDesc">${t('mega.appDesc')}</p>
          <div class="flex items-center gap-5">
            <!-- App badges -->
            <div class="flex flex-col gap-2.5">
              <a href="/app/ios" class="inline-flex items-center gap-2 bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z"/></svg>
                <div class="flex flex-col">
                  <span class="text-[10px] leading-none opacity-80" data-i18n="mega.downloadOn">${t('mega.downloadOn')}</span>
                  <span class="text-sm font-semibold leading-tight" data-i18n="mega.appStore">${t('mega.appStore')}</span>
                </div>
              </a>
              <a href="/app/android" class="inline-flex items-center gap-2 bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="m3.18 23.96.02.02c.04-.06.06-.12.09-.19l4.58-9.81a.3.3 0 0 0-.13-.39L.56 9.42a.3.3 0 0 0-.41.13L.02 9.8A11.94 11.94 0 0 0 0 12.09c0 4.5 2.04 7.6 3.18 11.87Z"/><path d="m8.44 12.96-.37.79-4.58 9.81c-.02.05-.04.11-.07.16l.02.02c3.71-2.2 13.08-7.74 22.54-13.25a.1.1 0 0 0 .02-.17l-4.09-3.55a.3.3 0 0 0-.33-.04l-13.14 6.23Z"/><path d="M8.07 11.03 21.21 4.8a.3.3 0 0 0 .05-.51L17.54 1.3a.3.3 0 0 0-.27-.05L3.4.01A.3.3 0 0 0 3.12.2l-.1.2a.3.3 0 0 0 .05.31l4.66 4.69.12.13.21.24 4.59 4.87a.3.3 0 0 1-.58.39Z"/></svg>
                <div class="flex flex-col">
                  <span class="text-[10px] leading-none opacity-80" data-i18n="mega.getItOn">${t('mega.getItOn')}</span>
                  <span class="text-sm font-semibold leading-tight" data-i18n="mega.googlePlay">${t('mega.googlePlay')}</span>
                </div>
              </a>
            </div>
            <!-- QR Code placeholder -->
            <div class="w-24 h-24 rounded-md border flex items-center justify-center" style="background-color:var(--mega-icon-bg);border-color:var(--mega-border-color)">
              <svg class="w-10 h-10" style="color:var(--mega-icon-color)" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"/>
              </svg>
            </div>
          </div>
        </div>
        <!-- Right: Discover Lens -->
        <div class="flex-1 pt-6 md:pt-0 md:pl-10 border-t md:border-t-0 md:border-l" style="border-color:var(--mega-border-color)">
          <h4 class="text-lg font-bold mb-2" style="color:var(--mega-heading-color)" data-i18n="mega.discoverLens">${t('mega.discoverLens')}</h4>
          <p class="text-sm mb-5 max-w-md" style="color:var(--mega-body-text)" data-i18n="mega.lensDesc">${t('mega.lensDesc')}</p>
          <div class="flex flex-col items-start gap-3">
            <a href="/lens" class="th-mega-link text-sm underline underline-offset-2" data-i18n="common.learnMore">
              ${t('common.learnMore')}
            </a>
            <a href="/lens/chrome" class="th-btn th-btn-pill inline-flex items-center gap-2 px-6 py-2.5 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558"/></svg>
              <span data-i18n="mega.addToChrome">${t('mega.addToChrome')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */

export function MegaMenu(): string {
  return `
    <div id="istoc-mega-overlay"
      style="position:fixed;left:0;right:0;bottom:0;z-index:var(--z-backdrop);background:rgba(0,0,0,0.5);opacity:0;pointer-events:none;transition:opacity 0.2s ease;"
    ></div>
    <div id="istoc-mega-panel"
      style="position:fixed;left:0;width:100%;z-index:var(--z-modal);opacity:0;pointer-events:none;transform:translateY(-8px);transition:opacity 0.2s ease, transform 0.2s ease;max-height:100vh;background-color:var(--mega-bg);border-color:var(--mega-border-color)"
      class="border-b dark:bg-gray-800 dark:border-gray-700 max-h-[85vh] sm:max-h-[100vh] lg:!max-h-[80vh] overflow-y-auto overscroll-contain"
    >
      <div class="container-boxed">
        ${renderCategoriesView()}
        ${renderFeaturedView()}
        ${renderProtectionsView()}
        ${renderBuyerCentralView()}
        ${renderHelpCenterView()}
        ${renderAppExtensionView()}
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════
   INIT — Hover & sidebar interaction
   ════════════════════════════════════════════════════ */

export function initMegaMenu(): void {
  const megaMenu = document.getElementById('istoc-mega-panel');
  const overlay = document.getElementById('istoc-mega-overlay');
  const triggers = document.querySelectorAll<HTMLElement>('.mega-trigger');
  const views = megaMenu?.querySelectorAll<HTMLElement>('[data-mega-view]');

  if (!megaMenu || triggers.length === 0 || !views) return;

  let isOpen = false;
  let closeTimer: number | null = null;
  let activeView: string | null = null;
  let activeTrigger: HTMLElement | null = null;

  function positionMenu(): void {
    // Position below the SubHeader nav
    const nav = triggers[0]?.closest('nav');
    if (!nav) return;
    const bottom = nav.getBoundingClientRect().bottom;
    megaMenu!.style.top = bottom + 'px';
    if (overlay) overlay.style.top = bottom + 'px';
  }

  function showView(viewName: string): void {
    views!.forEach((v) => {
      v.classList.toggle('hidden', v.getAttribute('data-mega-view') !== viewName);
    });
    activeView = viewName;
  }

  function open(trigger: HTMLElement): void {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

    const viewName = trigger.getAttribute('data-mega-target');
    if (!viewName) return;

    // Highlight active trigger
    if (activeTrigger && activeTrigger !== trigger) {
      activeTrigger.classList.remove('subheader-link--active');
    }
    trigger.classList.add('subheader-link--active');
    activeTrigger = trigger;

    positionMenu();
    showView(viewName);

    // Dispatch event to close search dropdowns when mega menu opens
    document.dispatchEvent(new CustomEvent('istoc:close-search'));

    if (!isOpen) {
      isOpen = true;
      megaMenu!.style.opacity = '1';
      megaMenu!.style.pointerEvents = 'auto';
      megaMenu!.style.transform = 'translateY(0)';
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }
      // Solid header while mega menu is open (remove gradient)
      const sh = document.getElementById('sticky-header');
      const go = document.getElementById('gradient-overlay');
      if (sh) {
        if (go) go.style.display = 'none';
        sh.style.backgroundColor = 'var(--header-scroll-bg)';
        sh.style.borderBottom = `1px solid var(--header-scroll-border)`;
      }
    }

    trigger.setAttribute('aria-expanded', 'true');
  }

  function close(): void {
    isOpen = false;
    activeView = null;
    closeTimer = null;

    megaMenu!.style.opacity = '0';
    megaMenu!.style.pointerEvents = 'none';
    megaMenu!.style.transform = 'translateY(-8px)';
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
    // Restore header gradient if not scrolled
    const sh = document.getElementById('sticky-header');
    const go = document.getElementById('gradient-overlay');
    if (sh) {
      if (window.scrollY <= 10) {
        if (go) go.style.display = '';
        sh.style.backgroundColor = '';
        sh.style.borderBottom = '';
      }
    }

    // Reset trigger states
    triggers.forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      t.classList.remove('subheader-link--active');
    });
    if (activeTrigger) {
      activeTrigger.classList.remove('subheader-link--active');
      activeTrigger = null;
    }
  }

  function scheduleClose(): void {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = window.setTimeout(close, 300);
  }

  function cancelClose(): void {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  }

  // ──── Attach events to ALL triggers ────
  triggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', () => open(trigger));
    trigger.addEventListener('mouseleave', scheduleClose);
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const viewName = trigger.getAttribute('data-mega-target');
      if (isOpen && activeView === viewName) {
        cancelClose(); close();
      } else {
        open(trigger);
      }
    });
  });

  // Keep open when hovering mega menu
  megaMenu.addEventListener('mouseenter', cancelClose);
  megaMenu.addEventListener('mouseleave', scheduleClose);

  // Overlay click closes
  if (overlay) overlay.addEventListener('click', () => { cancelClose(); close(); });

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      cancelClose(); close();
    }
  });

  // ──── Categories view: sidebar click → scroll to section ────
  const ACT = ['th-mega-sidebar-item--active'];
  const INACT = ['border-transparent'];

  function bindCategoryInteractions(): void {
    const catBtns = megaMenu!.querySelectorAll<HTMLElement>('.mega-cat-btn');
    const contentEl = document.getElementById('mega-content');
    let isScrollingFromClick = false;

    function highlightSidebarBtn(categoryId: string): void {
      catBtns.forEach((b) => { b.classList.remove(...ACT); b.classList.add(...INACT); });
      const target = megaMenu!.querySelector<HTMLElement>(`.mega-cat-btn[data-category="${categoryId}"]`);
      if (target) {
        target.classList.remove(...INACT);
        target.classList.add(...ACT);
      }
    }

    catBtns.forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const id = btn.getAttribute('data-category');
        if (!id || !contentEl) return;
        highlightSidebarBtn(id);
        const section = document.getElementById(`mega-section-${id}`);
        if (section) {
          isScrollingFromClick = true;
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { isScrollingFromClick = false; }, 500);
        }
      });
    });

    if (contentEl) {
      const sections = contentEl.querySelectorAll<HTMLElement>('.mega-cat-section');
      const observer = new IntersectionObserver(
        (entries) => {
          if (isScrollingFromClick) return;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const sectionId = entry.target.id.replace('mega-section-', '');
              highlightSidebarBtn(sectionId);
              break;
            }
          }
        },
        { root: contentEl, threshold: 0.3 }
      );
      sections.forEach((section) => observer.observe(section));
    }
  }

  bindCategoryInteractions();

  // ──── Load dynamic categories from API ────
  (async () => {
    try {
      const cats = await callMethod('tradehub_core.api.category.get_mega_menu') as Array<{
        id: string; name: string; slug: string; image?: string; icon_class?: string;
        children: Array<{ id: string; name: string; slug: string; image?: string }>;
      }>;
      if (!cats || cats.length === 0) return;

      const sidebarUl = document.querySelector<HTMLElement>('#mega-sidebar ul');
      const megaContent = document.getElementById('mega-content');
      if (!sidebarUl || !megaContent) return;

      const placeholderSvg = `<svg class="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75Z"/></svg>`;
      const viewAllSvg = `<svg class="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>`;

      function renderDynCatCard(name: string, slug: string, image?: string, isViewAll = false): string {
        const inner = isViewAll
          ? viewAllSvg
          : (image ? `<img src="${image}" alt="${name}" class="w-full h-full object-cover" loading="lazy" />` : placeholderSvg);
        const borderStyle = isViewAll ? 'border-2 border-dashed;border-color:var(--mega-border-color)' : '';
        return `
          <a href="/pages/products.html?cat=${slug}" class="flex flex-col items-center gap-1.5 sm:gap-2 group/product min-h-[44px]">
            <div class="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center overflow-hidden group-hover/product:ring-2 transition-all" style="background:var(--card-bg);--tw-ring-color:var(--nav-hover-color);${borderStyle}">
              ${inner}
            </div>
            <span class="th-nav-link text-center leading-tight transition-colors max-w-[4rem] sm:max-w-[5rem] lg:max-w-[6rem]" style="font-size:var(--mega-font-size)">${name}</span>
          </a>`;
      }

      sidebarUl.innerHTML = cats.map((cat, index) => `
        <li>
          <a
            href="/pages/products.html?cat=${cat.slug}"
            class="th-mega-sidebar-item mega-cat-btn flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-3 sm:py-2.5 text-sm text-left transition-colors border-l-2 border-transparent ${index === 0 ? 'th-mega-sidebar-item--active' : ''}"
            data-category="${cat.id}"
          >
            ${cat.image
              ? `<img src="${cat.image}" alt="${cat.name}" class="w-5 h-5 rounded-full object-cover flex-shrink-0" loading="lazy" />`
              : `<span class="flex-shrink-0 text-gray-400">${cat.icon_class ? getCategoryIcon(cat.icon_class) : getIconByName(cat.name)}</span>`
            }
            <span class="flex-1 truncate">${cat.name}</span>
            <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
          </a>
        </li>
      `).join('');

      megaContent.innerHTML = cats.map(cat => `
        <div class="mega-cat-section mb-8" id="mega-section-${cat.id}">
          <div class="flex items-center justify-between mb-5 lg:mb-6">
            <h3 class="text-base lg:text-lg font-bold dark:text-white" style="color:var(--mega-text-color)">${cat.name}</h3>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-4 gap-x-2 sm:gap-y-5 sm:gap-x-4 lg:gap-y-8 lg:gap-x-6">
            ${cat.children.map(ch => renderDynCatCard(ch.name, ch.slug, ch.image)).join('')}
            ${renderDynCatCard('Tümünü gör', cat.slug, undefined, true)}
          </div>
        </div>
      `).join('');

      bindCategoryInteractions();
    } catch (_) {
      // API başarısız olursa statik kategoriler kalır
    }
  })();
}
