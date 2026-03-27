/**
 * Authentication utility — real Frappe API integration
 * All auth-related API calls go through the api() wrapper from utils/api.ts.
 */

import { api } from './api';

const FRAPPE_BASE = import.meta.env.VITE_FRAPPE_BASE || '';

/* ── Types ──────────────────────────────────────────── */

export interface AuthUser {
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  member_id: string;
  roles: string[];
  is_admin: boolean;
  is_seller: boolean;
  is_buyer: boolean;
  has_seller_profile: boolean;
  pending_seller_application: boolean;
  rejected_seller_application?: boolean;
  seller_application_status?: string;
  seller_profile: string | null;
}

interface SessionResponse {
  logged_in: boolean;
  user: AuthUser;
}

interface LoginResponse {
  message: string;
  full_name?: string;
  requires_2fa?: boolean;
  otp_id?: string;
  requires_consent_renewal?: boolean;
  consent_types?: string[];
  session_id?: string;
  tenant_id?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user: string;
  account_type: string;
  seller_application?: string;
  seller_application_status?: string;
}

interface CheckEmailResponse {
  success: boolean;
  exists: boolean;
  disabled: boolean;
}

interface OtpSendResponse {
  success: boolean;
  expires_in_minutes: number;
}

interface OtpVerifyResponse {
  success: boolean;
  registration_token: string;
}

interface SimpleResponse {
  success: boolean;
  message: string;
}

/* ── Session cache ──────────────────────────────────── */

/** Frappe get_current_user response tipi */
export interface FrappeCurrentUser {
  is_guest: boolean;
  email?: string;
  full_name?: string;
  is_seller?: boolean;
  seller?: {
    name: string;
    seller_name: string;
    seller_code: string;
    status: string;
    logo?: string;
    health_score?: number;
    score_grade?: string;
  } | null;
}

/* ── Session cache ──────────────────────────────────── */

let _cachedUser: AuthUser | null = null;

/** Check if user is logged in (synchronous, cache-based) */
export function isLoggedIn(): boolean {
  return _cachedUser !== null;
}

/** Get current user info synchronously (or null if not logged in) */
export function getUser(): AuthUser | null {
  return _cachedUser;
}

/* ── Early session init (module-level singleton) ────── */

// Modül yüklenince hemen oturum kontrolü başlatılır.
// initAuthState() ve diğer çağrılar bu promise'i bekler;
// API cevabı çoğunlukla DOM render edilmeden önce gelir.
let _sessionPromise: Promise<AuthUser | null> | null = null;

function _startSession(): Promise<AuthUser | null> {
  if (!_sessionPromise) {
    _sessionPromise = getSessionUser();
  }
  return _sessionPromise;
}

/** Auth durumu hazır olana kadar bekler. Birden fazla kez çağrıldığında aynı promise'i döner. */
export function waitForAuth(): Promise<AuthUser | null> {
  return _startSession();
}

/** Logout sonrası veya yeniden kontrol için session promise'i sıfırla. */
export function invalidateAuthCache(): void {
  _cachedUser = null;
  _sessionPromise = null;
}

/* ── Login / Logout ─────────────────────────────────── */

/** Login with email and password via Frappe */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const BASE_URL = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${BASE_URL}/method/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usr: email, pwd: password }),
  });

  if (!res.ok) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const data = await res.json() as LoginResponse;

  if (data.requires_2fa) {
    console.warn('[Auth] 2FA gerekli — henüz implement edilmedi', data);
    throw new Error('2FA_REQUIRED');
  }

  if (data.requires_consent_renewal) {
    console.warn('[Auth] Consent yenileme gerekli', data);
  }

  return data;
}

