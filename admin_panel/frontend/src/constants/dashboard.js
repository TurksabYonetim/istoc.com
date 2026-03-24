/**
 * Dashboard Constants
 *
 * Magic numbers, chart configs, and shared values used across dashboard components.
 */

// ── Chart dimensions ────────────────────────────────────────
export const CHART_HEIGHTS = {
    SPARKLINE: '60px',
    MINI: '180px',
    SMALL: '240px',
    MEDIUM: '300px',
    LARGE: '400px',
    FULL: '500px',
}

// ── KPI refresh intervals (ms) ──────────────────────────────
export const REFRESH_INTERVALS = {
    KPI: 60_000,        // 1 min
    CHART: 300_000,     // 5 min
    TABLE: 120_000,     // 2 min
    REALTIME: 10_000,   // 10 sec
}

// ── staleTime for caching (ms) ──────────────────────────────
export const STALE_TIMES = {
    KPI: 30_000,
    CHART: 120_000,
    TABLE: 60_000,
    CONFIG: Infinity,
}

// ── Date presets ────────────────────────────────────────────
export const DATE_PRESETS = [
    { value: '7d', label: 'Son 7 Gün', days: 7 },
    { value: '30d', label: 'Son 30 Gün', days: 30 },
    { value: '90d', label: 'Son 90 Gün', days: 90 },
    { value: '365d', label: 'Son 1 Yıl', days: 365 },
]

// ── Status colors ───────────────────────────────────────────
export const STATUS_COLORS = {
    'Tamamlandı': { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10B981' },
    'İşlemde': { bg: 'bg-blue-50', text: 'text-blue-600', color: '#3B82F6' },
    'Beklemede': { bg: 'bg-amber-50', text: 'text-amber-600', color: '#F59E0B' },
    'İptal': { bg: 'bg-red-50', text: 'text-red-600', color: '#EF4444' },
    'Onaylandı': { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10B981' },
    'Reddedildi': { bg: 'bg-red-50', text: 'text-red-600', color: '#EF4444' },
    'Draft': { bg: 'bg-gray-50', text: 'text-gray-600', color: '#6B7280' },
    'Active': { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10B981' },
    'Suspended': { bg: 'bg-amber-50', text: 'text-amber-600', color: '#F59E0B' },
}

// ── Chart palette (12 colors) ───────────────────────────────
export const CHART_PALETTE = [
    '#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#EC4899',
    '#8B5CF6', '#14B8A6', '#F97316', '#EF4444', '#84CC16',
    '#06B6D4', '#A78BFA',
]

// ── Light chart palette (for light theme) ───────────────────
export const CHART_PALETTE_LIGHT = [
    '#6c5dd3', '#10B981', '#F59E0B', '#3B82F6', '#EC4899',
    '#8B5CF6', '#14B8A6', '#F97316', '#EF4444', '#84CC16',
    '#06B6D4', '#A78BFA',
]

// ── Widget sizes (grid column spans) ────────────────────────
export const WIDGET_SIZES = {
    sm: { cols: 3, label: 'Küçük (3 sütun)' },
    md: { cols: 4, label: 'Orta (4 sütun)' },
    lg: { cols: 6, label: 'Büyük (6 sütun)' },
    xl: { cols: 8, label: 'Çok Büyük (8 sütun)' },
    full: { cols: 12, label: 'Tam Genişlik (12 sütun)' },
}

// ── Months (TR) ──────────────────────────────────────────────
export const MONTHS_TR = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
]

// ── Days of week (TR) ───────────────────────────────────────
export const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

// ── Hours (business) ────────────────────────────────────────
export const HOURS = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]

// ── Number formatting helpers ───────────────────────────────
export function formatCurrency(value, decimals = 0) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

export function formatNumber(value) {
    return new Intl.NumberFormat('tr-TR').format(value)
}

export function formatPercent(value, decimals = 1) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100)
}
