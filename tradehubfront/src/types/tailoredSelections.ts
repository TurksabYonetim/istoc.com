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
