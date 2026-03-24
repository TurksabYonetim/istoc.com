/**
 * Mock data for Top Ranking page
 */

export type RankingRegion = 'global' | 'us' | 'europe';
export type RankingSortMode = 'hot-selling' | 'most-popular' | 'best-reviewed';

export interface RankedProduct {
  id: string;
  name: string;
  href: string;
  price: string;
  imageSrc: string;
  moq: string;
  rank: 1 | 2 | 3;
}

export interface RankingCategoryGroup {
  id: string;
  name: string;
  nameKey: string;
  categoryId: string;
  products: RankedProduct[];
}

export interface RankingMainCategory {
  id: string;
  nameKey: string;
  subCategories?: { id: string; nameKey: string }[];
}

export interface RankingTab {
  id: string;
  labelKey: string;
}

export interface RegionOption {
  id: RankingRegion;
  labelKey: string;
}

export function getRegionOptions(): RegionOption[] {
  return [
    { id: 'global', labelKey: 'topRankingPage.regionGlobal' },
    { id: 'us', labelKey: 'topRankingPage.regionUS' },
    { id: 'europe', labelKey: 'topRankingPage.regionEurope' },
  ];
}

export function getRankingTabs(): RankingTab[] {
  return [
    { id: 'all', labelKey: 'topRankingPage.tabAll' },
    { id: 'luggage-bags', labelKey: 'topRankingPage.tabLuggageBags' },
    { id: 'jewelry-eyewear', labelKey: 'topRankingPage.tabJewelryEyewear' },
    { id: 'consumer-electronics', labelKey: 'topRankingPage.tabConsumerElectronics' },
    { id: 'home-garden', labelKey: 'topRankingPage.tabHomeGarden' },
    { id: 'gifts-crafts', labelKey: 'topRankingPage.tabGiftsCrafts' },
    { id: 'sports-entertainment', labelKey: 'topRankingPage.tabSportsEntertainment' },
  ];
}

export function getRankingMainCategories(): RankingMainCategory[] {
  return [
    {
      id: 'consumer-electronics',
      nameKey: 'topRankingPage.catConsumerElectronics',
      subCategories: [
        { id: 'phones', nameKey: 'topRankingPage.catPhones' },
        { id: 'audio', nameKey: 'topRankingPage.catAudio' },
        { id: 'computers', nameKey: 'topRankingPage.catComputers' },
        { id: 'networking', nameKey: 'topRankingPage.catNetworking' },
      ],
    },
    {
      id: 'jewelry-eyewear',
      nameKey: 'topRankingPage.catJewelryEyewear',
      subCategories: [
        { id: 'bracelets', nameKey: 'topRankingPage.catBracelets' },
        { id: 'brooches', nameKey: 'topRankingPage.catBrooches' },
      ],
    },
    {
      id: 'luggage-bags',
      nameKey: 'topRankingPage.catLuggageBags',
      subCategories: [
        { id: 'caps-hats', nameKey: 'topRankingPage.catCapsHats' },
        { id: 'labels', nameKey: 'topRankingPage.catLabels' },
      ],
    },
    {
      id: 'home-garden',
      nameKey: 'topRankingPage.catHomeGarden',
    },
    {
      id: 'gifts-crafts',
      nameKey: 'topRankingPage.catGiftsCrafts',
      subCategories: [
        { id: 'nails', nameKey: 'topRankingPage.catNails' },
        { id: 'skincare', nameKey: 'topRankingPage.catSkincare' },
      ],
    },
    {
      id: 'sports-entertainment',
      nameKey: 'topRankingPage.catSportsEntertainment',
      subCategories: [
        { id: 'hockey', nameKey: 'topRankingPage.catHockey' },
      ],
    },
  ];
}

