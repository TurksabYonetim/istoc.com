/**
 * Cookie Policy Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { LegalPageLayout, CookieConsentUI } from '../components/legal'
import { cookiesContent } from '../data/legalContent'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'cookies' })}
  <main>
    ${LegalPageLayout(cookiesContent())}
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
      ${CookieConsentUI()}
    </div>
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
