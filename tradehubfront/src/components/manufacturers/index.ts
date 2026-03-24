import { ManufacturersHero } from './ManufacturersHero'
import { HorizontalCategoryBar } from './HorizontalCategoryBar'
import { ManufacturerList } from './ManufacturerList'

export function ManufacturersLayout(): string {
  return `
    <div class="container-boxed pt-4">
      <!-- 1) Top Hero Section -->
      ${ManufacturersHero()}

      <!-- 2) Horizontal Category Bar -->
      ${HorizontalCategoryBar()}

      <!-- 3) Manufacturer List -->
      ${ManufacturerList()}
    </div>
  `;
}

export { initHorizontalCategoryBar } from './HorizontalCategoryBar';
export { initCategoryFlyout } from './ManufacturersHero';
export { initFactorySliders } from './ManufacturerList';
