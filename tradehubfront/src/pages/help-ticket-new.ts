/**
 * New Ticket Page — Entry Point
 */
import '../style.css'
import { initFlowbite } from 'flowbite'
import { FloatingPanel } from '../components/floating'
import { startAlpine } from '../alpine'
import { HelpCenterHeader } from '../components/help-center'
import { TicketForm } from '../components/help-center/TicketForm'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.classList.add('relative');
appEl.innerHTML = `
  ${HelpCenterHeader({ activePage: 'ticket-new' })}
  <main>
    ${TicketForm()}
  </main>
  ${FloatingPanel()}
`;

initFlowbite();
startAlpine();