export function getMockRankingGroups(): RankingCategoryGroup[] {
  return [
    // Consumer Electronics
    {
      id: 'rg-1',
      name: 'Gaming Mobile Phones',
      nameKey: 'topRankingPage.groupGamingPhones',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-1', name: '5G Gaming Smartphone 12GB RAM', href: '/pages/product-detail.html', price: '$189.00', imageSrc: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 1 },
        { id: 'rp-2', name: 'Pro Gaming Phone 144Hz Display', href: '/pages/product-detail.html', price: '$245.00', imageSrc: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&q=80', moq: '3 pcs', rank: 2 },
        { id: 'rp-3', name: 'Budget Gaming Phone Octa Core', href: '/pages/product-detail.html', price: '$128.00', imageSrc: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-2',
      name: 'Gaming Speakers',
      nameKey: 'topRankingPage.groupGamingSpeakers',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-4', name: 'RGB Gaming Speaker 2.1 System', href: '/pages/product-detail.html', price: '$32.50', imageSrc: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 1 },
        { id: 'rp-5', name: 'Portable Gaming Bluetooth Speaker', href: '/pages/product-detail.html', price: '$18.90', imageSrc: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80', moq: '20 pcs', rank: 2 },
        { id: 'rp-6', name: 'Surround Sound Gaming Soundbar', href: '/pages/product-detail.html', price: '$45.00', imageSrc: 'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-3',
      name: 'Electronic Signs',
      nameKey: 'topRankingPage.groupElectronicSigns',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-7', name: 'LED Neon Sign Custom Logo', href: '/pages/product-detail.html', price: '$15.80', imageSrc: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&q=80', moq: '1 pcs', rank: 1 },
        { id: 'rp-8', name: 'Digital Menu Board Display', href: '/pages/product-detail.html', price: '$89.00', imageSrc: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=400&fit=crop&q=80', moq: '2 pcs', rank: 2 },
        { id: 'rp-9', name: 'Outdoor LED Advertising Panel', href: '/pages/product-detail.html', price: '$120.00', imageSrc: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&h=400&fit=crop&q=80', moq: '1 pcs', rank: 3 },
      ],
    },
    // Jewelry & Eyewear
    {
      id: 'rg-4',
      name: 'Fashion Charm Bracelets',
      nameKey: 'topRankingPage.groupCharmBracelets',
      categoryId: 'jewelry-eyewear',
      products: [
        { id: 'rp-10', name: 'Sterling Silver Charm Bracelet', href: '/pages/product-detail.html', price: '$2.80', imageSrc: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 1 },
        { id: 'rp-11', name: 'Gold Plated Beaded Bracelet', href: '/pages/product-detail.html', price: '$1.95', imageSrc: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&q=80', moq: '100 pcs', rank: 2 },
        { id: 'rp-12', name: 'Crystal Charm Bangle Set', href: '/pages/product-detail.html', price: '$3.50', imageSrc: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&q=80', moq: '30 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-5',
      name: 'Fashion Brooches',
      nameKey: 'topRankingPage.groupBrooches',
      categoryId: 'jewelry-eyewear',
      products: [
        { id: 'rp-13', name: 'Crystal Flower Brooch Pin', href: '/pages/product-detail.html', price: '$1.20', imageSrc: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=400&h=400&fit=crop&q=80', moq: '100 pcs', rank: 1 },
        { id: 'rp-14', name: 'Pearl Vintage Brooch', href: '/pages/product-detail.html', price: '$0.85', imageSrc: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&q=80', moq: '200 pcs', rank: 2 },
        { id: 'rp-15', name: 'Enamel Animal Pin Badge', href: '/pages/product-detail.html', price: '$0.65', imageSrc: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&q=80', moq: '500 pcs', rank: 3 },
      ],
    },
    // Luggage, Bags & Cases
    {
      id: 'rg-6',
      name: 'Packaging Labels',
      nameKey: 'topRankingPage.groupPackagingLabels',
      categoryId: 'luggage-bags',
      products: [
        { id: 'rp-16', name: 'Custom Woven Label Tags', href: '/pages/product-detail.html', price: '$0.05', imageSrc: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop&q=80', moq: '1000 pcs', rank: 1 },
        { id: 'rp-17', name: 'Printed Satin Care Labels', href: '/pages/product-detail.html', price: '$0.03', imageSrc: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&h=400&fit=crop&q=80', moq: '2000 pcs', rank: 2 },
        { id: 'rp-18', name: 'Heat Transfer Label Rolls', href: '/pages/product-detail.html', price: '$0.08', imageSrc: 'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=400&fit=crop&q=80', moq: '500 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-7',
      name: 'Baseball Caps',
      nameKey: 'topRankingPage.groupBaseballCaps',
      categoryId: 'luggage-bags',
      products: [
        { id: 'rp-19', name: 'Custom Embroidered Baseball Cap', href: '/pages/product-detail.html', price: '$2.50', imageSrc: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 1 },
        { id: 'rp-20', name: 'Vintage Washed Dad Hat', href: '/pages/product-detail.html', price: '$1.80', imageSrc: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop&q=80', moq: '100 pcs', rank: 2 },
        { id: 'rp-21', name: 'Snapback Trucker Mesh Cap', href: '/pages/product-detail.html', price: '$1.50', imageSrc: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop&q=80', moq: '100 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-8',
      name: 'Garment Labels',
      nameKey: 'topRankingPage.groupGarmentLabels',
      categoryId: 'luggage-bags',
      products: [
        { id: 'rp-22', name: 'Woven Brand Labels Damask', href: '/pages/product-detail.html', price: '$0.04', imageSrc: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=400&fit=crop&q=80', moq: '1000 pcs', rank: 1 },
        { id: 'rp-23', name: 'PU Leather Patch Labels', href: '/pages/product-detail.html', price: '$0.12', imageSrc: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop&q=80', moq: '500 pcs', rank: 2 },
        { id: 'rp-24', name: 'Rubber Silicone Logo Labels', href: '/pages/product-detail.html', price: '$0.08', imageSrc: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&h=400&fit=crop&q=80', moq: '500 pcs', rank: 3 },
      ],
    },
    // Sports & Entertainment
    {
      id: 'rg-9',
      name: 'Ice Hockey & Field Hockey',
      nameKey: 'topRankingPage.groupHockey',
      categoryId: 'sports-entertainment',
      products: [
        { id: 'rp-25', name: 'Composite Ice Hockey Stick', href: '/pages/product-detail.html', price: '$12.50', imageSrc: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 1 },
        { id: 'rp-26', name: 'Field Hockey Training Ball Set', href: '/pages/product-detail.html', price: '$3.20', imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 2 },
        { id: 'rp-27', name: 'Hockey Goalkeeper Gloves', href: '/pages/product-detail.html', price: '$8.90', imageSrc: 'https://images.unsplash.com/photo-1461896836934-bd45ba8bfb5f?w=400&h=400&fit=crop&q=80', moq: '20 pcs', rank: 3 },
      ],
    },
    // Home & Garden
    {
      id: 'rg-10',
      name: 'LED Tail Lights',
      nameKey: 'topRankingPage.groupLedTailLights',
      categoryId: 'home-garden',
      products: [
        { id: 'rp-28', name: 'Universal LED Tail Light Bar', href: '/pages/product-detail.html', price: '$8.50', imageSrc: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 1 },
        { id: 'rp-29', name: 'Amber Turn Signal LED Strip', href: '/pages/product-detail.html', price: '$3.20', imageSrc: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop&q=80', moq: '20 pcs', rank: 2 },
        { id: 'rp-30', name: 'Round LED Marker Light 12V', href: '/pages/product-detail.html', price: '$1.50', imageSrc: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-11',
      name: 'Home Theater Systems',
      nameKey: 'topRankingPage.groupHomeTheater',
      categoryId: 'home-garden',
      products: [
        { id: 'rp-31', name: '5.1 Surround Sound System', href: '/pages/product-detail.html', price: '$85.00', imageSrc: 'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=400&h=400&fit=crop&q=80', moq: '2 pcs', rank: 1 },
        { id: 'rp-32', name: 'Wireless Soundbar with Sub', href: '/pages/product-detail.html', price: '$42.00', imageSrc: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 2 },
        { id: 'rp-33', name: 'Bluetooth Home Theater Speaker', href: '/pages/product-detail.html', price: '$28.50', imageSrc: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 3 },
      ],
    },
    // Gifts & Crafts
    {
      id: 'rg-12',
      name: 'Artificial Fingernails',
      nameKey: 'topRankingPage.groupFingernails',
      categoryId: 'gifts-crafts',
      products: [
        { id: 'rp-34', name: 'Press On Nails Set Glossy', href: '/pages/product-detail.html', price: '$1.20', imageSrc: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&q=80', moq: '100 sets', rank: 1 },
        { id: 'rp-35', name: 'French Tip Gel Nail Kit', href: '/pages/product-detail.html', price: '$2.50', imageSrc: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80', moq: '50 sets', rank: 2 },
        { id: 'rp-36', name: 'Coffin Shape Acrylic Nails', href: '/pages/product-detail.html', price: '$0.80', imageSrc: 'https://images.unsplash.com/photo-1513364776144-60967b0f800c?w=400&h=400&fit=crop&q=80', moq: '200 sets', rank: 3 },
      ],
    },
    {
      id: 'rg-13',
      name: 'Skin Care Serum',
      nameKey: 'topRankingPage.groupSkinCareSerum',
      categoryId: 'gifts-crafts',
      products: [
        { id: 'rp-37', name: 'Vitamin C Brightening Serum', href: '/pages/product-detail.html', price: '$1.80', imageSrc: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80', moq: '100 pcs', rank: 1 },
        { id: 'rp-38', name: 'Hyaluronic Acid Moisturizing', href: '/pages/product-detail.html', price: '$2.30', imageSrc: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 2 },
        { id: 'rp-39', name: 'Retinol Anti-Aging Face Serum', href: '/pages/product-detail.html', price: '$3.50', imageSrc: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop&q=80', moq: '30 pcs', rank: 3 },
      ],
    },
    // More Consumer Electronics
    {
      id: 'rg-14',
      name: 'Mini PCs',
      nameKey: 'topRankingPage.groupMiniPCs',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-40', name: 'Mini PC Intel N100 16GB', href: '/pages/product-detail.html', price: '$125.00', imageSrc: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=400&fit=crop&q=80', moq: '2 pcs', rank: 1 },
        { id: 'rp-41', name: 'Stick PC Windows 11 4GB', href: '/pages/product-detail.html', price: '$68.00', imageSrc: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 2 },
        { id: 'rp-42', name: 'Fanless Desktop Mini Computer', href: '/pages/product-detail.html', price: '$95.00', imageSrc: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=400&fit=crop&q=80', moq: '3 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-15',
      name: 'Student Laptops',
      nameKey: 'topRankingPage.groupStudentLaptops',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-43', name: '14" Student Laptop 8GB RAM', href: '/pages/product-detail.html', price: '$185.00', imageSrc: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80', moq: '2 pcs', rank: 1 },
        { id: 'rp-44', name: 'Chromebook 11.6" Education', href: '/pages/product-detail.html', price: '$135.00', imageSrc: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 2 },
        { id: 'rp-45', name: 'Refurbished Business Laptop', href: '/pages/product-detail.html', price: '$210.00', imageSrc: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&q=80', moq: '3 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-16',
      name: 'Routers',
      nameKey: 'topRankingPage.groupRouters',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-46', name: 'WiFi 6 Dual Band Router', href: '/pages/product-detail.html', price: '$18.50', imageSrc: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 1 },
        { id: 'rp-47', name: 'Mesh WiFi System 3-Pack', href: '/pages/product-detail.html', price: '$45.00', imageSrc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop&q=80', moq: '5 pcs', rank: 2 },
        { id: 'rp-48', name: '4G LTE Wireless Router', href: '/pages/product-detail.html', price: '$22.00', imageSrc: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 3 },
      ],
    },
    {
      id: 'rg-17',
      name: 'Power Banks',
      nameKey: 'topRankingPage.groupPowerBanks',
      categoryId: 'consumer-electronics',
      products: [
        { id: 'rp-49', name: '20000mAh PD Fast Charge', href: '/pages/product-detail.html', price: '$6.80', imageSrc: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop&q=80', moq: '20 pcs', rank: 1 },
        { id: 'rp-50', name: 'Solar Power Bank 30000mAh', href: '/pages/product-detail.html', price: '$9.50', imageSrc: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 2 },
        { id: 'rp-51', name: 'Slim Wireless Charging Bank', href: '/pages/product-detail.html', price: '$8.20', imageSrc: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop&q=80', moq: '15 pcs', rank: 3 },
      ],
    },
    // Medical / Home
    {
      id: 'rg-18',
      name: 'Medical Instruments',
      nameKey: 'topRankingPage.groupMedicalInstruments',
      categoryId: 'home-garden',
      products: [
        { id: 'rp-52', name: 'Digital Blood Pressure Monitor', href: '/pages/product-detail.html', price: '$8.90', imageSrc: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&q=80', moq: '10 pcs', rank: 1 },
        { id: 'rp-53', name: 'Infrared Ear Thermometer', href: '/pages/product-detail.html', price: '$4.50', imageSrc: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop&q=80', moq: '20 pcs', rank: 2 },
        { id: 'rp-54', name: 'Pulse Oximeter Fingertip', href: '/pages/product-detail.html', price: '$2.80', imageSrc: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop&q=80', moq: '50 pcs', rank: 3 },
      ],
    },
  ];
}
