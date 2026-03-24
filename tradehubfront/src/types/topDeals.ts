import type { ProductImageKind } from './productListing';

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
