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
