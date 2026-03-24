/**
 * Mock data for Top Deals page
 */

import type { ProductImageKind } from '../types/productListing';

export interface TopDealsProduct {
  id: string;
  name: string;
  href: string;
  price: string;
  imageKind: ProductImageKind;
  imageSrc?: string;
  moq: string;
  dealBadge?: 'match' | 'top-pick';
  discountPercent?: number;
  discountLabel?: string;
  soldCount?: string;
  featureTags?: string[];
  category: string;
  subCategory?: string;
}

export interface TopDealCategory {
  id: string;
  labelKey: string;
  subFilters?: { id: string; labelKey: string }[];
}

export function getTopDealCategories(): TopDealCategory[] {
  return [
    {
      id: 'all',
      labelKey: 'topDealsPage.tabAll',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'handbags', labelKey: 'Handbags' },
        { id: 'headphones', labelKey: 'Headphones' },
        { id: 'activewear', labelKey: 'Activewear' },
        { id: 'candles', labelKey: 'Candles' },
        { id: 'power-tools', labelKey: 'Power Tools' },
      ],
    },
    {
      id: 'free-shipping',
      labelKey: 'topDealsPage.tabFreeShipping',
    },
    {
      id: 'jewelry',
      labelKey: 'topDealsPage.tabJewelry',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'rings', labelKey: 'Rings' },
        { id: 'necklaces', labelKey: 'Necklaces' },
        { id: 'earrings', labelKey: 'Earrings' },
        { id: 'watches', labelKey: 'Watches' },
        { id: 'sunglasses', labelKey: 'Sunglasses' },
      ],
    },
    {
      id: 'electronics',
      labelKey: 'topDealsPage.tabElectronics',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'headphones', labelKey: 'Headphones' },
        { id: 'speakers', labelKey: 'Speakers' },
        { id: 'power-banks', labelKey: 'Power Banks' },
        { id: 'smart-watches', labelKey: 'Smart Watches' },
        { id: 'led', labelKey: 'LED Lighting' },
      ],
    },
    {
      id: 'bags',
      labelKey: 'topDealsPage.tabBags',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'backpacks', labelKey: 'Backpacks' },
        { id: 'handbags', labelKey: 'Handbags' },
        { id: 'luggage', labelKey: 'Luggage' },
        { id: 'wallets', labelKey: 'Wallets' },
      ],
    },
    {
      id: 'clothing',
      labelKey: 'topDealsPage.tabClothing',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 't-shirts', labelKey: 'T-Shirts' },
        { id: 'dresses', labelKey: 'Dresses' },
        { id: 'jackets', labelKey: 'Jackets' },
        { id: 'activewear', labelKey: 'Activewear' },
      ],
    },
    {
      id: 'crafts',
      labelKey: 'topDealsPage.tabCrafts',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'candles', labelKey: 'Candles' },
        { id: 'ornaments', labelKey: 'Ornaments' },
        { id: 'figurines', labelKey: 'Figurines' },
      ],
    },
    {
      id: 'home',
      labelKey: 'topDealsPage.tabHome',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'kitchen', labelKey: 'Kitchen' },
        { id: 'bathroom', labelKey: 'Bathroom' },
        { id: 'garden-tools', labelKey: 'Garden Tools' },
        { id: 'furniture', labelKey: 'Furniture' },
      ],
    },
    {
      id: 'tools',
      labelKey: 'topDealsPage.tabTools',
      subFilters: [
        { id: 'all', labelKey: 'topDealsPage.filterAll' },
        { id: 'power-tools', labelKey: 'Power Tools' },
        { id: 'hand-tools', labelKey: 'Hand Tools' },
        { id: 'measuring', labelKey: 'Measuring' },
      ],
    },
  ];
}

export function getSubFiltersForCategory(categoryId: string): { id: string; labelKey: string }[] {
  const cat = getTopDealCategories().find(c => c.id === categoryId);
  return cat?.subFilters ?? [];
}

