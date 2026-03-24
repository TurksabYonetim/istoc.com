/**
 * Application Pending Page — Entry Point
 * Shows seller application status (Draft, Submitted, Under Review, Rejected).
 */

import '../style.css'

import { ApplicationPendingPage } from '../components/seller/ApplicationPendingPage'
import { startAlpine } from '../alpine'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.innerHTML = ApplicationPendingPage();

startAlpine();
