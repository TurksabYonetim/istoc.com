import { t } from '../../i18n';
import { getBrowsingHistory } from '../../services/browsingHistoryService';

interface SubcategoryGroup {
  title: string;
  items: string[];
}

interface SourceCategory {
  id: string;
  label: string;
  icon: string; // SVG string
  subcategoryGroups: SubcategoryGroup[];
}

function getSourceCategories(): SourceCategory[] {
  return [
    {
      id: 'valiz-canta',
      label: t('mfr.cat.luggageBagsCases'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.womenBags'),
          items: [
            t('mfr.item.handbags'),
            t('mfr.item.womenDrawstringBags'),
            t('mfr.item.womenCrossbodyBags'),
            t('mfr.item.womenCanvasBags'),
            t('mfr.item.womenSaddleShoulderBags'),
            t('mfr.item.womenClutchBags'),
          ],
        },
        {
          title: t('mfr.subcat.menBags'),
          items: [
            t('mfr.item.menMessengerBags'),
            t('mfr.item.menHandbags'),
            t('mfr.item.briefcases'),
            t('mfr.item.menChestBags'),
            t('mfr.item.menBackpacks'),
            t('mfr.item.menShoulderBags'),
          ],
        },
        {
          title: t('mfr.subcat.walletsCardHolders'),
          items: [
            t('mfr.item.lipstickBags'),
            t('mfr.item.certificateBags'),
            t('mfr.item.coinPurses'),
            t('mfr.item.wallets'),
            t('mfr.item.moneyClips'),
            t('mfr.item.keychainWallets'),
          ],
        },
        {
          title: t('mfr.subcat.specialPurposeBagsCases'),
          items: [
            t('mfr.item.petBags'),
            t('mfr.item.fireproofBag'),
            t('mfr.item.digitalEquipmentCameraBags'),
            t('mfr.item.businessBagsCases'),
            t('mfr.item.garmentBags'),
            t('mfr.item.phoneCases'),
          ],
        },
        {
          title: t('mfr.subcat.luggageTravelBags'),
          items: [
            t('mfr.item.travelBags'),
            t('mfr.item.sportsBags'),
            t('mfr.item.luggageCarts'),
            t('mfr.item.luggage'),
          ],
        },
        {
          title: t('mfr.subcat.waistBags'),
          items: [],
        },
      ],
    },
    {
      id: 'spor-giyim',
      label: t('mfr.cat.sportswearOutdoor'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.sportswear'),
          items: [
            t('mfr.item.runningClothes'),
            t('mfr.item.tracksuits'),
            t('mfr.item.sportsLeggings'),
            t('mfr.item.fitnessTshirts'),
            t('mfr.item.sportsBras'),
            t('mfr.item.swimwear'),
          ],
        },
        {
          title: t('mfr.subcat.outdoorClothing'),
          items: [
            t('mfr.item.windbreakers'),
            t('mfr.item.skiJackets'),
            t('mfr.item.raincoats'),
            t('mfr.item.softshellJackets'),
            t('mfr.item.thermalUnderwear'),
            t('mfr.item.fleeceJackets'),
          ],
        },
        {
          title: t('mfr.subcat.sportsAccessories'),
          items: [
            t('mfr.item.sportsSocks'),
            t('mfr.item.headbands'),
            t('mfr.item.wristbands'),
            t('mfr.item.sportsBagsAcc'),
            t('mfr.item.waterBottles'),
            t('mfr.item.towels'),
          ],
        },
      ],
    },
    {
      id: 'elektronik',
      label: t('mfr.cat.personalElectronics'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.smartWatchesBracelets'),
          items: [
            t('mfr.item.smartWatches'),
            t('mfr.item.fitnessBracelets'),
            t('mfr.item.watchBands'),
            t('mfr.item.chargingCables'),
          ],
        },
        {
          title: t('mfr.subcat.headphones'),
          items: [
            t('mfr.item.wirelessHeadphones'),
            t('mfr.item.bluetoothHeadphones'),
            t('mfr.item.gamingHeadphones'),
            t('mfr.item.inEarHeadphones'),
          ],
        },
        {
          title: t('mfr.subcat.portableElectronics'),
          items: [
            t('mfr.item.powerbank'),
            t('mfr.item.bluetoothSpeakers'),
            t('mfr.item.actionCameras'),
            t('mfr.item.portableFans'),
          ],
        },
      ],
    },
    {
      id: 'taki-gozluk',
      label: t('mfr.cat.jewelryEyewearWatches'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.jewelry'),
          items: [
            t('mfr.item.rings'),
            t('mfr.item.necklaces'),
            t('mfr.item.earrings'),
            t('mfr.item.bracelets'),
            t('mfr.item.brooches'),
            t('mfr.item.jewelrySets'),
          ],
        },
        {
          title: t('mfr.subcat.eyewear'),
          items: [
            t('mfr.item.sunglasses'),
            t('mfr.item.opticalFrames'),
            t('mfr.item.sportsGlasses'),
            t('mfr.item.eyewearAccessories'),
          ],
        },
        {
          title: t('mfr.subcat.watches'),
          items: [
            t('mfr.item.wristwatches'),
            t('mfr.item.pocketWatches'),
            t('mfr.item.watchBoxes'),
            t('mfr.item.watchMechanisms'),
          ],
        },
      ],
    },
    {
      id: 'ayakkabi',
      label: t('mfr.cat.shoesAccessories'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 18H2a1 1 0 01-1-1v-1c0-1.5 1-2.5 2-3l3-1 5-6h2l2 4 3 1c1 .5 2 1.5 2 3v2a1 1 0 01-1 1z"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.womenShoes'),
          items: [
            t('mfr.item.heels'),
            t('mfr.item.balletFlats'),
            t('mfr.item.womenBoots'),
            t('mfr.item.womenSneakers'),
            t('mfr.item.sandals'),
            t('mfr.item.slippers'),
          ],
        },
        {
          title: t('mfr.subcat.menShoes'),
          items: [
            t('mfr.item.menDressShoes'),
            t('mfr.item.menSneakers'),
            t('mfr.item.menBoots'),
            t('mfr.item.loafers'),
            t('mfr.item.menSandals'),
          ],
        },
        {
          title: t('mfr.subcat.shoeAccessories'),
          items: [
            t('mfr.item.insoles'),
            t('mfr.item.shoeCareProducts'),
            t('mfr.item.laces'),
            t('mfr.item.shoeTrees'),
          ],
        },
      ],
    },
    {
      id: 'anne-cocuk',
      label: t('mfr.cat.motherChildToys'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 8c-3 0-6 1.5-6 4v1h12v-1c0-2.5-3-4-6-4z"/><path d="M5 13H3a1 1 0 00-1 1v5a1 1 0 001 1h18a1 1 0 001-1v-5a1 1 0 00-1-1h-2"/></svg>`,
      subcategoryGroups: [
        {
          title: t('mfr.subcat.babyProducts'),
          items: [
            t('mfr.item.babyClothes'),
            t('mfr.item.strollers'),
            t('mfr.item.highChairs'),
            t('mfr.item.babyCareProducts'),
            t('mfr.item.nursingProducts'),
          ],
        },
        {
          title: t('mfr.subcat.childrenClothing'),
          items: [
            t('mfr.item.childrenDresses'),
            t('mfr.item.childrenShoes'),
            t('mfr.item.childrenAccessories'),
            t('mfr.item.schoolBags'),
          ],
        },
        {
          title: t('mfr.subcat.toys'),
          items: [
            t('mfr.item.educationalToys'),
            t('mfr.item.plushToys'),
            t('mfr.item.puzzles'),
            t('mfr.item.rcCars'),
            t('mfr.item.blockToys'),
          ],
        },
      ],
    },
    {
      id: 'tum-kategoriler',
      label: t('mfr.allCategories'),
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
      subcategoryGroups: [],
    },
  ];
}