const imageKindMap: Record<string, ProductImageKind> = {
  jewelry: 'jewelry',
  electronics: 'electronics',
  bags: 'accessory',
  clothing: 'clothing',
  crafts: 'crafts',
  home: 'tools',
  tools: 'tools',
};

export function getImageKindForCategory(categoryId: string): ProductImageKind {
  return imageKindMap[categoryId] || 'electronics';
}

export function getMockTopDealsProducts(): TopDealsProduct[] {
  return [
    // Jewelry
    { id: 'td-1', name: 'Sterling Silver Cubic Zirconia Ring Set', href: '/pages/product-detail.html', price: '$2.80', imageKind: 'jewelry', moq: '50 pcs', dealBadge: 'match', discountPercent: 53, soldCount: '3.2K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'jewelry', subCategory: 'rings' },
    { id: 'td-2', name: 'Gold Plated Layered Chain Necklace', href: '/pages/product-detail.html', price: '$1.95', imageKind: 'jewelry', moq: '100 pcs', discountPercent: 47, discountLabel: 'lower', soldCount: '1.8K+', featureTags: ['Free shipping'], category: 'jewelry', subCategory: 'necklaces' },
    { id: 'td-3', name: 'Crystal Drop Earrings Wedding Set', href: '/pages/product-detail.html', price: '$3.50', imageKind: 'jewelry', moq: '30 pcs', dealBadge: 'top-pick', discountPercent: 61, soldCount: '956', featureTags: ['Ready to ship'], category: 'jewelry', subCategory: 'earrings' },
    { id: 'td-4', name: 'Vintage Polarized UV400 Sunglasses', href: '/pages/product-detail.html', price: '$1.20', imageKind: 'jewelry', moq: '60 pcs', discountPercent: 68, soldCount: '5.1K+', featureTags: ['Free shipping', 'Top ranking'], category: 'jewelry', subCategory: 'sunglasses' },
    { id: 'td-5', name: 'Stainless Steel Quartz Business Watch', href: '/pages/product-detail.html', price: '$4.99', imageKind: 'jewelry', moq: '20 pcs', dealBadge: 'match', discountPercent: 42, discountLabel: 'lowest', soldCount: '2.4K+', featureTags: ['Free shipping'], category: 'jewelry', subCategory: 'watches' },
    { id: 'td-6', name: 'Bohemian Beaded Bracelet Stack', href: '/pages/product-detail.html', price: '$0.85', imageKind: 'jewelry', moq: '200 pcs', discountPercent: 55, soldCount: '4.7K+', featureTags: ['Ready to ship'], category: 'jewelry', subCategory: 'rings' },

    // Electronics
    { id: 'td-7', name: 'TWS Wireless Bluetooth 5.3 Earbuds', href: '/pages/product-detail.html', price: '$3.20', imageKind: 'electronics', moq: '50 pcs', dealBadge: 'match', discountPercent: 71, soldCount: '8.9K+', featureTags: ['Free shipping', 'Top ranking'], category: 'electronics', subCategory: 'headphones' },
    { id: 'td-8', name: 'Portable Mini Bluetooth Speaker', href: '/pages/product-detail.html', price: '$4.50', imageKind: 'electronics', moq: '30 pcs', discountPercent: 58, discountLabel: 'lower', soldCount: '3.6K+', featureTags: ['Free shipping'], category: 'electronics', subCategory: 'speakers' },
    { id: 'td-9', name: '20000mAh Fast Charging Power Bank', href: '/pages/product-detail.html', price: '$6.80', imageKind: 'electronics', moq: '20 pcs', dealBadge: 'top-pick', discountPercent: 45, soldCount: '6.2K+', featureTags: ['Ready to ship'], category: 'electronics', subCategory: 'power-banks' },
    { id: 'td-10', name: 'Smart Watch Fitness Tracker IP68', href: '/pages/product-detail.html', price: '$5.99', imageKind: 'electronics', moq: '10 pcs', discountPercent: 63, soldCount: '4.1K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'electronics', subCategory: 'smart-watches' },
    { id: 'td-11', name: 'LED Strip Light 5M RGB Remote', href: '/pages/product-detail.html', price: '$1.80', imageKind: 'electronics', moq: '100 pcs', dealBadge: 'match', discountPercent: 52, discountLabel: 'lowest', soldCount: '7.3K+', featureTags: ['Free shipping'], category: 'electronics', subCategory: 'led' },
    { id: 'td-12', name: 'Noise Cancelling Over-Ear Headphones', href: '/pages/product-detail.html', price: '$8.50', imageKind: 'electronics', moq: '15 pcs', discountPercent: 39, soldCount: '2.8K+', featureTags: ['Top ranking'], category: 'electronics', subCategory: 'headphones' },

    // Bags
    { id: 'td-13', name: 'Waterproof Travel Laptop Backpack', href: '/pages/product-detail.html', price: '$5.20', imageKind: 'accessory', moq: '20 pcs', dealBadge: 'match', discountPercent: 56, soldCount: '4.5K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'bags', subCategory: 'backpacks' },
    { id: 'td-14', name: 'PU Leather Crossbody Handbag', href: '/pages/product-detail.html', price: '$3.90', imageKind: 'accessory', moq: '30 pcs', discountPercent: 49, discountLabel: 'lower', soldCount: '2.1K+', featureTags: ['Free shipping'], category: 'bags', subCategory: 'handbags' },
    { id: 'td-15', name: 'Hardside Spinner Luggage 20 inch', href: '/pages/product-detail.html', price: '$18.50', imageKind: 'accessory', moq: '5 pcs', dealBadge: 'top-pick', discountPercent: 35, soldCount: '876', featureTags: ['Ready to ship'], category: 'bags', subCategory: 'luggage' },
    { id: 'td-16', name: 'RFID Blocking Slim Card Wallet', href: '/pages/product-detail.html', price: '$1.50', imageKind: 'accessory', moq: '100 pcs', discountPercent: 64, soldCount: '6.8K+', featureTags: ['Free shipping', 'Top ranking'], category: 'bags', subCategory: 'wallets' },
    { id: 'td-17', name: 'Canvas School Drawstring Bag', href: '/pages/product-detail.html', price: '$0.95', imageKind: 'accessory', moq: '200 pcs', dealBadge: 'match', discountPercent: 72, soldCount: '9.1K+', featureTags: ['Free shipping'], category: 'bags', subCategory: 'backpacks' },

    // Clothing
    { id: 'td-18', name: 'Oversized Cotton Graphic T-Shirt', href: '/pages/product-detail.html', price: '$2.10', imageKind: 'clothing', moq: '50 pcs', dealBadge: 'match', discountPercent: 58, soldCount: '5.4K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'clothing', subCategory: 't-shirts' },
    { id: 'td-19', name: 'Summer Floral Maxi Dress', href: '/pages/product-detail.html', price: '$6.80', imageKind: 'clothing', moq: '20 pcs', discountPercent: 44, discountLabel: 'lower', soldCount: '1.9K+', featureTags: ['Free shipping'], category: 'clothing', subCategory: 'dresses' },
    { id: 'td-20', name: 'Waterproof Windbreaker Jacket', href: '/pages/product-detail.html', price: '$7.90', imageKind: 'clothing', moq: '15 pcs', dealBadge: 'top-pick', discountPercent: 51, soldCount: '3.3K+', featureTags: ['Ready to ship'], category: 'clothing', subCategory: 'jackets' },
    { id: 'td-21', name: 'Quick Dry Running Sports Leggings', href: '/pages/product-detail.html', price: '$3.50', imageKind: 'clothing', moq: '30 pcs', discountPercent: 62, soldCount: '4.7K+', featureTags: ['Free shipping', 'Top ranking'], category: 'clothing', subCategory: 'activewear' },
    { id: 'td-22', name: 'Vintage Denim Cargo Pants', href: '/pages/product-detail.html', price: '$8.20', imageKind: 'clothing', moq: '10 pcs', dealBadge: 'match', discountPercent: 37, discountLabel: 'lowest', soldCount: '2.6K+', featureTags: ['Free shipping'], category: 'clothing', subCategory: 't-shirts' },

    // Crafts
    { id: 'td-23', name: 'Scented Soy Wax Candle Gift Set', href: '/pages/product-detail.html', price: '$1.60', imageKind: 'crafts', moq: '100 pcs', dealBadge: 'match', discountPercent: 67, soldCount: '3.9K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'crafts', subCategory: 'candles' },
    { id: 'td-24', name: 'Resin Crystal Ball Ornament', href: '/pages/product-detail.html', price: '$2.40', imageKind: 'crafts', moq: '50 pcs', discountPercent: 53, discountLabel: 'lower', soldCount: '1.5K+', featureTags: ['Free shipping'], category: 'crafts', subCategory: 'ornaments' },
    { id: 'td-25', name: 'Ceramic Animal Miniature Figurine', href: '/pages/product-detail.html', price: '$0.75', imageKind: 'crafts', moq: '200 pcs', dealBadge: 'top-pick', discountPercent: 74, soldCount: '7.2K+', featureTags: ['Ready to ship'], category: 'crafts', subCategory: 'figurines' },
    { id: 'td-26', name: 'Handmade Macrame Wall Hanging', href: '/pages/product-detail.html', price: '$3.20', imageKind: 'crafts', moq: '30 pcs', discountPercent: 48, soldCount: '2.3K+', featureTags: ['Free shipping'], category: 'crafts', subCategory: 'ornaments' },
    { id: 'td-27', name: 'LED Flameless Pillar Candle Set', href: '/pages/product-detail.html', price: '$2.80', imageKind: 'crafts', moq: '40 pcs', dealBadge: 'match', discountPercent: 59, soldCount: '4.1K+', featureTags: ['Free shipping', 'Top ranking'], category: 'crafts', subCategory: 'candles' },

    // Home & Garden
    { id: 'td-28', name: 'Stainless Steel Kitchen Knife Set', href: '/pages/product-detail.html', price: '$4.80', imageKind: 'tools', moq: '20 pcs', dealBadge: 'match', discountPercent: 55, soldCount: '3.7K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'home', subCategory: 'kitchen' },
    { id: 'td-29', name: 'Rainfall Shower Head Chrome', href: '/pages/product-detail.html', price: '$3.90', imageKind: 'tools', moq: '30 pcs', discountPercent: 46, discountLabel: 'lower', soldCount: '2.0K+', featureTags: ['Free shipping'], category: 'home', subCategory: 'bathroom' },
    { id: 'td-30', name: 'Automatic Drip Irrigation System', href: '/pages/product-detail.html', price: '$2.50', imageKind: 'tools', moq: '50 pcs', dealBadge: 'top-pick', discountPercent: 63, soldCount: '5.8K+', featureTags: ['Ready to ship'], category: 'home', subCategory: 'garden-tools' },
    { id: 'td-31', name: 'Foldable Storage Ottoman Bench', href: '/pages/product-detail.html', price: '$7.20', imageKind: 'packaging', moq: '10 pcs', discountPercent: 41, soldCount: '1.4K+', featureTags: ['Free shipping'], category: 'home', subCategory: 'furniture' },
    { id: 'td-32', name: 'Bamboo Utensil Organizer Drawer', href: '/pages/product-detail.html', price: '$3.10', imageKind: 'tools', moq: '40 pcs', dealBadge: 'match', discountPercent: 57, discountLabel: 'lowest', soldCount: '3.2K+', featureTags: ['Free shipping', 'Top ranking'], category: 'home', subCategory: 'kitchen' },

    // Tools & Hardware
    { id: 'td-33', name: 'Cordless Impact Drill Driver Kit', href: '/pages/product-detail.html', price: '$12.50', imageKind: 'tools', moq: '5 pcs', dealBadge: 'match', discountPercent: 48, soldCount: '2.9K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'tools', subCategory: 'power-tools' },
    { id: 'td-34', name: '45-in-1 Precision Screwdriver Set', href: '/pages/product-detail.html', price: '$2.80', imageKind: 'tools', moq: '50 pcs', discountPercent: 65, discountLabel: 'lower', soldCount: '6.4K+', featureTags: ['Free shipping'], category: 'tools', subCategory: 'hand-tools' },
    { id: 'td-35', name: 'Digital Laser Distance Measurer', href: '/pages/product-detail.html', price: '$5.90', imageKind: 'tools', moq: '20 pcs', dealBadge: 'top-pick', discountPercent: 52, soldCount: '1.7K+', featureTags: ['Ready to ship'], category: 'tools', subCategory: 'measuring' },
    { id: 'td-36', name: 'Heavy Duty Adjustable Wrench Set', href: '/pages/product-detail.html', price: '$3.40', imageKind: 'tools', moq: '30 pcs', discountPercent: 59, soldCount: '4.0K+', featureTags: ['Free shipping', 'Top ranking'], category: 'tools', subCategory: 'hand-tools' },
    { id: 'td-37', name: 'Portable Electric Heat Gun 2000W', href: '/pages/product-detail.html', price: '$8.90', imageKind: 'tools', moq: '10 pcs', dealBadge: 'match', discountPercent: 43, discountLabel: 'lowest', soldCount: '2.2K+', featureTags: ['Free shipping'], category: 'tools', subCategory: 'power-tools' },

    // Free shipping tagged items (cross-category)
    { id: 'td-38', name: 'Silicone Phone Case Ultra Thin', href: '/pages/product-detail.html', price: '$0.45', imageKind: 'electronics', moq: '500 pcs', dealBadge: 'match', discountPercent: 78, soldCount: '12.5K+', featureTags: ['Free shipping', 'Top ranking'], category: 'electronics', subCategory: 'headphones' },
    { id: 'td-39', name: 'Bamboo Fiber Face Towel Set', href: '/pages/product-detail.html', price: '$0.60', imageKind: 'packaging', moq: '300 pcs', discountPercent: 70, soldCount: '8.3K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'home', subCategory: 'bathroom' },
    { id: 'td-40', name: 'Artificial Succulent Plant Set', href: '/pages/product-detail.html', price: '$1.20', imageKind: 'crafts', moq: '100 pcs', dealBadge: 'top-pick', discountPercent: 66, soldCount: '5.6K+', featureTags: ['Free shipping'], category: 'home', subCategory: 'garden-tools' },
    { id: 'td-41', name: 'USB C Fast Charging Cable 3-Pack', href: '/pages/product-detail.html', price: '$0.90', imageKind: 'electronics', moq: '200 pcs', discountPercent: 73, soldCount: '15.2K+', featureTags: ['Free shipping', 'Top ranking'], category: 'electronics', subCategory: 'headphones' },
    { id: 'td-42', name: 'Microfiber Cleaning Cloth 10-Pack', href: '/pages/product-detail.html', price: '$0.35', imageKind: 'packaging', moq: '500 pcs', dealBadge: 'match', discountPercent: 82, soldCount: '10.1K+', featureTags: ['Free shipping'], category: 'home', subCategory: 'kitchen' },
    { id: 'td-43', name: 'Faux Leather Travel Passport Cover', href: '/pages/product-detail.html', price: '$0.70', imageKind: 'accessory', moq: '200 pcs', discountPercent: 69, soldCount: '7.7K+', featureTags: ['Free shipping', 'Ready to ship'], category: 'bags', subCategory: 'wallets' },
    { id: 'td-44', name: 'Cotton Ankle Socks 5-Pair Pack', href: '/pages/product-detail.html', price: '$1.10', imageKind: 'clothing', moq: '100 pcs', dealBadge: 'match', discountPercent: 61, soldCount: '9.4K+', featureTags: ['Free shipping', 'Top ranking'], category: 'clothing', subCategory: 'activewear' },
    { id: 'td-45', name: 'Mini Portable USB Desk Fan', href: '/pages/product-detail.html', price: '$1.80', imageKind: 'electronics', moq: '80 pcs', discountPercent: 57, discountLabel: 'lower', soldCount: '6.1K+', featureTags: ['Free shipping'], category: 'electronics', subCategory: 'led' },
  ];
}
