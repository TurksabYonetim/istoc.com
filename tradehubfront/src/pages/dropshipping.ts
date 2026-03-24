import '../style.css'
import { initFlowbite } from 'flowbite'

import { TopBar, initMobileDrawer, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { renderSidebar } from '../components/sidebar'
import { DropshippingLayout, initDropshippingLayout } from '../components/dropshipping'
import { requireAuth } from '../utils/auth-guard'

await requireAuth();

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Compact Dashboard Header -->
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg)">
    ${TopBar({ compact: true })}
  </div>

  <!-- Page body: Hover-expand Sidebar + Content -->
  <div class="bg-[#F5F5F5] min-h-screen">
    <div class="max-w-[1425px] mx-auto px-4 max-sm:px-1 flex gap-1 md:gap-[14px]">
      <div class="ds-sidebar-col flex-shrink-0 pt-4">
        ${renderSidebar()}
      </div>
      <div class="flex-1 min-w-0 pt-4 pb-4 overflow-hidden">
        <main>
          ${DropshippingLayout()}
        </main>
      </div>
    </div>
  </div>

  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initDropshippingLayout();

// Sticky header scroll shadow
const stickyHeader = document.getElementById('sticky-header');
if (stickyHeader) {
  window.addEventListener('scroll', () => {
    stickyHeader.classList.toggle('scrolled', window.scrollY > 0);
  });
}
