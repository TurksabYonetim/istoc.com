/**
 * Settings Page — Entry Point
 * Account settings with profile header and settings cards.
 */

import '../style.css'
import { initFlowbite } from 'flowbite'
import { t } from '../i18n'
import { startAlpine } from '../alpine'
import { requireAuth } from '../utils/auth-guard'

import { TopBar, initMobileDrawer, initHeaderCart } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'
import { Breadcrumb } from '../components/shared/Breadcrumb'
import { FooterLinks } from '../components/footer'
import { FloatingPanel, initFloatingPanel } from '../components/floating'
import { renderSidebar, initSidebar } from '../components/sidebar'
import { SettingsLayout, initSettingsLayout } from '../components/settings'

// Block page until auth is confirmed
await requireAuth();

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <div id="sticky-header" class="sticky top-0 z-(--z-header)" style="background-color:var(--header-scroll-bg)">
    ${TopBar({ compact: true })}
  </div>

  <div class="bg-[#F5F5F5] min-h-screen">
    <div class="max-w-[1425px] mx-auto px-4 max-sm:px-1 flex gap-1 md:gap-[14px]">
      <div class="w-[52px] md:w-[72px] xl:w-[260px] flex-shrink-0 pt-4">
        ${renderSidebar()}
      </div>

      <div class="flex-1 min-w-0">
        <div class="pt-4">
          ${Breadcrumb([
            { label: t('header.myAccount'), href: '/pages/dashboard/buyer-dashboard.html' },
            { label: t('dashboard.accountSettings') },
          ])}
        </div>

        <main>
          ${SettingsLayout()}
        </main>

        <footer>
          ${FooterLinks()}
        </footer>
      </div>
    </div>
  </div>

  ${FloatingPanel()}
`;

initFlowbite();
initHeaderCart();
initFloatingPanel();
initMobileDrawer();
initLanguageSelector();
initSidebar();
initSettingsLayout();

// Start Alpine AFTER innerHTML is set so it can find all x-data directives in the DOM
startAlpine();
