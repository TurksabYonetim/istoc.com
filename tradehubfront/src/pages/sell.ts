/**
 * Sell Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { TopBar, SubHeader, MegaMenu, initMegaMenu, initStickyHeaderSearch, initMobileDrawer } from '../components/header'
import { initLanguageSelector } from '../components/header/TopBar'
import { Breadcrumb } from '../components/shared/Breadcrumb'
import { FooterLinks } from '../components/footer'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { SellPageLayout } from '../components/sell'
import { t } from '../i18n'
import { getUser, getSessionUser } from '../utils/auth'
import { getSellerStoreUrl } from '../utils/seller'

// Redirect #register-form hash to the actual register page
if (window.location.hash === '#register-form') {
  window.location.replace('/pages/auth/register.html?type=supplier');
}

// Redirect #register-form hash to the actual register page
if (window.location.hash === '#register-form') {
  window.location.replace('/pages/auth/register.html?type=supplier');
}

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <div id="sticky-header" class="sticky top-0 z-(--z-header) transition-colors duration-200" style="background-color:var(--header-scroll-bg);border-bottom:1px solid var(--header-scroll-border)">
    ${TopBar()}
    ${SubHeader()}
  </div>
  ${MegaMenu()}
  <main class="flex-1 min-w-0 bg-white">
    <div class="container-boxed">
      ${Breadcrumb([{ label: t('seller.sellOnIstoc') }])}
    </div>
    ${SellPageLayout()}
  </main>
  <footer class="mt-auto">
    ${FooterLinks()}
  </footer>
  ${FloatingPanel()}
`;

initMegaMenu();
initFlowbite();
startAlpine();
initStickyHeaderSearch();
initMobileDrawer();
initLanguageSelector();

// Seller CTA: handle based on login + seller status
document.addEventListener('click', async (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-seller-cta]');
  if (!link) return;

  e.preventDefault();
  const user = getUser() || await getSessionUser();

  if (!user) {
    // Not logged in → register as supplier
    window.location.href = '/pages/auth/register.html?type=supplier';
    return;
  }

  if (user.seller_application_status || user.has_seller_profile) {
    // Already has seller application/profile → go to store page
    window.location.href = getSellerStoreUrl(user);
    return;
  }

  // Logged-in buyer without seller application → go to supplier setup form
  window.location.href = '/pages/seller/supplier-setup.html';
});
