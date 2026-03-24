/**
 * Tickets List Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { TicketsListLayout } from '../components/help-center/TicketsListLayout'
import { getMockTickets } from '../data/mockTickets'
const mockTickets = getMockTickets();

// Make tickets available to Alpine
(window as any).__mockTickets = mockTickets;

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'tickets' })}
  <main>
    ${TicketsListLayout()}
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
