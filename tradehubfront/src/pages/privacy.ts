/**
 * Privacy Policy Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { LegalPageLayout } from '../components/legal'
import { privacyContent } from '../data/legalContent'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'privacy' })}
  <main>
    ${LegalPageLayout(privacyContent())}
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
