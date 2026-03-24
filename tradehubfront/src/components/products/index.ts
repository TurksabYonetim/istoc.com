/**
 * Products Components Barrel Export
 * Re-exports all products page components for easier importing
 */

// FilterSidebar component - Alibaba-style filter panel with multiple filter types
export { FilterSidebar, initFilterSidebar, getDefaultFilterSections } from './FilterSidebar';

// ProductListingGrid component - responsive product grid with image slider
export { ProductListingGrid, initProductListingGrid, initProductSliders, renderProductListingCard, renderNoResults, rerenderProductGrid, setGridViewMode } from './ProductListingGrid';

// ListingCartDrawer - simplified cart drawer for products listing page
export { ListingCartDrawer, initListingCartDrawer } from './ListingCartDrawer';

// SearchHeader component - search results header with sorting and view controls
export { SearchHeader, initSearchHeader, updateSearchHeader } from './SearchHeader';

// Filter engine - connects FilterSidebar UI to ProductListingGrid
export { initFilterEngine } from './filterEngine';
export type { FilterState, SortKey, FilterEngine, FilterEngineOptions } from './filterEngine';

// FilterChips component - active filter chips with removal
export { renderFilterChips, updateFilterChips, initFilterChips } from './FilterChips';