export function ManufacturersHero(): string {
  return `
    <!-- Top Bar for Manufacturers specific promos (optional, like "Accio AI | Quotation") -->
    <div class="hidden xl:flex items-center justify-between mb-4 px-2">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Welcome to iSTOC.com</h2>
      <div class="flex items-center gap-3 xl:gap-6 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        <a href="#" class="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
          <span class="text-lg font-black">▲</span> Accio AI
        </a>
        <span class="text-gray-300 dark:text-gray-600">|</span>
        <a href="/pages/dashboard/rfq.html" class="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Request for Quotation
        </a>
        <span class="text-gray-300 dark:text-gray-600">|</span>
        <a href="#" class="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
          <span class="font-bold text-lg">A</span> Online Trade Show
        </a>
        <span class="text-gray-300 dark:text-gray-600">|</span>
        <a href="#" class="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
          <span class="font-bold italic text-lg">P</span> Prime hub supplies
        </a>
      </div>
    </div>

    <!-- Main Grid: 4 columns (Sidebar) + (Samples/LIVE) + (Top Ranking) + (Profile Box) -->
    <div class="hidden xl:flex flex-row h-[400px] gap-4 mb-4">

      <!-- Column 1: Source by category (Sidebar) -->
      ${renderSourceByCategory()}

      <!-- Column 2: Get samples & Factory LIVE Q&A -->
      ${renderMiddleColumn()}

      <!-- Column 3: Top-ranking manufacturers -->
      ${renderTopRankingColumn()}

      <!-- Column 4: Profile / Guest Panel -->
      ${renderProfileColumn()}

    </div>
  `;
}

