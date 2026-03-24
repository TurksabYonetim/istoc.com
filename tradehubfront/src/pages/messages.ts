/**
 * Messages Page — Entry Point
 * Assembles header, sidebar, messages layout, and footer.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'

import { TopBar, initMobileDrawer, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { renderSidebar } from '../components/sidebar'
import { MessagesLayout, initMessagesLayout } from '../components/messages'
import { requireAuth } from '../utils/auth-guard'

await requireAuth();

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Compact Dashboard Header -->
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg)">
    ${TopBar({ compact: true })}
  </div>

  <!-- Page body: Sidebar + Messages -->
  <div class="bg-[#F5F5F5] min-h-screen">
    <div class="max-w-[1425px] mx-auto px-4 max-sm:px-1.5 flex gap-1 md:gap-[14px] max-md:gap-0">
      <!-- Sidebar Column -->
      <div class="w-[52px] md:w-[72px] xl:w-[260px] flex-shrink-0 pt-4">
        ${renderSidebar()}
      </div>

      <!-- Content Column -->
      <div class="flex-1 min-w-0 pt-4 pb-4 max-md:pt-2 max-md:pb-2 max-sm:pt-1 max-sm:pb-1">
        <main>
          ${MessagesLayout()}
        </main>
      </div>
    </div>
  </div>

  <!-- Floating Panel -->
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
initHeaderCart();
initMobileDrawer();
initLanguageSelector();
initMessagesLayout();
