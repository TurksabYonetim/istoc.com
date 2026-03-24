/**
 * Terms of Service Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { LegalPageLayout } from '../components/legal'
import { termsContent } from '../data/legalContent'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'terms' })}
  <main>
    ${LegalPageLayout(termsContent())}
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
