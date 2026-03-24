import { t } from '../../i18n';

function getTabCategories(): string[] {
  return [
    t('mfr.allCategories'),
    t('mfr.cat.luggageBagsCases'),
    t('mfr.cat.sportswearOutdoor'),
    t('mfr.cat.personalElectronics'),
    t('mfr.cat.jewelryEyewearWatches'),
    t('mfr.cat.motherChildToys'),
    t('mfr.cat.shoesAccessories'),
  ];
}

function getAllCategories(): string[] {
  return [
    // Column 1
    t('mfr.allCategories'),
    t('mfr.allCat.jewelryEyewearWatches'),
    t('mfr.allCat.electricalEquipment'),
    t('mfr.allCat.foodBeverage'),
    t('mfr.allCat.chemicals'),
    t('mfr.allCat.medicalDevices'),
    t('mfr.allCat.vehiclePartsAccessories'),
    t('mfr.allCat.cosmetics'),
    t('mfr.allCat.furniture'),
    t('mfr.allCat.materialHandling'),
    t('mfr.allCat.personalCareHomeCleaning'),
    // Column 2
    t('mfr.allCat.luggageBagsCases'),
    t('mfr.allCat.motherChildToys'),
    t('mfr.allCat.packagingPrinting'),
    t('mfr.allCat.clothingAccessories'),
    t('mfr.allCat.metalAlloys'),
    t('mfr.allCat.sportsEntertainment'),
    t('mfr.allCat.lampsLighting'),
    t('mfr.allCat.rubberPlastics'),
    t('mfr.allCat.commercialEquipmentMachinery'),
    t('mfr.allCat.renewableEnergy'),
    t('mfr.allCat.constructionBuildingMachinery'),
    // Column 3
    t('mfr.allCat.sportswearOutdoor'),
    t('mfr.allCat.shoesAccessories'),
    t('mfr.allCat.homeGarden'),
    t('mfr.allCat.fabricTextileRawMaterials'),
    t('mfr.allCat.environment'),
    t('mfr.allCat.schoolOfficeSupplies'),
    t('mfr.allCat.manufacturingServices'),
    t('mfr.allCat.electronicPartsTelecom'),
    t('mfr.allCat.vehiclesTransportation'),
    t('mfr.allCat.occupationalSafety'),
    t('mfr.allCat.petProducts'),
    // Column 4
    t('mfr.allCat.personalElectronics'),
    t('mfr.allCat.giftsHobbies'),
    t('mfr.allCat.agriculture'),
    t('mfr.allCat.homeAppliances'),
    t('mfr.allCat.constructionRealEstate'),
    t('mfr.allCat.security'),
    t('mfr.allCat.industrialMachinery'),
    t('mfr.allCat.handToolsHardware'),
    t('mfr.allCat.powerTransmission'),
    t('mfr.allCat.testEquipment'),
  ];
}

// Column header indices (first item of each column is bold)
const COLUMN_HEADERS = [0, 11, 22, 33];

function getSubTabFilters(): string[] {
  return [
    t('mfr.filter.lowMoqCustomization'),
    t('mfr.filter.sampleCustomization'),
    t('mfr.filter.qualityCertified'),
    t('mfr.filter.smallCustomization'),
  ];
}

function getSubTabMoreFilters(): string[] {
  return [
    t('mfr.filter.lowMoqCustomization'),
    t('mfr.filter.sampleCustomization'),
    t('mfr.filter.qualityCertified'),
    t('mfr.filter.smallCustomization'),
    t('mfr.filter.fullCustomization'),
    t('mfr.filter.highRdCapacity'),
    t('mfr.filter.fortune500Collab'),
  ];
}

