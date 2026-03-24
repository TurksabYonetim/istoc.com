/**
 * Theme Token Definitions
 * Token definitions for ThemeEditorPanel
 * Contains all CSS variable tokens organized by category
 */

/**
 * Font option for font-family selectors
 */
export interface FontOption {
  label: string;
  value: string;
  google?: string | null;
}

/**
 * Individual theme token definition
 */
export interface ThemeToken {
  var: string; // CSS variable name (e.g., '--color-primary-500')
  type: 'color' | 'range' | 'font' | 'text';
  default: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  options?: FontOption[];
}

/**
 * Group of related tokens (collapsible section)
 */
export interface TokenGroup {
  name: string;
  collapsed?: boolean;
  tokens: ThemeToken[];
}

/**
 * Component editor definition with preview
 */
export interface ComponentEditor {
  id: string;
  name: string;
  icon: string;
  tokens: ThemeToken[];
  outlineTokens?: ThemeToken[];
}

/**
 * Page section editor definition with preview
 */
export interface SectionEditor {
  id: string;
  name: string;
  icon: string;
  tokens: ThemeToken[];
}

/**
 * Main token groups - Global design system tokens
 */
export const themeTokenGroups: TokenGroup[] = [
  {
    name: 'Primary Colors',
    collapsed: false,
    tokens: [
      { var: '--color-primary-50', type: 'color', default: '#fef9e7' },
      { var: '--color-primary-100', type: 'color', default: '#fdf0c3' },
      { var: '--color-primary-200', type: 'color', default: '#fbe08a' },
      { var: '--color-primary-300', type: 'color', default: '#f6c94d' },
      { var: '--color-primary-400', type: 'color', default: '#e6b212' },
      { var: '--color-primary-500', type: 'color', default: '#cc9900' },
      { var: '--color-primary-600', type: 'color', default: '#b38600' },
      { var: '--color-primary-700', type: 'color', default: '#8a6800' },
      { var: '--color-primary-800', type: 'color', default: '#6b5100' },
      { var: '--color-primary-900', type: 'color', default: '#4d3a00' },
      { var: '--color-primary-950', type: 'color', default: '#2e2200' },
    ]
  },
  {
    name: 'Secondary Colors',
    collapsed: true,
    tokens: [
      { var: '--color-secondary-50', type: 'color', default: '#f5f5f5' },
      { var: '--color-secondary-100', type: 'color', default: '#e5e5e5' },
      { var: '--color-secondary-200', type: 'color', default: '#cccccc' },
      { var: '--color-secondary-300', type: 'color', default: '#a3a3a3' },
      { var: '--color-secondary-400', type: 'color', default: '#737373' },
      { var: '--color-secondary-500', type: 'color', default: '#525252' },
      { var: '--color-secondary-600', type: 'color', default: '#333333' },
      { var: '--color-secondary-700', type: 'color', default: '#1f1f1f' },
      { var: '--color-secondary-800', type: 'color', default: '#141414' },
      { var: '--color-secondary-900', type: 'color', default: '#0a0a0a' },
      { var: '--color-secondary-950', type: 'color', default: '#050505' },
    ]
  },
  {
    name: 'Accent Colors',
    collapsed: true,
    tokens: [
      { var: '--color-accent-50', type: 'color', default: '#ecfeff' },
      { var: '--color-accent-100', type: 'color', default: '#cffafe' },
      { var: '--color-accent-200', type: 'color', default: '#a5f3fc' },
      { var: '--color-accent-300', type: 'color', default: '#67e8f9' },
      { var: '--color-accent-400', type: 'color', default: '#22d3ee' },
      { var: '--color-accent-500', type: 'color', default: '#06b6d4' },
      { var: '--color-accent-600', type: 'color', default: '#0891b2' },
      { var: '--color-accent-700', type: 'color', default: '#0e7490' },
      { var: '--color-accent-800', type: 'color', default: '#155e75' },
      { var: '--color-accent-900', type: 'color', default: '#164e63' },
      { var: '--color-accent-950', type: 'color', default: '#083344' },
    ]
  },
  {
    name: 'Semantic Colors',
    collapsed: true,
    tokens: [
      { var: '--color-success-50', type: 'color', default: '#f0fdf4' },
      { var: '--color-success-500', type: 'color', default: '#22c55e' },
      { var: '--color-success-700', type: 'color', default: '#15803d' },
      { var: '--color-warning-50', type: 'color', default: '#fffbeb' },
      { var: '--color-warning-500', type: 'color', default: '#f59e0b' },
      { var: '--color-warning-700', type: 'color', default: '#b45309' },
      { var: '--color-error-50', type: 'color', default: '#fef2f2' },
      { var: '--color-error-500', type: 'color', default: '#ef4444' },
      { var: '--color-error-700', type: 'color', default: '#b91c1c' },
      { var: '--color-info-50', type: 'color', default: '#eff6ff' },
      { var: '--color-info-500', type: 'color', default: '#3b82f6' },
      { var: '--color-info-700', type: 'color', default: '#1d4ed8' },
    ]
  },
  {
    name: 'Surface Colors',
    collapsed: true,
    tokens: [
      { var: '--color-surface', type: 'color', default: '#ffffff' },
      { var: '--color-surface-muted', type: 'color', default: '#fafafa' },
      { var: '--color-surface-raised', type: 'color', default: '#f5f5f5' },
      { var: '--color-surface-overlay', type: 'text', default: 'rgba(0, 0, 0, 0.5)' },
      { var: '--color-surface-inverse', type: 'color', default: '#0a0a0a' },
    ]
  },
  {
    name: 'Text Colors',
    collapsed: true,
    tokens: [
      { var: '--color-text-primary', type: 'color', default: '#0a0a0a' },
      { var: '--color-text-secondary', type: 'color', default: '#525252' },
      { var: '--color-text-tertiary', type: 'color', default: '#a3a3a3' },
      { var: '--color-text-disabled', type: 'color', default: '#d4d4d4' },
      { var: '--color-text-inverse', type: 'color', default: '#fafafa' },
      { var: '--color-text-link', type: 'color', default: '#cc9900' },
      { var: '--color-text-link-hover', type: 'color', default: '#b38600' },
    ]
  },
  {
    name: 'Border Colors',
    collapsed: true,
    tokens: [
      { var: '--color-border-default', type: 'color', default: '#e5e5e5' },
      { var: '--color-border-strong', type: 'color', default: '#a3a3a3' },
      { var: '--color-border-focus', type: 'color', default: '#cc9900' },
      { var: '--color-border-error', type: 'color', default: '#ef4444' },
    ]
  },
  {
    name: 'Font Sizes',
    collapsed: true,
    tokens: [
      { var: '--font-size-xs', type: 'range', default: 0.75, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-sm', type: 'range', default: 0.875, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-base', type: 'range', default: 1.125, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-lg', type: 'range', default: 1.25, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-xl', type: 'range', default: 1.5, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-2xl', type: 'range', default: 1.875, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-3xl', type: 'range', default: 2.25, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-4xl', type: 'range', default: 3, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
      { var: '--font-size-5xl', type: 'range', default: 3.75, min: 0.5, max: 5, step: 0.0625, unit: 'rem' },
    ]
  },
  {
    name: 'Font Weights',
    collapsed: true,
    tokens: [
      { var: '--font-weight-normal', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '' },
      { var: '--font-weight-medium', type: 'range', default: 500, min: 100, max: 900, step: 100, unit: '' },
      { var: '--font-weight-semibold', type: 'range', default: 600, min: 100, max: 900, step: 100, unit: '' },
      { var: '--font-weight-bold', type: 'range', default: 700, min: 100, max: 900, step: 100, unit: '' },
      { var: '--font-weight-black', type: 'range', default: 900, min: 100, max: 900, step: 100, unit: '' },
    ]
  },
  {
    name: 'Line Heights',
    collapsed: true,
    tokens: [
      { var: '--line-height-none', type: 'range', default: 1, min: 0.8, max: 3, step: 0.025, unit: '' },
      { var: '--line-height-tight', type: 'range', default: 1.25, min: 0.8, max: 3, step: 0.025, unit: '' },
      { var: '--line-height-snug', type: 'range', default: 1.375, min: 0.8, max: 3, step: 0.025, unit: '' },
      { var: '--line-height-normal', type: 'range', default: 1.625, min: 0.8, max: 3, step: 0.025, unit: '' },
      { var: '--line-height-relaxed', type: 'range', default: 1.75, min: 0.8, max: 3, step: 0.025, unit: '' },
      { var: '--line-height-loose', type: 'range', default: 2, min: 0.8, max: 3, step: 0.025, unit: '' },
    ]
  },
  {
    name: 'Letter Spacing',
    collapsed: true,
    tokens: [
      { var: '--letter-spacing-tighter', type: 'range', default: -0.03, min: -0.1, max: 0.15, step: 0.005, unit: 'em' },
      { var: '--letter-spacing-tight', type: 'range', default: -0.015, min: -0.1, max: 0.15, step: 0.005, unit: 'em' },
      { var: '--letter-spacing-normal', type: 'range', default: 0, min: -0.1, max: 0.15, step: 0.005, unit: 'em' },
      { var: '--letter-spacing-wide', type: 'range', default: 0.025, min: -0.1, max: 0.15, step: 0.005, unit: 'em' },
      { var: '--letter-spacing-wider', type: 'range', default: 0.05, min: -0.1, max: 0.15, step: 0.005, unit: 'em' },
    ]
  },
  {
    name: 'Base Spacing',
    collapsed: true,
    tokens: [
      { var: '--spacing-0', type: 'range', default: 0, min: 0, max: 16, step: 1, unit: 'px' },
      { var: '--spacing-0_5', type: 'range', default: 2, min: 0, max: 16, step: 1, unit: 'px' },
      { var: '--spacing-1', type: 'range', default: 4, min: 0, max: 32, step: 1, unit: 'px' },
      { var: '--spacing-2', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px' },
      { var: '--spacing-3', type: 'range', default: 12, min: 0, max: 48, step: 1, unit: 'px' },
      { var: '--spacing-4', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--spacing-5', type: 'range', default: 20, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--spacing-6', type: 'range', default: 24, min: 0, max: 96, step: 1, unit: 'px' },
      { var: '--spacing-8', type: 'range', default: 32, min: 0, max: 128, step: 1, unit: 'px' },
      { var: '--spacing-10', type: 'range', default: 40, min: 0, max: 160, step: 1, unit: 'px' },
      { var: '--spacing-12', type: 'range', default: 48, min: 0, max: 192, step: 1, unit: 'px' },
      { var: '--spacing-16', type: 'range', default: 64, min: 0, max: 256, step: 1, unit: 'px' },
      { var: '--spacing-20', type: 'range', default: 80, min: 0, max: 320, step: 1, unit: 'px' },
      { var: '--spacing-24', type: 'range', default: 96, min: 0, max: 384, step: 1, unit: 'px' },
      { var: '--spacing-32', type: 'range', default: 128, min: 0, max: 512, step: 1, unit: 'px' },
      { var: '--spacing-40', type: 'range', default: 160, min: 0, max: 512, step: 1, unit: 'px' },
      { var: '--spacing-48', type: 'range', default: 192, min: 0, max: 512, step: 1, unit: 'px' },
      { var: '--spacing-64', type: 'range', default: 256, min: 0, max: 512, step: 1, unit: 'px' },
    ]
  },
  {
    name: 'Semantic Spacing',
    collapsed: true,
    tokens: [
      { var: '--spacing-card-padding', type: 'range', default: 24, min: 0, max: 96, step: 1, unit: 'px' },
      { var: '--spacing-card-gap', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--spacing-section-y', type: 'range', default: 64, min: 0, max: 256, step: 1, unit: 'px' },
      { var: '--spacing-section-y-lg', type: 'range', default: 96, min: 0, max: 384, step: 1, unit: 'px' },
      { var: '--spacing-page-x', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--spacing-page-x-lg', type: 'range', default: 32, min: 0, max: 128, step: 1, unit: 'px' },
      { var: '--spacing-stack-sm', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px' },
      { var: '--spacing-stack-md', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--spacing-stack-lg', type: 'range', default: 32, min: 0, max: 128, step: 1, unit: 'px' },
      { var: '--spacing-inline-sm', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px' },
      { var: '--spacing-inline-md', type: 'range', default: 12, min: 0, max: 48, step: 1, unit: 'px' },
      { var: '--spacing-inline-lg', type: 'range', default: 24, min: 0, max: 96, step: 1, unit: 'px' },
      { var: '--spacing-input-x', type: 'range', default: 12, min: 0, max: 48, step: 1, unit: 'px' },
      { var: '--spacing-input-y', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px' },
      { var: '--spacing-button-x', type: 'range', default: 24, min: 0, max: 96, step: 1, unit: 'px' },
      { var: '--spacing-button-y', type: 'range', default: 12, min: 0, max: 48, step: 1, unit: 'px' },
    ]
  },
  {
    name: 'Containers / Max-Width',
    collapsed: true,
    tokens: [
      { var: '--container-xs', type: 'range', default: 320, min: 200, max: 600, step: 8, unit: 'px' },
      { var: '--container-sm', type: 'range', default: 568, min: 320, max: 960, step: 8, unit: 'px' },
      { var: '--container-md', type: 'range', default: 960, min: 600, max: 1400, step: 8, unit: 'px' },
      { var: '--container-lg', type: 'range', default: 1400, min: 960, max: 2000, step: 8, unit: 'px' },
      { var: '--container-xl', type: 'range', default: 1536, min: 1200, max: 2400, step: 8, unit: 'px' },
    ]
  },
  {
    name: 'Base Radius',
    collapsed: true,
    tokens: [
      { var: '--radius-none', type: 'range', default: 0, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-sm', type: 'range', default: 4, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-md', type: 'range', default: 8, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-lg', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-xl', type: 'range', default: 32, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-full', type: 'range', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
    ]
  },
  {
    name: 'Semantic Radius',
    collapsed: true,
    tokens: [
      { var: '--radius-button', type: 'range', default: 8, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-card', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-input', type: 'range', default: 8, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-badge', type: 'range', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
      { var: '--radius-modal', type: 'range', default: 32, min: 0, max: 64, step: 1, unit: 'px' },
      { var: '--radius-tooltip', type: 'range', default: 4, min: 0, max: 64, step: 1, unit: 'px' },
    ]
  },
  {
    name: 'Base Shadows',
    collapsed: true,
    tokens: [
      { var: '--shadow-sm', type: 'text', default: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)' },
      { var: '--shadow-md', type: 'text', default: '0 2px 4px -1px rgba(0,0,0,0.04), 0 4px 8px -1px rgba(0,0,0,0.08)' },
      { var: '--shadow-lg', type: 'text', default: '0 4px 8px -2px rgba(0,0,0,0.06), 0 12px 24px -4px rgba(0,0,0,0.10)' },
      { var: '--shadow-xl', type: 'text', default: '0 8px 16px -4px rgba(0,0,0,0.06), 0 24px 48px -8px rgba(0,0,0,0.12)' },
    ]
  },
  {
    name: 'Semantic Shadows',
    collapsed: true,
    tokens: [
      { var: '--shadow-card', type: 'text', default: 'var(--shadow-sm)' },
      { var: '--shadow-dropdown', type: 'text', default: 'var(--shadow-md)' },
      { var: '--shadow-modal', type: 'text', default: 'var(--shadow-xl)' },
      { var: '--shadow-toast', type: 'text', default: 'var(--shadow-lg)' },
    ]
  },
  {
    name: 'Motion — Durations',
    collapsed: true,
    tokens: [
      { var: '--duration-fast', type: 'range', default: 100, min: 0, max: 2000, step: 10, unit: 'ms' },
      { var: '--duration-default', type: 'range', default: 200, min: 0, max: 2000, step: 10, unit: 'ms' },
      { var: '--duration-slow', type: 'range', default: 300, min: 0, max: 2000, step: 10, unit: 'ms' },
      { var: '--duration-slower', type: 'range', default: 500, min: 0, max: 2000, step: 10, unit: 'ms' },
    ]
  },
  {
    name: 'Motion — Easing',
    collapsed: true,
    tokens: [
      { var: '--ease-default', type: 'text', default: 'ease-in-out' },
      { var: '--ease-in', type: 'text', default: 'ease-in' },
      { var: '--ease-out', type: 'text', default: 'ease-out' },
    ]
  },
  {
    name: 'Animations',
    collapsed: true,
    tokens: [
      { var: '--animate-fade-in', type: 'text', default: 'fade-in var(--duration-default) var(--ease-default)' },
      { var: '--animate-fade-out', type: 'text', default: 'fade-out var(--duration-default) var(--ease-default)' },
    ]
  },
  {
    name: 'Font Families',
    collapsed: false,
    tokens: [
      {
        var: '--font-sans',
        type: 'font',
        default: "'Roboto', ui-sans-serif, system-ui, sans-serif",
        options: [
          { label: 'Roboto', value: "'Roboto', ui-sans-serif, system-ui, sans-serif", google: 'Roboto:wght@100..900' },
          { label: 'Inter', value: "'Inter', ui-sans-serif, system-ui, sans-serif", google: 'Inter:wght@100..900' },
          { label: 'Open Sans', value: "'Open Sans', ui-sans-serif, system-ui, sans-serif", google: 'Open+Sans:wght@300..800' },
          { label: 'Poppins', value: "'Poppins', ui-sans-serif, system-ui, sans-serif", google: 'Poppins:wght@100;200;300;400;500;600;700;800;900' },
          { label: 'Montserrat', value: "'Montserrat', ui-sans-serif, system-ui, sans-serif", google: 'Montserrat:wght@100..900' },
          { label: 'Lato', value: "'Lato', ui-sans-serif, system-ui, sans-serif", google: 'Lato:wght@100;300;400;700;900' },
          { label: 'Nunito', value: "'Nunito', ui-sans-serif, system-ui, sans-serif", google: 'Nunito:wght@200..1000' },
          { label: 'Raleway', value: "'Raleway', ui-sans-serif, system-ui, sans-serif", google: 'Raleway:wght@100..900' },
          { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif", google: 'Plus+Jakarta+Sans:wght@200..800' },
          { label: 'DM Sans', value: "'DM Sans', ui-sans-serif, system-ui, sans-serif", google: 'DM+Sans:wght@100..1000' },
          { label: 'Quicksand', value: "'Quicksand', ui-sans-serif, system-ui, sans-serif", google: 'Quicksand:wght@300..700' },
          { label: 'Outfit', value: "'Outfit', ui-sans-serif, system-ui, sans-serif", google: 'Outfit:wght@100..900' },
          { label: 'Rubik', value: "'Rubik', ui-sans-serif, system-ui, sans-serif", google: 'Rubik:wght@300..900' },
          { label: 'Manrope', value: "'Manrope', ui-sans-serif, system-ui, sans-serif", google: 'Manrope:wght@200..800' },
          { label: 'Source Sans 3', value: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif", google: 'Source+Sans+3:wght@200..900' },
          { label: 'Noto Sans', value: "'Noto Sans', ui-sans-serif, system-ui, sans-serif", google: 'Noto+Sans:wght@100..900' },
          { label: 'Work Sans', value: "'Work Sans', ui-sans-serif, system-ui, sans-serif", google: 'Work+Sans:wght@100..900' },
          { label: 'Sora', value: "'Sora', ui-sans-serif, system-ui, sans-serif", google: 'Sora:wght@100..800' },
          { label: 'System UI', value: 'ui-sans-serif, system-ui, -apple-system, sans-serif', google: null },
        ]
      },
      {
        var: '--font-mono',
        type: 'font',
        default: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace",
        options: [
          { label: 'System Mono', value: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", google: null },
          { label: 'Fira Code', value: "'Fira Code', ui-monospace, monospace", google: 'Fira+Code:wght@300..700' },
          { label: 'JetBrains Mono', value: "'JetBrains Mono', ui-monospace, monospace", google: 'JetBrains+Mono:wght@100..800' },
          { label: 'Source Code Pro', value: "'Source Code Pro', ui-monospace, monospace", google: 'Source+Code+Pro:wght@200..900' },
          { label: 'IBM Plex Mono', value: "'IBM Plex Mono', ui-monospace, monospace", google: 'IBM+Plex+Mono:wght@100..700' },
          { label: 'Space Mono', value: "'Space Mono', ui-monospace, monospace", google: 'Space+Mono:wght@400;700' },
          { label: 'Inconsolata', value: "'Inconsolata', ui-monospace, monospace", google: 'Inconsolata:wght@200..900' },
        ]
      },
    ]
  },
  {
    name: 'Z-Index',
    collapsed: true,
    tokens: [
      { var: '--z-behind', type: 'range', default: -1, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-base', type: 'range', default: 0, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-raised', type: 'range', default: 1, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-dropdown', type: 'range', default: 10, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-sticky', type: 'range', default: 20, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-header', type: 'range', default: 30, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-sidebar', type: 'range', default: 35, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-backdrop', type: 'range', default: 40, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-modal', type: 'range', default: 50, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-popover', type: 'range', default: 60, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-toast', type: 'range', default: 70, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-tooltip', type: 'range', default: 80, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-spotlight', type: 'range', default: 90, min: -10, max: 200, step: 1, unit: '' },
      { var: '--z-max', type: 'range', default: 100, min: -10, max: 200, step: 1, unit: '' },
    ]
  },
  {
    name: 'Breakpoints',
    collapsed: true,
    tokens: [
      { var: '--breakpoint-xs', type: 'range', default: 320, min: 200, max: 600, step: 8, unit: 'px' },
      { var: '--breakpoint-sm', type: 'range', default: 568, min: 320, max: 960, step: 8, unit: 'px' },
      { var: '--breakpoint-md', type: 'range', default: 960, min: 600, max: 1400, step: 8, unit: 'px' },
      { var: '--breakpoint-lg', type: 'range', default: 1280, min: 960, max: 2000, step: 8, unit: 'px' },
      { var: '--breakpoint-xl', type: 'range', default: 1536, min: 1200, max: 2400, step: 8, unit: 'px' },
    ]
  },
];

/**
 * Component-specific tokens (Button, Card, Input, Badge, Nav)
 */
export const componentEditors: ComponentEditor[] = [
  {
    id: 'btn',
    name: 'Buttons',
    icon: '▣',
    tokens: [
      { var: '--btn-bg', type: 'color', default: '#cc9900', label: 'Background' },
      { var: '--btn-text', type: 'color', default: '#ffffff', label: 'Text Color' },
      { var: '--radius-button', type: 'range', default: 8, min: 0, max: 64, step: 1, unit: 'px', label: 'Radius' },
      { var: '--btn-border-width', type: 'range', default: 0, min: 0, max: 8, step: 1, unit: 'px', label: 'Border Width' },
      { var: '--btn-border-color', type: 'color', default: '#cc9900', label: 'Border Color' },
      { var: '--spacing-button-x', type: 'range', default: 24, min: 0, max: 64, step: 1, unit: 'px', label: 'Padding X' },
      { var: '--spacing-button-y', type: 'range', default: 12, min: 0, max: 32, step: 1, unit: 'px', label: 'Padding Y' },
      { var: '--btn-font-size', type: 'range', default: 0.875, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Font Size' },
      { var: '--btn-font-weight', type: 'range', default: 600, min: 100, max: 900, step: 100, unit: '', label: 'Font Weight' },
      { var: '--btn-shadow', type: 'text', default: 'none', label: 'Shadow' },
    ],
    outlineTokens: [
      { var: '--btn-outline-bg', type: 'color', default: '#ffffff', label: 'Outline Background' },
      { var: '--btn-outline-text', type: 'color', default: '#cc9900', label: 'Outline Text' },
      { var: '--btn-outline-border-width', type: 'range', default: 2, min: 0, max: 8, step: 1, unit: 'px', label: 'Outline Border Width' },
      { var: '--btn-outline-border-color', type: 'color', default: '#cc9900', label: 'Outline Border Color' },
    ],
  },
  {
    id: 'card',
    name: 'Cards',
    icon: '▭',
    tokens: [
      { var: '--card-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--radius-card', type: 'range', default: 16, min: 0, max: 64, step: 1, unit: 'px', label: 'Radius' },
      { var: '--card-border-width', type: 'range', default: 1, min: 0, max: 8, step: 1, unit: 'px', label: 'Border Width' },
      { var: '--card-border-color', type: 'color', default: '#e5e5e5', label: 'Border Color' },
      { var: '--spacing-card-padding', type: 'range', default: 24, min: 0, max: 64, step: 1, unit: 'px', label: 'Padding' },
      { var: '--spacing-card-gap', type: 'range', default: 16, min: 0, max: 48, step: 1, unit: 'px', label: 'Gap' },
      { var: '--shadow-card', type: 'text', default: 'var(--shadow-sm)', label: 'Shadow' },
      { var: '--card-title-size', type: 'range', default: 0.875, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Title Size' },
      { var: '--card-title-weight', type: 'range', default: 700, min: 100, max: 900, step: 100, unit: '', label: 'Title Weight' },
      { var: '--card-price-color', type: 'color', default: '#111827', label: 'Price Color' },
      { var: '--card-price-size', type: 'range', default: 15, min: 10, max: 28, step: 1, unit: 'px', label: 'Price Size' },
      { var: '--card-price-weight', type: 'range', default: 700, min: 100, max: 900, step: 100, unit: '', label: 'Price Weight' },
      { var: '--card-moq-color', type: 'color', default: '#6b7280', label: 'MOQ Color' },
      { var: '--card-moq-size', type: 'range', default: 11, min: 8, max: 16, step: 1, unit: 'px', label: 'MOQ Size' },
      { var: '--card-badge-bg', type: 'color', default: '#FFF3E0', label: 'Badge BG' },
      { var: '--card-badge-text', type: 'color', default: '#e65100', label: 'Badge Text' },
      { var: '--card-badge-size', type: 'range', default: 10, min: 8, max: 14, step: 1, unit: 'px', label: 'Badge Size' },
      { var: '--card-badge-radius', type: 'range', default: 4, min: 0, max: 16, step: 1, unit: 'px', label: 'Badge Radius' },
      { var: '--card-verified-color', type: 'color', default: '#cc9900', label: 'Verified Color' },
      { var: '--card-verified-size', type: 'range', default: 11, min: 8, max: 16, step: 1, unit: 'px', label: 'Verified Size' },
      { var: '--card-supplier-color', type: 'color', default: '#9ca3af', label: 'Supplier Color' },
      { var: '--card-supplier-size', type: 'range', default: 11, min: 8, max: 16, step: 1, unit: 'px', label: 'Supplier Size' },
    ],
  },
  {
    id: 'input',
    name: 'Input / Search',
    icon: '▬',
    tokens: [
      { var: '--input-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--input-text-color', type: 'color', default: '#0a0a0a', label: 'Text Color' },
      { var: '--radius-input', type: 'range', default: 8, min: 0, max: 64, step: 1, unit: 'px', label: 'Radius' },
      { var: '--input-border-width', type: 'range', default: 1, min: 0, max: 8, step: 1, unit: 'px', label: 'Border Width' },
      { var: '--input-border-color', type: 'color', default: '#e5e5e5', label: 'Border Color' },
      { var: '--input-focus-border-color', type: 'color', default: '#cc9900', label: 'Focus Border' },
      { var: '--spacing-input-x', type: 'range', default: 12, min: 0, max: 48, step: 1, unit: 'px', label: 'Padding X' },
      { var: '--spacing-input-y', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px', label: 'Padding Y' },
      { var: '--input-font-size', type: 'range', default: 0.875, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Font Size' },
    ],
  },
  {
    id: 'badge',
    name: 'Badge / Label',
    icon: '●',
    tokens: [
      { var: '--radius-badge', type: 'range', default: 9999, min: 0, max: 9999, step: 1, unit: 'px', label: 'Radius' },
      { var: '--badge-font-size', type: 'range', default: 0.75, min: 0.5, max: 1.5, step: 0.0625, unit: 'rem', label: 'Font Size' },
      { var: '--badge-font-weight', type: 'range', default: 600, min: 100, max: 900, step: 100, unit: '', label: 'Font Weight' },
      { var: '--badge-padding-x', type: 'range', default: 12, min: 0, max: 32, step: 1, unit: 'px', label: 'Padding X' },
      { var: '--badge-padding-y', type: 'range', default: 4, min: 0, max: 16, step: 1, unit: 'px', label: 'Padding Y' },
    ],
  },
];

/**
 * Page section tokens (Header, SubHeader, SearchArea, MegaMenu, Hero, Footer)
 */
export const sectionEditors: SectionEditor[] = [
  {
    id: 'section-header',
    name: 'Header / TopBar',
    icon: '▔',
    tokens: [
      { var: '--header-bg', type: 'color', default: 'transparent', label: 'Background' },
      { var: '--header-scroll-bg', type: 'color', default: '#ffffff', label: 'Scroll Background' },
      { var: '--header-scroll-border', type: 'color', default: '#e5e5e5', label: 'Scroll Border' },
      { var: '--header-height', type: 'range', default: 64, min: 40, max: 100, step: 1, unit: 'px', label: 'Height' },
      { var: '--header-border-color', type: 'color', default: 'transparent', label: 'Bottom Border' },
      { var: '--header-text-color', type: 'color', default: '#374151', label: 'Text Color' },
      { var: '--header-icon-color', type: 'color', default: '#374151', label: 'Icon Color' },
      { var: '--header-icon-hover-color', type: 'color', default: '#cc9900', label: 'Icon Hover' },
    ],
  },
  {
    id: 'section-subheader',
    name: 'SubHeader / Navigation',
    icon: '≡',
    tokens: [
      { var: '--subheader-bg', type: 'color', default: 'transparent', label: 'Background' },
      { var: '--subheader-border-color', type: 'color', default: 'transparent', label: 'Bottom Border' },
      { var: '--nav-font-size', type: 'range', default: 0.8125, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Font Size' },
      { var: '--nav-font-weight', type: 'range', default: 300, min: 100, max: 900, step: 100, unit: '', label: 'Font Weight' },
      { var: '--subheader-text-color', type: 'color', default: '#000000', label: 'Text Color' },
      { var: '--subheader-hover-color', type: 'color', default: '#a3a3a3', label: 'Hover Color' },
      { var: '--subheader-hover-bg', type: 'text', default: 'rgba(255, 255, 255, 0.8)', label: 'Hover Background' },
      { var: '--subheader-active-color', type: 'color', default: '#000000', label: 'Active Color' },
      { var: '--nav-text-color', type: 'color', default: '#000000', label: 'Nav Text Color' },
      { var: '--nav-hover-color', type: 'color', default: '#b38600', label: 'Nav Hover Color' },
    ],
  },
  {
    id: 'section-search',
    name: 'Search Area',
    icon: '⌕',
    tokens: [
      { var: '--search-bg', type: 'color', default: 'transparent', label: 'Background' },
      { var: '--search-tab-color', type: 'color', default: '#6b7280', label: 'Tab Color' },
      { var: '--search-tab-active-color', type: 'color', default: '#cc9900', label: 'Active Tab' },
      { var: '--search-input-border-color', type: 'color', default: '#cc9900', label: 'Input Border' },
      { var: '--search-btn-gradient-start', type: 'color', default: '#f5a623', label: 'Button Gradient Start' },
      { var: '--search-btn-gradient-end', type: 'color', default: '#e8740c', label: 'Button Gradient End' },
      { var: '--search-box-bg', type: 'color', default: '#ffffff', label: 'Search Box BG' },
      { var: '--search-input-text', type: 'color', default: '#111827', label: 'Input Text' },
      { var: '--search-image-link-color', type: 'color', default: '#6b7280', label: 'Image Search Link' },
      { var: '--search-dropdown-bg', type: 'color', default: '#ffffff', label: 'Dropdown BG' },
      { var: '--search-dropdown-border', type: 'color', default: '#fcd34d', label: 'Dropdown Border' },
      { var: '--search-dropdown-text', type: 'color', default: '#374151', label: 'Dropdown Text' },
      { var: '--search-dropdown-muted', type: 'color', default: '#9ca3af', label: 'Dropdown Muted' },
      { var: '--search-chip-bg', type: 'color', default: '#f9fafb', label: 'Chip BG' },
      { var: '--search-chip-text', type: 'color', default: '#4b5563', label: 'Chip Text' },
      { var: '--search-chip-border', type: 'color', default: '#e5e7eb', label: 'Chip Border' },
      { var: '--search-chip-hover-bg', type: 'color', default: '#f3f4f6', label: 'Chip Hover BG' },
      { var: '--search-chip-accent', type: 'color', default: '#fbbf24', label: 'Chip Accent' },
      { var: '--search-welcome-bg', type: 'color', default: '#f8f8f8', label: 'Welcome Bar BG' },
      { var: '--search-welcome-text', type: 'color', default: '#111827', label: 'Welcome Text' },
    ],
  },
  {
    id: 'section-gradient',
    name: 'Header Gradient',
    icon: '◑',
    tokens: [
      { var: '--header-gradient-1', type: 'color', default: '#fff7ed', label: 'Color 1 (0%)' },
      { var: '--header-gradient-2', type: 'color', default: '#f6f4e8', label: 'Color 2 (25%)' },
      { var: '--header-gradient-3', type: 'color', default: '#fff1f2', label: 'Color 3 (50%)' },
      { var: '--header-gradient-4', type: 'color', default: '#fbfaf0', label: 'Color 4 (75%)' },
      { var: '--header-gradient-5', type: 'color', default: '#fff7ed', label: 'Color 5 (100%)' },
    ],
  },
  {
    id: 'section-mega',
    name: 'MegaMenu',
    icon: '▤',
    tokens: [
      { var: '--mega-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--mega-sidebar-bg', type: 'color', default: '#f9fafb', label: 'Sidebar Background' },
      { var: '--mega-sidebar-hover-bg', type: 'color', default: '#ffffff', label: 'Sidebar Hover' },
      { var: '--mega-sidebar-active-bg', type: 'color', default: '#ffffff', label: 'Sidebar Active' },
      { var: '--mega-border-color', type: 'color', default: '#e5e7eb', label: 'Border Color' },
      { var: '--mega-text-color', type: 'color', default: '#0a0a0a', label: 'Text Color' },
      { var: '--mega-font-size', type: 'range', default: 0.8125, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Font Size' },
      { var: '--mega-font-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Font Weight' },
      { var: '--mega-heading-color', type: 'color', default: '#0a0a0a', label: 'Heading Color' },
      { var: '--mega-body-text', type: 'color', default: '#6b7280', label: 'Body Text' },
      { var: '--mega-link-color', type: 'color', default: '#000000', label: 'Link Color' },
      { var: '--mega-link-hover-color', type: 'color', default: '#b38600', label: 'Link Hover' },
      { var: '--mega-icon-color', type: 'color', default: '#6b7280', label: 'Icon Color' },
      { var: '--mega-icon-bg', type: 'color', default: '#f3f4f6', label: 'Icon Background' },
      { var: '--mega-accent-color', type: 'color', default: '#ff0040', label: 'Accent Color' },
      { var: '--mega-accent-bg', type: 'color', default: '#37ff00', label: 'Accent Background' },
      { var: '--mega-card-hover-border', type: 'color', default: '#fcd34d', label: 'Card Hover Border' },
      { var: '--mega-sidebar-active-border', type: 'color', default: '#e1b533', label: 'Sidebar Active Border' },
    ],
  },
  {
    id: 'section-hero',
    name: 'Hero',
    icon: '▣',
    tokens: [
      { var: '--hero-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--hero-card-bg', type: 'color', default: '#ffffff', label: 'Card Background' },
      { var: '--hero-card-border-color', type: 'color', default: '#e5e5e5', label: 'Card Border' },
      { var: '--hero-title-color', type: 'color', default: '#111827', label: 'Title Color' },
    ],
  },
  {
    id: 'section-mfr-hero',
    name: 'Manufacturers Hero',
    icon: '🏭',
    tokens: [
      { var: '--mfr-hero-card-bg', type: 'color', default: '#ffffff', label: 'Card BG' },
      { var: '--mfr-hero-card-radius', type: 'range', default: 6, min: 0, max: 24, step: 1, unit: 'px', label: 'Card Radius' },
      { var: '--mfr-sidebar-bg', type: 'color', default: '#ffffff', label: 'Sidebar BG' },
      { var: '--mfr-sidebar-heading-color', type: 'color', default: '#111827', label: 'Sidebar Heading' },
      { var: '--mfr-sidebar-text-color', type: 'color', default: '#374151', label: 'Sidebar Text' },
      { var: '--mfr-sidebar-hover-bg', type: 'color', default: '#f9fafb', label: 'Sidebar Hover BG' },
      { var: '--mfr-flyout-bg', type: 'color', default: '#f4f4f4', label: 'Flyout BG' },
      { var: '--mfr-flyout-link-color', type: 'color', default: '#767676', label: 'Flyout Link' },
      { var: '--mfr-sample-heading-color', type: 'color', default: '#222222', label: 'Sample Heading' },
      { var: '--mfr-sample-label-color', type: 'color', default: '#666666', label: 'Sample Label' },
      { var: '--mfr-sample-img-bg', type: 'color', default: '#f5f5f5', label: 'Sample Image BG' },
      { var: '--mfr-ranking-heading-color', type: 'color', default: '#222222', label: 'Ranking Heading' },
      { var: '--mfr-ranking-label-color', type: 'color', default: '#666666', label: 'Ranking Label' },
      { var: '--mfr-profile-text-color', type: 'color', default: '#222222', label: 'Profile Text' },
      { var: '--mfr-profile-btn-bg', type: 'color', default: '#cc9900', label: 'Button BG' },
      { var: '--mfr-profile-btn-hover', type: 'color', default: '#8a6800', label: 'Button Hover' },
      { var: '--mfr-profile-btn-text', type: 'color', default: '#ffffff', label: 'Button Text' },
      { var: '--mfr-profile-rfq-border', type: 'color', default: '#222222', label: 'RFQ Border' },
    ],
  },
  {
    id: 'section-catpopup',
    name: 'Category Popup',
    icon: '▦',
    tokens: [
      { var: '--catpopup-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--catpopup-border', type: 'color', default: '#e5e7eb', label: 'Border Color' },
      { var: '--catpopup-heading', type: 'color', default: '#111827', label: 'Heading Color' },
      { var: '--catpopup-text', type: 'color', default: '#4b5563', label: 'Text Color' },
      { var: '--catpopup-link', type: 'color', default: '#cc9900', label: 'Link Color' },
      { var: '--catpopup-link-hover', type: 'color', default: '#b38600', label: 'Link Hover' },
      { var: '--catpopup-icon', type: 'color', default: '#9ca3af', label: 'Icon Color' },
      { var: '--catpopup-product-bg', type: 'color', default: '#f3f4f6', label: 'Product Circle BG' },
      { var: '--catpopup-close-color', type: 'color', default: '#9ca3af', label: 'Close Button' },
    ],
  },
  {
    id: 'section-catbrowse',
    name: 'Category Browse',
    icon: '☰',
    tokens: [
      { var: '--catpopup-sidebar-bg', type: 'color', default: '#f9fafb', label: 'Background' },
      { var: '--catpopup-sidebar-hover-bg', type: 'color', default: '#f3f4f6', label: 'Hover BG' },
      { var: '--catpopup-sidebar-active-bg', type: 'color', default: '#ffffff', label: 'Active BG' },
      { var: '--catpopup-sidebar-active-border', type: 'color', default: '#cc9900', label: 'Active Border' },
      { var: '--catpopup-text', type: 'color', default: '#4b5563', label: 'Text Color' },
      { var: '--catpopup-icon', type: 'color', default: '#9ca3af', label: 'Icon Color' },
      { var: '--catpopup-sidebar-font-size', type: 'range', default: 0.6875, min: 0.5, max: 2, step: 0.0625, unit: 'rem', label: 'Font Size' },
      { var: '--catpopup-sidebar-font-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Font Weight' },
      { var: '--catpopup-sidebar-padding-x', type: 'range', default: 0.125, min: 0, max: 3, step: 0.125, unit: 'rem', label: 'Padding X' },
      { var: '--catpopup-sidebar-padding-y', type: 'range', default: 0.25, min: 0, max: 2, step: 0.125, unit: 'rem', label: 'Padding Y' },
    ],
  },
  {
    id: 'section-topdeals',
    name: 'Top Deals',
    icon: '🏷',
    tokens: [
      { var: '--topdeals-bg', type: 'color', default: '#F8F8F8', label: 'Background' },
      { var: '--topdeals-title-color', type: 'color', default: '#111827', label: 'Title Color' },
      { var: '--topdeals-subtitle-color', type: 'color', default: '#6b7280', label: 'Subtitle Color' },
      { var: '--topdeals-link-color', type: 'color', default: '#111827', label: 'Link Color' },
      { var: '--topdeals-card-bg', type: 'color', default: '#ffffff', label: 'Card Background' },
      { var: '--topdeals-card-border', type: 'color', default: '#e5e5e5', label: 'Card Border' },
      { var: '--topdeals-price-color', type: 'color', default: '#dc2626', label: 'Price Color' },
      { var: '--topdeals-original-price-color', type: 'color', default: '#9ca3af', label: 'Original Price' },
      { var: '--topdeals-moq-color', type: 'color', default: '#222222', label: 'MOQ Color' },
      { var: '--topdeals-badge-bg', type: 'color', default: '#DE0505', label: 'Badge Background' },
      { var: '--topdeals-price-bg', type: 'color', default: '#FFEDED', label: 'Price Background' },
      { var: '--topdeals-badge-text', type: 'color', default: '#ffffff', label: 'Badge Text' },
    ],
  },
  {
    id: 'section-topranking',
    name: 'Top Ranking',
    icon: '🏆',
    tokens: [
      { var: '--topranking-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--topranking-title-color', type: 'color', default: '#111827', label: 'Title Color' },
      { var: '--topranking-subtitle-color', type: 'color', default: '#6b7280', label: 'Subtitle Color' },
      { var: '--topranking-link-color', type: 'color', default: '#111827', label: 'Link Color' },
      { var: '--topranking-card-bg', type: 'color', default: '#f3f4f6', label: 'Card Background' },
      { var: '--topranking-card-border', type: 'color', default: '#e5e5e5', label: 'Card Border' },
      { var: '--topranking-badge-bg', type: 'color', default: '#111827', label: 'Badge Background' },
      { var: '--topranking-badge-text', type: 'color', default: '#ffffff', label: 'Badge Text' },
      { var: '--topranking-name-color', type: 'color', default: '#111827', label: 'Name Color' },
      { var: '--topranking-label-color', type: 'color', default: '#6b7280', label: 'Label Color' },
    ],
  },
  {
    id: 'section-tailored',
    name: 'Tailored Selections',
    icon: '✦',
    tokens: [
      { var: '--tailored-bg', type: 'color', default: '#ffffff', label: 'Background' },
      { var: '--tailored-title-color', type: 'color', default: '#111827', label: 'Title Color' },
      { var: '--tailored-link-color', type: 'color', default: '#111827', label: 'Link Color' },
      { var: '--tailored-card-bg', type: 'color', default: '#ffffff', label: 'Card Background' },
      { var: '--tailored-card-border', type: 'color', default: '#e5e5e5', label: 'Card Border' },
      { var: '--tailored-collection-title-color', type: 'color', default: '#111827', label: 'Collection Title' },
      { var: '--tailored-views-color', type: 'color', default: '#6b7280', label: 'Views Color' },
      { var: '--tailored-price-color', type: 'color', default: '#111827', label: 'Price Color' },
    ],
  },
  {
    id: 'section-productgrid',
    name: 'Product Grid',
    icon: '▦',
    tokens: [
      { var: '--product-bg', type: 'color', default: '#f4f4f4', label: 'Section Background' },
      { var: '--product-card-bg', type: 'color', default: '#ffffff', label: 'Card Background' },
      { var: '--product-card-border', type: 'color', default: '#e5e7eb', label: 'Card Border Color' },
      { var: '--product-card-radius', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px', label: 'Card Radius' },
      { var: '--product-card-padding', type: 'range', default: 12, min: 4, max: 32, step: 1, unit: 'px', label: 'Card Padding' },
      { var: '--product-card-min-height', type: 'range', default: 384, min: 260, max: 520, step: 1, unit: 'px', label: 'Card Min Height' },
      { var: '--product-card-border-width', type: 'range', default: 0, min: 0, max: 4, step: 1, unit: 'px', label: 'Card Border Width' },
      { var: '--product-card-shadow', type: 'text', default: 'none', label: 'Card Shadow' },
      { var: '--product-card-hover-shadow', type: 'text', default: 'none', label: 'Card Hover Shadow' },
      { var: '--product-grid-gap', type: 'range', default: 8, min: 4, max: 32, step: 1, unit: 'px', label: 'Grid Gap' },
      { var: '--product-font-family', type: 'text', default: 'Alibaba_B2B_Sans, Inter, "SF Pro Text", Roboto, "Helvetica Neue", Helvetica, Tahoma, Arial, "PingFang SC", "Microsoft YaHei", sans-serif', label: 'Card Font Family' },
      { var: '--product-image-bg', type: 'color', default: '#ffffff', label: 'Image Background' },
      { var: '--product-image-radius', type: 'range', default: 8, min: 0, max: 32, step: 1, unit: 'px', label: 'Image Radius' },
      { var: '--product-image-padding', type: 'range', default: 0, min: 0, max: 32, step: 1, unit: 'px', label: 'Image Padding' },
      { var: '--product-image-size', type: 'range', default: 209, min: 120, max: 320, step: 1, unit: 'px', label: 'Image Size' },
      { var: '--product-lens-size', type: 'range', default: 36, min: 24, max: 80, step: 1, unit: 'px', label: 'Lens Size' },
      { var: '--product-lens-bg', type: 'color', default: '#ffffff', label: 'Lens Background' },
      { var: '--product-lens-color', type: 'color', default: '#4b5563', label: 'Lens Icon Color' },
      { var: '--product-lens-shadow', type: 'text', default: '0 2px 6px 2px rgba(0, 0, 0, 0.12)', label: 'Lens Shadow' },
      { var: '--product-title-color', type: 'color', default: '#222222', label: 'Title Color' },
      { var: '--product-title-size', type: 'range', default: 14, min: 10, max: 24, step: 1, unit: 'px', label: 'Title Size' },
      { var: '--product-title-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Title Weight' },
      { var: '--product-title-line-height', type: 'range', default: 1.2857, min: 1, max: 2, step: 0.0001, unit: '', label: 'Title Line Height' },
      { var: '--product-title-letter-spacing', type: 'range', default: 0, min: -0.08, max: 0.1, step: 0.001, unit: 'em', label: 'Title Letter Spacing' },
      { var: '--product-price-color', type: 'color', default: '#0a0a0a', label: 'Price Color' },
      { var: '--product-price-size', type: 'range', default: 20, min: 12, max: 32, step: 1, unit: 'px', label: 'Price Size' },
      { var: '--product-price-weight', type: 'range', default: 700, min: 100, max: 900, step: 100, unit: '', label: 'Price Weight' },
      { var: '--product-price-line-height', type: 'range', default: 26, min: 16, max: 40, step: 1, unit: 'px', label: 'Price Line Height' },
      { var: '--product-moq-color', type: 'color', default: '#000000', label: 'MOQ Color' },
      { var: '--product-moq-size', type: 'range', default: 14, min: 8, max: 16, step: 1, unit: 'px', label: 'MOQ Size' },
      { var: '--product-moq-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'MOQ Weight' },
      { var: '--product-stats-color', type: 'color', default: '#767676', label: 'Stats Color' },
      { var: '--product-stats-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Stats Weight' },
      { var: '--product-badge-bg', type: 'text', default: 'transparent', label: 'Promo Badge BG' },
      { var: '--product-badge-text', type: 'color', default: '#ff4d12', label: 'Promo Badge Text' },
      { var: '--product-badge-size', type: 'range', default: 13, min: 8, max: 16, step: 1, unit: 'px', label: 'Badge Font Size' },
      { var: '--product-badge-radius', type: 'range', default: 3, min: 0, max: 16, step: 1, unit: 'px', label: 'Badge Radius' },
      { var: '--product-verified-color', type: 'color', default: '#0b65c2', label: 'Verified Color' },
      { var: '--product-verified-size', type: 'range', default: 12, min: 8, max: 16, step: 1, unit: 'px', label: 'Verified Size' },
      { var: '--product-verified-weight', type: 'range', default: 700, min: 100, max: 900, step: 100, unit: '', label: 'Verified Weight' },
      { var: '--product-supplier-color', type: 'color', default: '#767676', label: 'Supplier Info Color' },
      { var: '--product-supplier-size', type: 'range', default: 12, min: 8, max: 16, step: 1, unit: 'px', label: 'Supplier Size' },
      { var: '--product-meta-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Meta Weight' },
      { var: '--product-note-color', type: 'color', default: '#3f3f46', label: 'Quote Color' },
      { var: '--product-note-size', type: 'range', default: 12, min: 8, max: 16, step: 1, unit: 'px', label: 'Quote Size' },
      { var: '--product-note-weight', type: 'range', default: 400, min: 100, max: 900, step: 100, unit: '', label: 'Quote Weight' },
    ],
  },
  {
    id: 'section-footer',
    name: 'Footer',
    icon: '▁',
    tokens: [
      { var: '--footer-bg', type: 'color', default: '#111827', label: 'Background' },
      { var: '--footer-text-color', type: 'color', default: '#9ca3af', label: 'Text Color' },
      { var: '--footer-heading-color', type: 'color', default: '#ffffff', label: 'Heading Color' },
      { var: '--footer-link-color', type: 'color', default: '#9ca3af', label: 'Link Color' },
      { var: '--footer-link-hover-color', type: 'color', default: '#ffffff', label: 'Link Hover' },
      { var: '--footer-border-color', type: 'color', default: '#1f2937', label: 'Border Color' },
    ],
  },
];