/** Logout via Frappe */
export async function logout(): Promise<void> {
  const BASE_URL = import.meta.env.VITE_API_URL || '';
  try {
    await fetch(`${BASE_URL}/method/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'manual',
    });
  } catch {
    // Network errors are fine — session cookie is already cleared by the server
  }
  invalidateAuthCache();
}

/* ── Session ────────────────────────────────────────── */

/** Fetch current session user from backend */
export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const res = await api<{ message: SessionResponse }>(
      '/method/tradehub_core.api.v1.auth.get_session_user'
    );
    if (res.message?.logged_in && res.message.user) {
      _cachedUser = res.message.user;
      return _cachedUser;
    }
    _cachedUser = null;
    return null;
  } catch {
    _cachedUser = null;
    return null;
  }
}

// getSessionUser tanımlandıktan sonra hemen başlat
_startSession();

/** Get redirect URL based on user role */
export function getRedirectUrl(user: AuthUser): string {
  if (user.is_admin) {
    return `${FRAPPE_BASE}/app`;
  }
  // All users (buyers and sellers) go to storefront home after login
  return '/';
}

/* ── Registration ───────────────────────────────────── */

/** Check if email is already registered. Returns { exists, disabled }. */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; disabled: boolean }> {
  const res = await api<{ message: CheckEmailResponse }>(
    '/method/tradehub_core.api.v1.auth.check_email_exists',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
  return {
    exists: res.message?.exists ?? false,
    disabled: res.message?.disabled ?? false,
  };
}

/** Send registration OTP to email */
export async function sendRegistrationOtp(email: string): Promise<OtpSendResponse> {
  const res = await api<{ message: OtpSendResponse }>(
    '/method/tradehub_core.api.v1.identity.send_registration_otp',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
  return res.message;
}

/** Verify registration OTP and get registration_token */
export async function verifyRegistrationOtp(
  email: string,
  code: string
): Promise<OtpVerifyResponse> {
  const res = await api<{ message: OtpVerifyResponse }>(
    '/method/tradehub_core.api.v1.identity.verify_registration_otp',
    {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }
  );
  return res.message;
}

/** Register a new user */
export async function register(params: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  account_type: 'buyer' | 'supplier';
  phone?: string;
  country: string;
  accept_terms: boolean;
  accept_kvkk: boolean;
  registration_token: string;
}): Promise<RegisterResponse> {
  const res = await api<{ message: RegisterResponse }>(
    '/method/tradehub_core.api.v1.identity.register_user',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
  return res.message;
}

/* ── Password Reset ─────────────────────────────────── */

/** Request password reset email */
export async function forgotPassword(email: string): Promise<SimpleResponse> {
  const res = await api<{ message: SimpleResponse }>(
    '/method/tradehub_core.api.v1.identity.forgot_password',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
  return res.message;
}

/* ── Supplier Application ──────────────────────────── */

interface CompleteApplicationResponse {
  success: boolean;
  application: string;
  seller_application?: string;
  seller_application_status?: string;
}

/** Complete supplier registration application with all form data */
export async function completeRegistrationApplication(
  params: Record<string, unknown>
): Promise<CompleteApplicationResponse> {
  const res = await api<{ message: CompleteApplicationResponse }>(
    '/method/tradehub_core.api.v1.identity.complete_registration_application',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
  return res.message;
}

/** Create/get seller application for an existing buyer (become seller flow) */
export async function becomeSeller(): Promise<CompleteApplicationResponse> {
  const res = await api<{ message: CompleteApplicationResponse }>(
    '/method/tradehub_core.api.v1.identity.become_seller',
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  );
  return res.message;
}

/** Register supplier atomically — account + application in one call */
export async function registerSupplier(
  params: Record<string, unknown>
): Promise<CompleteApplicationResponse> {
  const res = await api<{ message: CompleteApplicationResponse }>(
    '/method/tradehub_core.api.v1.identity.register_supplier',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
  return res.message;
}

/* ── Password Reset ─────────────────────────────────── */

/** Reset password with key from email link */
export async function resetPassword(
  key: string,
  new_password: string
): Promise<SimpleResponse> {
  const res = await api<{ message: SimpleResponse }>(
    '/method/tradehub_core.api.v1.identity.reset_password',
    {
      method: 'POST',
      body: JSON.stringify({ key, new_password }),
    }
  );
  return res.message;
}

/**
 * Frappe backend'den mevcut oturum + seller bilgisini alır.
 * Auth geliştirici login/register'dan sonra bu fonksiyonu kullanarak
 * UI'ı güncelleyebilir.
 *
 * @example
 *   const user = await getCurrentUser()
 *   if (user.is_seller) { ... }
 */
export async function getCurrentUser(): Promise<FrappeCurrentUser> {
  const { callMethod } = await import('./api');
  return callMethod<FrappeCurrentUser>('tradehub_core.api.auth.get_current_user');
}
