/**
 * Mock data for Tailored Selections page
 */

export interface TailoredCategory {
    id: string;
    title: string;
    titleKey: string;
    description: string;
    descriptionKey: string;
    imageSrc: string;
    bgColor: string;
}

export interface TailoredProduct {
    id: string;
    name: string;
    href: string;
    price: string;
    originalPrice?: string;
    discountPercent?: number;
    moqCount: number;
    moqUnit: 'pcs' | 'kg';
    imageSrc: string;
    viewCount?: string;
    soldCount?: string;
    starRating?: number;
    ratingCount?: number;
    lowestPriceTag?: boolean;
    lowerThanSimilar?: boolean;
    bestReviewedLabel?: string;
    customBadge?: boolean;
    verifiedBadge?: boolean;
}

export function getTailoredCategories(): TailoredCategory[] {
    return [
        {
            id: 'drawstring-bags',
            title: 'Drawstring Shopping Bags',
            titleKey: 'tailoredPage.cat.drawstringBags',
            description: 'You have shown interest in drawstring style shopping bags suited to versatile retail items. We reviewed 800+ related items and curated 5k+ top picks...',
            descriptionKey: 'tailoredPage.cat.drawstringBagsDesc',
            imageSrc: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=500&q=80',
            bgColor: '#2a3132', // Dark slate
        },
        {
            id: 'hiking-shoes',
            title: 'All Season Hiking Shoes',
            titleKey: 'tailoredPage.cat.hikingShoes',
            description: 'In Sports & Entertainment, Hiking Shoes thrive; our list weighs price, sales, and channel trends. Insulated yet breathable pairs span cold climbs to hot...',
            descriptionKey: 'tailoredPage.cat.hikingShoesDesc',
            imageSrc: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&h=500&q=80',
            bgColor: '#373224', // Dark olive/brown
        },
        {
            id: 'shoulder-bags',
            title: "Men's Zipper Shoulder Bags",
            titleKey: 'tailoredPage.cat.shoulderBags',
            description: "In the market for men's shoulder bags? We selected 1,000+ top picks with secure zipper closures to match your needs.",
            descriptionKey: 'tailoredPage.cat.shoulderBagsDesc',
            imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&h=500&q=80',
            bgColor: '#1a1f24', // Dark blue/grey
        },
        {
            id: 'phone-cases',
            title: 'Premium Phone Cases',
            titleKey: 'tailoredPage.cat.phoneCases',
            description: 'Protect your devices with our curated selection of phone cases. From slim to rugged, transparent to designer — 3,000+ options reviewed.',
            descriptionKey: 'tailoredPage.cat.phoneCasesDesc',
            imageSrc: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&h=500&q=80',
            bgColor: '#1F1A1B', // Dark charcoal/brown
        },
        {
            id: 'tactical-gear',
            title: 'Tactical & Outdoor Gear',
            titleKey: 'tailoredPage.cat.tacticalGear',
            description: 'Military-grade tactical gear and outdoor equipment. We analyzed 2,500+ products across durability, price point, and buyer reviews.',
            descriptionKey: 'tailoredPage.cat.tacticalGearDesc',
            imageSrc: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?auto=format&fit=crop&w=800&h=500&q=80',
            bgColor: '#2c3325', // Dark green
        },
    ];
}

