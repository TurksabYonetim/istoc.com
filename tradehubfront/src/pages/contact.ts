/**
 * Contact Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { ContactPageLayout } from '../components/help-center/ContactPageLayout'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'contact' })}
  <main>
    ${ContactPageLayout()}
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
