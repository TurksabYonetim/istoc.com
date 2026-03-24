/**
 * Turkish form validation utilities.
 * Validates phone, TCKN, IBAN and provides static data lists.
 */

import { TR_TAX_OFFICE_TO_CITY } from '../data/tr-tax-offices';

/* ── Phone ─────────────────────────────────────────── */

const PHONE_RE = /^(\+90|0)?5\d{9}$/;

export function validatePhone(value: string): boolean {
  return PHONE_RE.test(value.replace(/[\s\-\(\)]/g, ''));
}

/* ── TCKN (TC Kimlik No — 11 digit, mod-10) ────────── */

export function validateTCKN(value: string): boolean {
  const digits = value.replace(/\s/g, '');
  if (!/^\d{11}$/.test(digits)) return false;
  if (digits[0] === '0') return false;

  const d = digits.split('').map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  if ((odd * 7 - even) % 10 !== d[9]) return false;
  const sumFirst10 = d.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sumFirst10 % 10 !== d[10]) return false;
  return true;
}

/* ── VKN (Vergi Kimlik Numarası — 10 digit) ────────── */
/* Kept for future use (MVP sonrası) */

export function validateVKN(value: string): boolean {
  const digits = value.replace(/\s/g, '');
  if (!/^\d{10}$/.test(digits)) return false;

  const d = digits.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let tmp = (d[i] + (9 - i)) % 10;
    tmp = (tmp * (2 ** (9 - i))) % 9;
    if (tmp === 0 && (d[i] + (9 - i)) % 10 !== 0) tmp = 9;
    sum += tmp;
  }
  return (10 - (sum % 10)) % 10 === d[9];
}

/* ── IBAN (TR + MOD-97 + Turkish bank code) ────────── */

const TR_BANK_CODES: Record<string, string> = {
  '0001': 'T.C. Merkez Bankası',
  '0004': 'İller Bankası',
  '0010': 'Ziraat Bankası',
  '0012': 'Halkbank',
  '0015': 'Vakıflar Bankası',
  '0017': 'Kalkınma Bankası',
  '0029': 'Birleşik Fon Bankası',
  '0032': 'Türk Ekonomi Bankası (TEB)',
  '0046': 'Akbank',
  '0059': 'Şekerbank',
  '0062': 'Garanti BBVA',
  '0064': 'İş Bankası',
  '0067': 'Yapı Kredi',
  '0091': 'Arap Türk Bankası',
  '0096': 'Turkish Bank',
  '0098': 'Citibank',
  '0099': 'ING Bank',
  '0100': 'Adabank',
  '0103': 'Fibabanka',
  '0108': 'Türkiye Finans',
  '0109': 'ICBC Turkey',
  '0111': 'QNB Finansbank',
  '0115': 'Denizbank',
  '0121': 'Alternatifbank',
  '0123': 'HSBC',
  '0124': 'Burgan Bank',
  '0125': 'Bank of China Turkey',
  '0134': 'Odeabank',
  '0135': 'Anadolubank',
  '0137': 'Rabobank',
  '0139': 'Kuveyt Türk',
  '0142': 'Bankpozitif',
  '0143': 'Aktif Yatırım Bankası',
  '0146': 'Albaraka Türk',
  '0148': 'Emlak Katılım',
  '0149': 'Ziraat Katılım',
  '0150': 'Vakıf Katılım',
  '0203': 'Hayat Finans',
  '0205': 'Pasha Bank',
  '0206': 'N Kolay (Aktif Bank)',
  '0208': 'Papara',
  '0209': 'Enpara (QNB)',
};

export function validateIBAN(value: string): { valid: boolean; bankName?: string } {
  const iban = value.replace(/\s/g, '').toUpperCase();
  if (!/^TR\d{24}$/.test(iban)) return { valid: false };

  // MOD-97 check
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0n;
  for (const ch of numeric) {
    remainder = (remainder * 10n + BigInt(ch)) % 97n;
  }
  if (remainder !== 1n) return { valid: false };

  const bankCode = iban.slice(4, 8);
  const bankName = TR_BANK_CODES[bankCode];
  return { valid: true, bankName };
}

/* ── 81 Turkish Provinces ──────────────────────────── */

export const TR_CITIES: string[] = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

/* ── Tax Offices (1005 offices from official data) ── */

/** Tax office names sorted alphabetically */
export const TR_TAX_OFFICES: string[] = Object.keys(TR_TAX_OFFICE_TO_CITY).sort(
  (a, b) => a.localeCompare(b, 'tr')
);

/** Get the city (il) for a given tax office name */
export function getCityForTaxOffice(officeName: string): string {
  return TR_TAX_OFFICE_TO_CITY[officeName] || '';
}