export function getTailoredProducts(): TailoredProduct[] {
    return [
        {
            id: 'tp-1',
            name: 'Wholesale Latest Design Combat Training Shoes Men\'s Outdoor Sports Shoes Wear...',
            href: '/pages/product-detail.html',
            price: '$15.65',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=600&q=80',
            soldCount: '30+',
            viewCount: '85+',
            bestReviewedLabel: '#12 Best reviewed in Hiking Shoes',
            starRating: 4.5,
            ratingCount: 19,
        },
        {
            id: 'tp-2',
            name: 'Wholesale Men\'s shoes women\'s shoes Safety Work Women Boots Comfortable...',
            href: '/pages/product-detail.html',
            price: '$18.35-19.56',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '360+',
        },
        {
            id: 'tp-3',
            name: 'ESDY Men\'s Vintage Style Winter Tactical Training Boots Cow Leather Uppe...',
            href: '/pages/product-detail.html',
            price: '$24.72-28.80',
            originalPrice: '$30.90',
            discountPercent: 20,
            moqCount: 3,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&h=600&q=80',
            lowestPriceTag: true,
            viewCount: '390+',
            verifiedBadge: true,
        },
        {
            id: 'tp-4',
            name: 'Outdoor Wear Resistant Breathable Green Climbing Assault Combat Boots Men\'s...',
            href: '/pages/product-detail.html',
            price: '$15.88-17.46',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            viewCount: '90+',
        },
        {
            id: 'tp-5',
            name: 'Speedgoat Mid 2 Gore-Tex Trail Sneakers Breathable Tactical Sports Shoes Hiking...',
            href: '/pages/product-detail.html',
            price: '$82.00',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '100+',
        },
        {
            id: 'tp-6',
            name: 'New High Top Hiking Shoes Men Waterproof Best Price Anti-slip Popular...',
            href: '/pages/product-detail.html',
            price: '$13.99',
            originalPrice: '$15.80',
            discountPercent: 11,
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            verifiedBadge: true,
        },
        {
            id: 'tp-7',
            name: 'Wholesale Men\'s High Top Outdoor Tactical Boots Waterproof Hiking Shoes...',
            href: '/pages/product-detail.html',
            price: '$10.89-11.55',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '15+',
        },
        {
            id: 'tp-8',
            name: 'Autumn Winter Men\'s High-Top Thick-Soled for Boots Imitation Pigskin Fabric...',
            href: '/pages/product-detail.html',
            price: '$13-14',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            viewCount: '70+',
        },
        {
            id: 'tp-9',
            name: 'Stylish winter Men\'s Desert Boots Hot Sale High Quality Anti Slippery Hiking Shoes...',
            href: '/pages/product-detail.html',
            price: '$16.88-17.85',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            viewCount: '120+',
        },
        {
            id: 'tp-10',
            name: 'Russia\'s Hot Sale Classic Style Leather Tactical Training Boots Waterproo...',
            href: '/pages/product-detail.html',
            price: '$12.64-16.72',
            originalPrice: '$15.80-20.90',
            discountPercent: 20,
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&h=600&q=80',
            lowestPriceTag: true,
            verifiedBadge: true,
            starRating: 4.7,
            ratingCount: 70,
            soldCount: '70+',
        },
        {
            id: 'tp-11',
            name: 'Unisex Mid Cut Tactical Hiking Boots Durable Rubber Outsole Factory...',
            href: '/pages/product-detail.html',
            price: '$17.48-26.68',
            originalPrice: '$19.82',
            discountPercent: 15,
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&h=600&q=80',
            bestReviewedLabel: '#13 Hot selling in Hiking Shoes',
            soldCount: '30+',
            viewCount: '60+',
            customBadge: true,
        },
        {
            id: 'tp-12',
            name: 'Factory Direct Good Quality Cross-border Wear Resistant Plus-size Outdoor Hikin...',
            href: '/pages/product-detail.html',
            price: '$13.90-14.90',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&h=600&q=80',
            bestReviewedLabel: '#2 Best reviewed in Hiking Shoes',
            starRating: 4.4,
            ratingCount: 40,
            soldCount: '40+',
        },
        {
            id: 'tp-13',
            name: 'Anti-Slippery Women Men Boots Climbing Outdoor Hiking Work Safety Shoes High...',
            href: '/pages/product-detail.html',
            price: '$15-55',
            moqCount: 500,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '90+',
        },
        {
            id: 'tp-14',
            name: 'A2020 Customized Tactical High Top Hiking Boots Waterproof Design for All...',
            href: '/pages/product-detail.html',
            price: '$14.88',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=600&q=80',
            lowestPriceTag: true,
            viewCount: '700+',
        },
        {
            id: 'tp-15',
            name: 'HUMTTO 360572 Men\'s New Fashion Waterproof Breathable Slip-on Casual...',
            href: '/pages/product-detail.html',
            price: '$76.87-82.71',
            moqCount: 2,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            starRating: 4.7,
            ratingCount: 70,
            soldCount: '70+',
        },
        {
            id: 'tp-16',
            name: 'Short Waterproof Breathable Fishing Boots Neoprene Rubber Farm Yard Garden Chor...',
            href: '/pages/product-detail.html',
            price: '$11.50-13',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=600&h=600&q=80',
        },
        {
            id: 'tp-17',
            name: '2021 New Men\'s Shoes Outdoor Snow Cotton Shoes',
            href: '/pages/product-detail.html',
            price: '$15.90-20',
            moqCount: 500,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '60+',
        },
        {
            id: 'tp-18',
            name: 'Fila Men\'s Hiking Boots Waterproof Breathable Round Toe Rubber Outsole P...',
            href: '/pages/product-detail.html',
            price: '$46.10',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&h=600&q=80',
            lowerThanSimilar: true,
            soldCount: '30+',
            viewCount: '70+',
        },
        {
            id: 'tp-19',
            name: 'Stock Slip Resistant All Season Versatile Reliable Highland TacticalBoots Mountai...',
            href: '/pages/product-detail.html',
            price: '$12.80-21.64',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '30+',
        },
        {
            id: 'tp-20',
            name: 'Outdoor 100% Leather Waterproof Hiking Trekking Shoes',
            href: '/pages/product-detail.html',
            price: '$80-100',
            moqCount: 1,
            moqUnit: 'pcs',
            imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=600&q=80',
            viewCount: '270+',
        },
    ];
}
