/**
 * Reset Password Page — Entry Point
 * Landing page for password reset links from email.
 * Reads ?key= from URL; if missing, shows error and redirects to forgot-password.
 */

import '../style.css'

import { ResetPasswordPage } from '../components/auth/ResetPasswordPage'
import { startAlpine } from '../alpine'

const appEl = document.querySelector<HTMLDivElement>('#app')!;
appEl.innerHTML = ResetPasswordPage();

// Start Alpine AFTER innerHTML is set so it can find all x-data directives in the DOM
startAlpine();