const ALL_CATEGORIES_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`;

function renderSubcategoryFlyout(cat: SourceCategory): string {
  const visibleGroups = cat.subcategoryGroups.filter(g => g.items.length > 0);
  if (visibleGroups.length === 0) return '';

  return `
    <div
      class="pointer-events-none opacity-0 translate-x-2
             absolute left-full top-0 z-50 ml-1
             w-[656px] h-full overflow-y-auto
             pt-5 px-5 pb-2.5
             transition-all duration-150 ease-out"
      style="background-color: var(--mfr-flyout-bg, #f4f4f4); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))"
      data-flyout-id="${cat.id}"
      role="region"
      aria-label="${cat.label}"
    >
      <!-- Flyout subcategory grid -- 3 columns -->
      <div class="grid grid-cols-3 gap-x-0 gap-y-1.5">
        ${visibleGroups.map(group => `
          <div class="flex flex-col">
            <p class="text-sm font-bold mb-2.5" style="color: var(--mfr-flyout-heading-color, #111827)">${group.title}</p>
            <ul class="flex flex-col">
              ${group.items.map(item => `
                <li>
                  <a
                    href="#"
                    class="block text-xs hover:text-primary-600 hover:underline leading-5 transition-colors duration-150"
                    style="color: var(--mfr-flyout-link-color, #767676)"
                  >${item}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getAllCategoriesFlyoutRows(): string[][] {
  return [
    [t('mfr.allCat.vehiclePartsAccessories'), t('mfr.allCat.vehicleAccessoriesElectronicsTools'), t('mfr.allCat.vehiclesTransportation')],
    [t('mfr.allCat.industrialMachinery'), t('mfr.allCat.constructionBuildingMachinery')],
    [t('mfr.allCat.personalElectronics'), t('mfr.allCat.homeAppliances')],
    [t('mfr.allCat.clothingAccessories'), t('mfr.allCat.jewelryEyewearWatches')],
    [t('mfr.allCat.lampsLighting'), t('mfr.allCat.constructionRealEstate')],
    [t('mfr.allCat.homeGarden'), t('mfr.allCat.furniture'), t('mfr.allCat.petProducts'), t('mfr.allCat.giftsHobbies')],
    [t('mfr.allCat.cosmetics'), t('mfr.allCat.personalCareHomeCleaning'), t('mfr.allCat.healthServices'), t('mfr.allCat.medicalDevices')],
    [t('mfr.allCat.packagingPrinting'), t('mfr.allCat.schoolOfficeSupplies'), t('mfr.allCat.testEquipment')],
    [t('mfr.allCat.handToolsHardware'), t('mfr.allCat.security'), t('mfr.allCat.occupationalSafety'), t('mfr.allCat.manufacturingServices')],
    [t('mfr.allCat.electricalEquipment'), t('mfr.allCat.electronicPartsTelecom')],
    [t('mfr.allCat.sportsEntertainment'), t('mfr.allCat.motherChildToys'), t('mfr.allCat.sportswearOutdoor')],
    [t('mfr.allCat.luggageBagsCases'), t('mfr.allCat.shoesAccessories')],
    [t('mfr.allCat.metalAlloys'), t('mfr.allCat.chemicals'), t('mfr.allCat.rubberPlastics'), t('mfr.allCat.fabricTextileRawMaterials')],
    [t('mfr.allCat.agriculture'), t('mfr.allCat.foodBeverage')],
    [t('mfr.allCat.commercialEquipmentMachinery')],
    [t('mfr.allCat.renewableEnergy'), t('mfr.allCat.environment')],
    [t('mfr.allCat.powerTransmission'), t('mfr.allCat.materialHandling')],
  ];
}

function renderSourceByCategory(): string {
  const categories = getSourceCategories();
  // Exclude the last "all categories" item -- it's rendered separately below
  const mainCategories = categories.filter(c => c.id !== 'tum-kategoriler');

  return `
    <!-- Sidebar wrapper: position:relative so flyout can be absolutely positioned to the right -->
    <div class="relative flex-1" data-category-sidebar>
      <div class="p-4 flex flex-col h-full" style="background-color: var(--mfr-sidebar-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))">
        <h3 class="text-lg font-bold mb-3" style="color: var(--mfr-sidebar-heading-color, #111827)">
          ${t('mfr.sourceByCategory')}
        </h3>

        <ul class="flex-1 flex flex-col" data-category-list>
          ${mainCategories.map(cat => `
            <li data-category-id="${cat.id}">
              <a
                href="#"
                class="flex items-center justify-between py-0 px-4 h-10 mb-2 rounded-md
                       hover:bg-gray-50 dark:hover:bg-gray-700/50
                       transition-colors duration-150"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    class="w-5 h-5 flex-shrink-0 flex items-center justify-center
                           transition-colors duration-150"
                    style="color: var(--mfr-sidebar-icon-color, #6b7280)"
                  >
                    ${cat.icon}
                  </span>
                  <span class="text-sm font-medium truncate" style="color: var(--mfr-sidebar-text-color, #374151)">
                    ${cat.label}
                  </span>
                </div>

                <!-- Right chevron -->
                <svg
                  class="w-4 h-4 flex-shrink-0 ml-2"
                  style="color: var(--mfr-sidebar-chevron-color, #d1d5db)"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>

              <!-- Flyout panel -- toggled by JS via data-flyout-id / data-category-id -->
              ${renderSubcategoryFlyout(cat)}
            </li>
          `).join('')}

          <!-- All categories -- separated by top border -->
          <li class="mt-1 pt-2 border-t border-gray-100 dark:border-gray-700" data-category-id="tum-kategoriler">
            <a
              href="#"
              data-all-categories
              class="flex items-center justify-between py-0 px-4 h-10 mb-2 rounded-md
                     hover:bg-gray-50 dark:hover:bg-gray-700/50
                     transition-colors duration-150 group"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <span
                  class="w-5 h-5 flex-shrink-0 flex items-center justify-center
                         transition-colors duration-150"
                  style="color: var(--mfr-sidebar-icon-color, #6b7280)"
                >
                  ${ALL_CATEGORIES_ICON}
                </span>
                <span class="text-sm font-semibold truncate" style="color: var(--mfr-sidebar-heading-color, #111827)">
                  ${t('mfr.allCategories')}
                </span>
              </div>
              <svg
                class="w-4 h-4 flex-shrink-0 ml-2"
                style="color: var(--mfr-sidebar-chevron-color, #d1d5db)"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>

            <!-- All categories flyout -->
            <div
              class="pointer-events-none opacity-0 translate-x-2
                     absolute left-full top-0 z-50 ml-1
                     w-[656px] h-full overflow-y-auto
                     pt-5 px-5 pb-2.5
                     transition-all duration-150 ease-out"
              style="background-color: var(--mfr-flyout-bg, #f4f4f4); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))"
              data-flyout-id="tum-kategoriler"
              role="region"
              aria-label="${t('mfr.allCategories')}"
            >
              <div class="flex flex-wrap gap-y-2.5 leading-5">
                ${getAllCategoriesFlyoutRows().map(row => `
                  <div class="w-full flex flex-wrap items-center">
                    ${row.map((cat, i) => `<a href="#" class="text-xs hover:text-primary-600 hover:underline transition-colors" style="color: var(--mfr-flyout-link-color, #222222)">${cat}</a>${i < row.length - 1 ? '<span class="text-xs text-[#999] mx-2">/</span>' : ''}`).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `;
}

function sampleCard(dataVar: string, label: string): string {
  const SKELETON = `<div class="w-full h-full bg-gray-100 animate-pulse rounded"></div>`;
  return `
    <a :href="${dataVar} ? '/pages/product-detail.html?id=' + ${dataVar}.name : '/pages/products.html'" class="block w-[calc(50%-5.5px)] group">
      <div class="w-full h-[105px] overflow-hidden rounded flex items-center justify-center" style="background-color: var(--mfr-sample-img-bg, #f5f5f5)">
        <template x-if="${dataVar} && ${dataVar}.primary_image">
          <img :src="${dataVar}.primary_image" :alt="${dataVar}.title" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </template>
        <template x-if="!${dataVar}">${SKELETON}</template>
      </div>
      <p class="w-full h-8 min-h-[32px] mt-1 text-sm leading-4 text-center overflow-hidden text-ellipsis" style="color: var(--mfr-sample-label-color, #666666)">${label}</p>
    </a>`;
}

function renderMiddleColumn(): string {
  return `
    <div class="flex-1 flex flex-col h-[400px]"
      x-data="{
        popular: null, newArrival: null, bestSeller: null, featured: null,
        async init() {
          const base = (window.API_BASE || '/api') + '/method/tradehub_core.api.listing.get_listings';
          const opts = { credentials: 'omit' };
          try {
            const [a, b, c, d] = await Promise.all([
              fetch(base + '?sort_by=view_count&sort_order=desc&page_size=1', opts).then(r => r.json()),
              fetch(base + '?is_new_arrival=true&page_size=1', opts).then(r => r.json()),
              fetch(base + '?is_best_seller=true&page_size=1', opts).then(r => r.json()),
              fetch(base + '?is_featured=true&page_size=1', opts).then(r => r.json()),
            ]);
            const first = (r) => (r.message?.data || [])[0] || null;
            this.popular = first(a);
            this.newArrival = first(b);
            this.bestSeller = first(c);
            this.featured = first(d);
          } catch(e) { console.error('Samples fetch failed', e); }
        }
      }"
    >
      <!-- Card A: Get samples -->
      <div class="h-[192px] mb-4 p-4" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))">
        <h3 class="text-lg font-bold leading-6 mb-2.5" style="color: var(--mfr-sample-heading-color, #222222)">${t('mfr.getSamples')}</h3>
        <div class="flex flex-wrap justify-between">
          ${sampleCard('popular', t('mfr.popularProducts'))}
          ${sampleCard('newArrival', t('mfr.newArrivals'))}
        </div>
      </div>

      <!-- Card B: Get samples (2) -->
      <div class="h-[192px] p-4" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))">
        <h3 class="text-lg font-bold leading-6 mb-2.5" style="color: var(--mfr-sample-heading-color, #222222)">${t('mfr.getSamples')}</h3>
        <div class="flex flex-wrap justify-between">
          ${sampleCard('bestSeller', t('mfr.bestSellers'))}
          ${sampleCard('featured', t('mfr.campaigns'))}
        </div>
      </div>
    </div>
  `;
}

function renderTopRankingColumn(): string {
  return `
    <div class="top-ranking flex-1 h-[400px] p-4" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))"
      x-data="{
        sellers: [],
        async init() {
          const api = (window.API_BASE || '/api') + '/method/tradehub_core.api.seller.get_sellers?page_size=4';
          try {
            const res = await fetch(api, { credentials: 'omit' }).then(r => r.json());
            this.sellers = res.message?.sellers || [];
          } catch(e) { console.error('Sellers fetch failed', e); }
        }
      }"
    >
      <h3 class="text-lg font-bold leading-6 mb-4" style="color: var(--mfr-ranking-heading-color, #222222)">${t('mfr.topRankedMfrs')}</h3>
      <div class="products flex flex-wrap justify-between">
        <!-- Loading skeleton -->
        <template x-if="sellers.length === 0">
          <div class="w-full grid grid-cols-2 gap-3">
            <template x-for="i in 4" :key="i"><div class="h-[140px] bg-gray-100 animate-pulse rounded"></div></template>
          </div>
        </template>

        <!-- Seller cards -->
        <template x-for="(seller, idx) in sellers.slice(0, 4)" :key="seller.seller_code">
          <a :href="'/pages/seller/seller-storefront.html?seller=' + seller.seller_code"
             class="block w-[calc(50%-5.5px)] h-[156px] mb-4 group">
            <div class="w-full h-[116px] rounded overflow-hidden flex items-center justify-center bg-gray-50">
              <template x-if="seller.logo">
                <img :src="seller.logo" :alt="seller.seller_name" class="max-w-full max-h-full w-[116px] h-[116px] object-contain group-hover:scale-105 transition-transform duration-300" />
              </template>
              <template x-if="!seller.logo && seller.product_images && seller.product_images.length > 0">
                <img :src="seller.product_images[0]" :alt="seller.seller_name" class="max-w-full max-h-full w-[116px] h-[116px] object-cover group-hover:scale-105 transition-transform duration-300" />
              </template>
              <template x-if="!seller.logo && (!seller.product_images || seller.product_images.length === 0)">
                <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </template>
            </div>
            <p class="w-full h-8 min-h-[32px] mt-1 text-sm leading-4 text-center overflow-hidden text-ellipsis" style="color: var(--mfr-ranking-label-color, #666666)" x-text="seller.seller_name"></p>
          </a>
        </template>
      </div>
    </div>
  `;
}

function renderProfileColumn(): string {
  const history = getBrowsingHistory();
  const thumbs = history.slice(0, 4);

  const historyHtml = thumbs.length > 0
    ? thumbs.map(h => `
        <a href="${h.href}" class="aspect-square rounded-md overflow-hidden group" title="${h.title || ''}">
          <img src="${h.image}" alt="${h.title || ''}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
        </a>`).join('')
    : `<p class="text-xs text-gray-400 col-span-4">${t('mfr.noHistory')}</p>`;

  return `
    <div class="flex-1 h-[400px] overflow-hidden flex flex-col" style="border-radius: var(--mfr-hero-card-radius, 6px)">

      <!-- Top card: user-info (Alpine — async session check) -->
      <div class="h-[268px] mb-4 py-3 px-4 flex flex-col" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))"
        x-data="{
          loggedIn: false,
          userName: 'Guest',
          async init() {
            const api = (window.API_BASE || '/api') + '/method/tradehub_core.api.v1.auth.get_session_user';
            try {
              const res = await fetch(api, { credentials: 'include' }).then(r => r.json());
              if (res.message?.logged_in && res.message.user) {
                this.loggedIn = true;
                this.userName = res.message.user.full_name || res.message.user.email;
              }
            } catch(e) {}
          }
        }"
      >
        <!-- Avatar row -->
        <div class="flex items-center h-[42px] mb-3">
          <div class="w-10 h-10 rounded-full border mr-3 flex items-center justify-center text-gray-400 flex-shrink-0" style="background-color: var(--mfr-profile-avatar-bg, #dddddd); border-color: var(--mfr-profile-avatar-bg, #dddddd)">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
          </div>
          <div>
            <template x-if="loggedIn">
              <div>
                <span class="text-xs" style="color: var(--mfr-profile-text-color, #222222)">${t('mfr.welcome')}</span>
                <p class="text-base font-bold leading-6" style="color: var(--mfr-profile-text-color, #222222)" x-text="userName"></p>
              </div>
            </template>
            <template x-if="!loggedIn">
              <div>
                <span class="text-xs" style="color: var(--mfr-profile-text-color, #222222)">${t('mfr.welcome')}</span>
                <p class="text-base font-bold leading-6" style="color: var(--mfr-profile-text-color, #222222)">Guest</p>
              </div>
            </template>
          </div>
        </div>

        <!-- Logged-in: favorites stats -->
        <template x-if="loggedIn">
          <div class="flex items-center justify-center rounded-md p-3 mt-4 mb-4 bg-gray-50 border border-transparent">
            <div class="flex-1 text-center border-r border-gray-200">
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-xl font-bold">0</span>
                <span class="text-xs text-left leading-tight text-gray-600">Favorite<br/>products</span>
              </div>
            </div>
            <div class="flex-1 text-center">
              <div class="flex items-center justify-center gap-1.5 ml-2">
                <span class="text-xl font-bold">0</span>
                <span class="text-xs text-left leading-tight text-gray-600">Favorite<br/>suppliers</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Logged-out: sign in / register buttons -->
        <template x-if="!loggedIn">
          <div class="flex justify-between mt-6 mb-4">
            <a href="/pages/auth/login.html" class="w-[calc(50%-4px)] flex items-center justify-center rounded-full h-10 text-xs font-bold transition-colors" style="background-color: var(--mfr-profile-btn-bg, #cc9900); color: var(--mfr-profile-btn-text, #ffffff)">${t('auth.login.submit')}</a>
            <a href="/pages/auth/register.html" class="w-[calc(50%-4px)] flex items-center justify-center rounded-full h-10 text-xs font-bold transition-colors" style="background-color: var(--mfr-profile-btn-bg, #cc9900); color: var(--mfr-profile-btn-text, #ffffff)">${t('auth.register.freeSignUp')}</a>
          </div>
        </template>

        <!-- Browsing history from localStorage -->
        <div class="mt-auto">
          <p class="block text-base font-bold mb-2 leading-6" style="color: var(--mfr-profile-text-color, #222222)">${t('mfr.yourSearchHistory')}</p>
          <div class="grid grid-cols-4 gap-2">${historyHtml}</div>
        </div>
      </div>

      <!-- Bottom card: RFQ -->
      <div class="flex-1 py-3 px-4 flex flex-col items-center justify-center text-center" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-radius: var(--mfr-hero-card-radius, 6px); box-shadow: var(--mfr-hero-card-shadow, 0 0 12px rgba(0,0,0,0.05))">
        <p class="text-xs font-semibold mb-4" style="color: var(--mfr-profile-rfq-text, #222222)">${t('mfr.oneRequestMultipleQuotes')}</p>
        <a href="/pages/dashboard/rfq.html" class="hover-expand-center w-full h-10 flex items-center justify-center border rounded-full text-xs font-bold transition-colors" style="background-color: var(--mfr-hero-card-bg, #ffffff); border-color: var(--mfr-profile-rfq-border, #222222); color: var(--mfr-profile-rfq-text, #222222)">
          ${t('mfr.rfqTitle')}
        </a>
      </div>

    </div>
  `;
}

export function initCategoryFlyout(): void {
  const sidebar = document.querySelector<HTMLElement>('[data-category-sidebar]');
  if (!sidebar) return;

  const categoryItems = Array.from(
    sidebar.querySelectorAll<HTMLElement>('[data-category-id]')
  );
  const flyoutPanels = Array.from(
    sidebar.querySelectorAll<HTMLElement>('[data-flyout-id]')
  );

  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let activeFlyoutId: string | null = null;

  // -- helpers --

  const ACTIVE_FLYOUT = ['opacity-100', 'pointer-events-auto', 'translate-x-0'];
  const INACTIVE_FLYOUT = ['opacity-0', 'pointer-events-none', 'translate-x-2'];
  const ACTIVE_LI = ['bg-gray-50', 'dark:bg-gray-700/50'];

  function clearHideTimeout(): void {
    if (hideTimeout !== null) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  function deactivateAll(): void {
    flyoutPanels.forEach(panel => {
      panel.classList.remove(...ACTIVE_FLYOUT);
      panel.classList.add(...INACTIVE_FLYOUT);
    });
    categoryItems.forEach(li => li.classList.remove(...ACTIVE_LI));
    activeFlyoutId = null;
  }

  function activateFlyout(categoryId: string): void {
    flyoutPanels.forEach(panel => {
      if (panel.dataset.flyoutId === categoryId) {
        panel.classList.remove(...INACTIVE_FLYOUT);
        panel.classList.add(...ACTIVE_FLYOUT);
      } else {
        panel.classList.remove(...ACTIVE_FLYOUT);
        panel.classList.add(...INACTIVE_FLYOUT);
      }
    });
    categoryItems.forEach(li => {
      if (li.dataset.categoryId === categoryId) {
        li.classList.add(...ACTIVE_LI);
      } else {
        li.classList.remove(...ACTIVE_LI);
      }
    });
    activeFlyoutId = categoryId;
  }

  function scheduleHide(): void {
    hideTimeout = setTimeout(() => {
      deactivateAll();
    }, 150);
  }

  // -- category items: event delegation on sidebar --

  sidebar.addEventListener('mouseenter', (e: MouseEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-category-id]');
    if (!li) return;

    clearHideTimeout();
    const categoryId = li.dataset.categoryId ?? '';

    const hasFlyout = flyoutPanels.some(p => p.dataset.flyoutId === categoryId);
    if (hasFlyout && categoryId !== activeFlyoutId) {
      activateFlyout(categoryId);
    }
  }, true);

  // -- sidebar container: schedule hide when mouse fully leaves --

  sidebar.addEventListener('mouseleave', () => {
    scheduleHide();
  });

  // -- flyout panels: cancel hide while hovering, reschedule on leave --

  flyoutPanels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      clearHideTimeout();
    });
    panel.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        deactivateAll();
      }, 100);
    });
  });

  // -- "All categories" click --

  const allCategoriesLink = sidebar.querySelector<HTMLAnchorElement>('[data-all-categories]');
  allCategoriesLink?.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    window.location.href = '/categories';
  });
}
