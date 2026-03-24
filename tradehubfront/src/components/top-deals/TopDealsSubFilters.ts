/**
 * TopDealsSubFilters Component
 * Pill-shaped sub-filter buttons (Alibaba reference: rounded border pills)
 * Mobile: single-row horizontal scroll with truncated pills
 * Desktop: wrapping multi-row layout
 */

export function TopDealsSubFilters(): string {
  return `
    <div
      class="flex md:flex-wrap gap-2 mt-3 pb-2 overflow-x-auto md:overflow-x-visible scrollbar-hide"
      x-show="subFilters.length > 0"
      x-transition
    >
      <template x-for="filter in subFilters" :key="filter.id">
        <button
          type="button"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all border max-w-[120px] md:max-w-none truncate"
          :class="activeSubFilter === filter.id
            ? 'border-[#222] text-[#222] font-medium bg-white'
            : 'border-[#e5e5e5] text-[#666] bg-white hover:border-[#999]'"
          @click="setSubFilter(filter.id)"
          x-text="filter.labelKey.startsWith('topDealsPage.') ? $t(filter.labelKey) : filter.labelKey"
        ></button>
      </template>
    </div>
  `;
}
