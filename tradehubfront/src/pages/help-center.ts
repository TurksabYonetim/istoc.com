/**
 * Help Center Page — Entry Point
 */

import '../style.css'
import { initFlowbite } from 'flowbite'

import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterLayout, HelpCenterHeader } from '../components/help-center'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  <!-- Dedicated Help Center Header -->
  ${HelpCenterHeader()}

  <!-- Help Center Page Content -->
  <main>
    ${HelpCenterLayout()}
  </main>

  <!-- Floating Panel -->
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
