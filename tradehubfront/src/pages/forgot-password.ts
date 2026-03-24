/**
 * Forgot Password Page — Entry Point
 * 3-step password reset: find account → verify code → set new password.
 */

import '../style.css'

import { ForgotPasswordPage } from '../components/auth'
import { startAlpine } from '../alpine'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.innerHTML = ForgotPasswordPage();

// Start Alpine AFTER innerHTML is set so it can find all x-data directives in the DOM
startAlpine();