export function HorizontalCategoryBar(): string {
  const TAB_CATEGORIES = getTabCategories();
  const ALL_CATEGORIES = getAllCategories();
  const SUB_TAB_FILTERS = getSubTabFilters();
  const SUB_TAB_MORE_FILTERS = getSubTabMoreFilters();

  return `
    <!-- Desktop layout (Category bar) -->
    <div class="hidden lg:block relative bg-white rounded-md mb-8" data-factory-tab-wrapper>

      <!-- Tab Bar -->
      <div class="flex items-center h-[62px] border-b border-[#d8d8d8]">
        <ul class="flex items-center h-full overflow-hidden flex-1 list-none m-0 p-0" data-factory-tab>
          ${TAB_CATEGORIES.map((cat, i) => `
            <li class="whitespace-nowrap cursor-pointer px-5 h-[61px] leading-[61px] text-base transition-colors
                       ${i === 0 ? 'factory-tab-active font-bold text-[#222]' : 'font-normal text-[#222] hover:text-[#666]'}"
                data-tab-index="${i}">
              ${cat}
            </li>
          `).join('')}
        </ul>

        <!-- View more button -->
        <div class="flex-shrink-0 flex items-center h-full px-2">
          <button id="hm-view-more" type="button"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border border-[#d8d8d8] text-sm font-medium text-[#222] hover:border-[#999] transition-colors whitespace-nowrap">
            <span>${t('mfr.viewMore')}</span>
            <svg class="w-3.5 h-3.5 transition-transform duration-200" id="hm-view-more-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- More Content Dropdown (absolutely positioned below tab bar) -->
      <div id="hm-mega-menu" class="hidden absolute left-0 right-0 top-[62px] z-50 bg-white rounded-b-lg py-8 px-5" style="box-shadow: rgba(0,0,0,0.12) 0 8px 20px 0">
        <ul class="grid grid-cols-4 grid-flow-col max-h-[400px] overflow-y-auto list-none m-0 p-0" style="grid-template-rows: repeat(11, auto);">
          ${ALL_CATEGORIES.map((cat, i) => {
    const isHeader = COLUMN_HEADERS.includes(i);
    return `
              <li class="mb-3 pr-4 ${isHeader ? 'font-bold' : 'font-normal'} text-[#222]"
                  style="font-size: 14px; line-height: 21px;"
                  data-dropdown-cat="${cat}"
                  ${isHeader ? 'data-column-header' : ''}>
                <a href="#" class="hover:text-primary-600 transition-colors">${cat}</a>
              </li>
            `;
  }).join('')}
        </ul>
      </div>

      <!-- Sub Tab Filter Chips -->
      <ul class="flex items-center h-[48px] px-5 list-none m-0 p-0 overflow-x-auto" data-factory-sub-tab>
        ${SUB_TAB_FILTERS.map(filter => `
          <li class="flex-shrink-0 flex items-center h-8 mr-3 mt-0 px-4 border border-[#767676] rounded-full text-xs text-[#222] text-center cursor-pointer whitespace-nowrap hover:border-[#222] hover:font-medium transition-colors">
            ${filter}
          </li>
        `).join('')}
        <!-- Sub-tab view more -->
        <li id="sub-tab-more-btn" class="ml-auto flex-shrink-0 flex items-center gap-1 h-8 px-4 border border-[#d8d8d8] rounded-full text-xs text-[#222] text-center cursor-pointer whitespace-nowrap hover:border-[#999] transition-colors">
          ${t('mfr.viewMore')}
          <svg class="w-3 h-3 transition-transform duration-200" id="sub-tab-more-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </li>
      </ul>

      <!-- Sub-tab More Dropdown -->
      <div id="sub-tab-dropdown" class="hidden absolute left-0 right-0 top-[110px] z-50 bg-white rounded-b-lg py-6 px-5" style="box-shadow: rgba(0,0,0,0.12) 0 8px 20px 0">
        <ul class="flex flex-wrap list-none m-0 p-0">
          ${SUB_TAB_MORE_FILTERS.map(filter => `
            <li class="w-1/4 mb-3 pr-4 text-sm text-[#222] cursor-pointer hover:text-primary-600 transition-colors">
              ${filter}
            </li>
          `).join('')}
        </ul>
      </div>

    </div>

    <!-- Mobile layout (Filter bar) -->
    <div class="lg:hidden flex items-center overflow-x-auto gap-2.5 pb-2 mb-1 no-scrollbar scroll-smooth">
      <button class="flex items-center justify-center w-[30px] h-[30px] border border-gray-300 rounded-full shrink-0 bg-white">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-4 h-4 text-[#222]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0H3.75m12 12h3.75m-3.75 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0H3.75m9.75-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0H3.75" />
        </svg>
      </button>
      <button class="px-3.5 h-[30px] border border-gray-300 rounded-full text-[12px] font-medium whitespace-nowrap text-[#222] hover:bg-gray-50 flex items-center shrink-0">
        ${t('mfr.verifiedManufacturers')}
      </button>
    </div>
  `;
}

export function initHorizontalCategoryBar(): void {
  const btn = document.getElementById('hm-view-more');
  const menu = document.getElementById('hm-mega-menu');
  const icon = document.getElementById('hm-view-more-icon');
  const tabUl = document.querySelector<HTMLElement>('[data-factory-tab]');

  const subBtn = document.getElementById('sub-tab-more-btn');
  const subIcon = document.getElementById('sub-tab-more-icon');
  const subDropdown = document.getElementById('sub-tab-dropdown');

  if (!btn || !menu || !tabUl) return;

  function closeMain() {
    if (menu) menu.classList.add('hidden');
    if (icon) icon.style.transform = 'rotate(0deg)';
  }

  function closeSub() {
    if (subDropdown) subDropdown.classList.add('hidden');
    if (subIcon) subIcon.style.transform = 'rotate(0deg)';
  }

  // Main "View more" toggle -- close sub when opening
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      closeSub();
      menu.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      closeMain();
    }
  });

  // Sub-tab "View more" toggle -- close main when opening
  if (subBtn && subDropdown) {
    subBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = subDropdown.classList.contains('hidden');
      if (isHidden) {
        closeMain();
        subDropdown.classList.remove('hidden');
        if (subIcon) subIcon.style.transform = 'rotate(180deg)';
      } else {
        closeSub();
      }
    });
  }

  // Close all on outside click
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    if (!menu.contains(target) && !btn.contains(target)) closeMain();
    if (subDropdown && subBtn && !subDropdown.contains(target) && !subBtn.contains(target)) closeSub();
  });

  // Tab switching + dropdown active sync
  const tabs = Array.from(tabUl.querySelectorAll<HTMLElement>('[data-tab-index]'));
  const dropdownItems = menu.querySelectorAll<HTMLElement>('[data-dropdown-cat]');

  function syncDropdownActive(activeTabName: string) {
    dropdownItems.forEach(item => {
      const isHeader = item.hasAttribute('data-column-header');
      const isActive = item.dataset.dropdownCat === activeTabName;
      if (isHeader || isActive) {
        item.classList.add('font-bold');
        item.classList.remove('font-normal');
      } else {
        item.classList.remove('font-bold');
        item.classList.add('font-normal');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('factory-tab-active', 'font-bold');
        t.classList.add('font-normal');
      });
      tab.classList.add('factory-tab-active', 'font-bold');
      tab.classList.remove('font-normal');

      const idx = parseInt(tab.dataset.tabIndex || '0');
      const TAB_CATEGORIES = getTabCategories();
      syncDropdownActive(TAB_CATEGORIES[idx]);
    });
  });
}
