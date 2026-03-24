# Specification: Checkout (Odeme) Page — Frontend Specification from Alibaba.com Reference

## Overview

This task produces a **pixel-perfect static Checkout page** that clones the Alibaba.com checkout flow (`biz.alibaba.com/contract/ShoppingCart.htm`). The output is a fully-functional frontend page with 8 interactive components: a shipping address form with float-label inputs, cascading country/state/city dropdowns, form validation, two collapsed accordion sections (Payment Method, Items & Delivery), a sticky order summary sidebar, a scrollable order-protection modal, a geolocation feature, and an address-autocomplete popup. There is **no backend** — all data comes from mock JSON, and form submissions are logged via `console.log`. All client-side interactions (dropdowns, validation, float labels, modal open/close, accordion toggle) must be fully functional.

## Workflow Type

**Type**: feature

**Rationale**: This is a brand-new page being built from scratch (greenfield). It involves creating multiple interactive UI components, complex form logic (cascading dropdowns, float-label animations, validation), a scrollable modal, sticky sidebar layout, and comprehensive mock data — all hallmarks of a substantial feature implementation.

## Task Scope

### Services Involved
- **checkout-frontend** (primary) — Static Vite + TypeScript frontend application; all logic is client-side

### This Task Will:
- [ ] Create a two-column checkout page layout (60% form / 35% sticky sidebar)
- [ ] Build C1: Page Header with "Checkout" H1
- [ ] Build C2: Shipping Address Form with float-label inputs, cascading country > state > city dropdowns, phone composite input, validation
- [ ] Build C3: Payment Method collapsed accordion section
- [ ] Build C4: Items & Delivery Options collapsed accordion section
- [ ] Build C5: Order Summary sticky sidebar with thumbnail grid, price breakdown, protection link, trust icons
- [ ] Build C6: Order Protection scrollable modal (6 sections, 11 payment icons)
- [ ] Build C7: Geolocation feature ("Use my current location" with mock response)
- [ ] Build C8: Address Autocomplete dark popup (saved address suggestion)
- [ ] Create comprehensive mock JSON data (countries, 81 Turkish provinces, district lists, order data, modal content, payment icons)
- [ ] Implement full form validation with red border + "Required" error messages
- [ ] Ensure responsive behavior (desktop 2-col, tablet/mobile single-col)

### Out of Scope:
- Site header and footer (provided by existing shell — use `<!-- SITE HEADER -->` / `<!-- SITE FOOTER -->` placeholders)
- Backend API integration (all data is mock JSON)
- Real payment processing
- Actual geolocation reverse-geocoding (mock address fill)
- Payment Method expanded content (only collapsed state required)
- Items & Delivery expanded content (only collapsed state required)
- Dark mode implementation (tokens noted but not required for this task)
- Unit/integration test files (page is a static demo)

## Service Context

### Checkout Frontend (Greenfield)

**Tech Stack:**
- Language: TypeScript
- Build Tool: Vite 7.x
- CSS Framework: TailwindCSS v4 (`@theme` token system)
- UI Kit: Flowbite (tooltips, modals, checkbox)
- Font: Roboto Variable (Google Fonts, weight 100-900)
- Module System: ES Modules

**Key Directories (to create):**
```
src/
  style.css          — Design tokens + checkout-specific CSS
  main.ts            — Entry point, all interaction logic
  data/
    mock-data.ts     — All mock JSON data (countries, provinces, districts, order, modal, etc.)
  types/
    index.ts         — TypeScript interfaces and types
index.html           — Page shell with Roboto font, #app mount
vite.config.ts       — Vite + TailwindCSS plugin config
package.json         — Dependencies
tsconfig.json        — TypeScript config
```

**Entry Point:** `src/main.ts`

**How to Run:**
```bash
npm install
npm run dev
```

**Port:** 5173 (Vite default)

## Files to Create

| File | Purpose |
|------|---------|
| `index.html` | Page shell — Roboto font import, `<div id="app">`, script import |
| `src/style.css` | TailwindCSS v4 `@theme` design tokens (copied from existing project) + checkout-specific custom CSS (float-label, dropdown, modal) |
| `src/main.ts` | Entry point — DOM rendering, Flowbite init, all interaction handlers (float labels, dropdowns, validation, modal, accordion, geolocation, autocomplete) |
| `src/data/mock-data.ts` | All mock data exports: countries, Turkish provinces (81), districts, order summary, modal sections, payment icons, saved address |
| `src/types/index.ts` | TypeScript interfaces: Country, Province, District, OrderSummary, ModalSection, PaymentIcon, SavedAddress, CheckoutFormData |
| `vite.config.ts` | Vite config with `@tailwindcss/vite` plugin |
| `package.json` | Project metadata + dependencies |
| `tsconfig.json` | TypeScript strict config |

## Files to Reference (Existing Project Patterns)

These files from the existing RFQ page worktree demonstrate patterns to replicate:

| File | Pattern to Copy |
|------|----------------|
| `.auto-claude/worktrees/tasks/001-generate-rfq-page-frontend-specification/src/style.css` | TailwindCSS v4 `@theme` token block structure, Flowbite integration imports, BEM custom class naming |
| `.auto-claude/worktrees/tasks/001-generate-rfq-page-frontend-specification/src/main.ts` | DOMContentLoaded pattern, Flowbite `initFlowbite()`, TypeScript event handlers, `console.info` for form submit |
| `.auto-claude/worktrees/tasks/001-generate-rfq-page-frontend-specification/index.html` | HTML shell: `lang="tr"`, Roboto font preconnect, body classes, `<div id="app">` |
| `.auto-claude/worktrees/tasks/001-generate-rfq-page-frontend-specification/package.json` | Dependency versions: Vite 7, TailwindCSS 4.1, Flowbite 3.1, TypeScript 5.8 |
| `.auto-claude/worktrees/tasks/001-generate-rfq-page-frontend-specification/vite.config.ts` | Vite + `@tailwindcss/vite` plugin setup |

## Patterns to Follow

### Pattern 1: TailwindCSS v4 Theme Tokens

From existing `style.css`:

```css
@import "tailwindcss";
@import "flowbite/src/themes/default";
@plugin "flowbite/plugin";
@source "../node_modules/flowbite";

@theme {
  --color-primary-500: #cc9900;
  --color-error-500: #ef4444;
  --color-text-primary: #111827;
  --color-border-default: #e5e5e5;
  --radius-input: 8px;
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  /* ... full token set ... */
}
```

**Key Points:**
- ALL design values come from `@theme` tokens — never hardcode colors/sizes inline
- Tokens auto-generate Tailwind utilities (e.g. `--color-primary-500` → `bg-primary-500`, `text-primary-500`)
- Custom BEM classes (`.checkout-*`) use `var(--token)` references

### Pattern 2: Entry Point Structure

From existing `main.ts`:

```typescript
import './style.css';
import 'flowbite';
import { initFlowbite } from 'flowbite';
import type { CheckoutFormData } from './types';
import { countries, provinces, orderSummary } from './data/mock-data';

document.addEventListener('DOMContentLoaded', () => {
  initFlowbite();
  // ... all initialization code ...
});
```

**Key Points:**
- Style import first, then Flowbite, then types, then mock data
- All DOM logic inside `DOMContentLoaded`
- Use `console.info()` for form submissions
- TypeScript strict types for all data structures

### Pattern 3: HTML Shell

From existing `index.html`:

```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Checkout | Alibaba</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  </head>
  <body class="font-['Roboto'] antialiased text-text-primary bg-surface">
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Pattern 4: BEM Naming Convention

```css
/* Block */
.checkout-form { }
.checkout-sidebar { }
.checkout-modal { }

/* Element */
.checkout-form__field { }
.checkout-form__label { }
.checkout-sidebar__price-row { }

/* Modifier */
.checkout-form__label--active { }
.checkout-form__field--error { }
.checkout-modal--open { }
```

## Requirements

### Functional Requirements

1. **Two-Column Checkout Layout**
   - Description: Page divided into left form area (~60%) and right sticky sidebar (~35%) with ~32px gap, max-width 1472px container, centered
   - Acceptance: Desktop shows two columns side-by-side; sidebar sticks on scroll; tablet/mobile collapses to single column

2. **Float-Label Form Inputs (C2)**
   - Description: All text inputs and dropdowns use float-label pattern — label sits centered as placeholder when empty, animates up and shrinks (12px) on focus or when filled
   - Acceptance: Every input field shows label animation on focus; label stays up when field has value; label returns to center when field is empty and blurred

3. **Cascading Country > State > City Dropdowns (C2)**
   - Description: Country selection filters state list and updates phone prefix; state selection filters city list and clears city; city dropdown shows state-dependent districts
   - Acceptance: Selecting Turkey shows 81 provinces; selecting Adiyaman shows Besni, Celikhan, Gerger, Golbasi, Kahta, Merkez, Samsat as city options; changing state clears city

4. **Form Validation (C2)**
   - Description: On "Continue to payment" click, all required fields are checked. Empty required fields show red border (`#ef4444`) and "Required" red text below
   - Acceptance: Submitting with empty Phone and Postal code shows red borders + "Required" text on both fields; filling a field and re-submitting clears that field's error

5. **Order Summary Sidebar (C5)**
   - Description: Sticky card with product thumbnails (2x2 grid + "200" badge), line-item price breakdown, "Alibaba.com order protection >" link, trust icons, Trade Assurance footer
   - Acceptance: Sidebar sticks to viewport on scroll; all price values display correctly; clicking "order protection" link opens modal

6. **Order Protection Modal (C6)**
   - Description: Scrollable modal with 6 sections (info box, Secure Payments with 11 icons, Guaranteed Delivery, Money-back, 24/7 Support, Data Privacy), backdrop overlay, close via X/backdrop/ESC
   - Acceptance: Modal opens centered with backdrop; content scrolls within modal; all 6 sections visible by scrolling; X, backdrop click, and ESC all close modal; body scroll locked while open

7. **Accordion Toggle (C3, C4)**
   - Description: Payment Method and Items & Delivery sections start collapsed, toggle open/closed on click with height animation
   - Acceptance: Both sections show only icon + title initially; clicking toggles content area open/closed with smooth transition

8. **Geolocation Mock (C7)**
   - Description: "Use my current location" link triggers `navigator.geolocation.getCurrentPosition()`, mock response fills form fields with preset address
   - Acceptance: Clicking link triggers browser permission prompt; on success, Street, State, City, Postal code auto-fill with mock data

9. **Address Autocomplete Popup (C8)**
   - Description: Dark-background floating popup appears near State dropdown showing saved address; clicking fills entire form
   - Acceptance: Popup shows when state dropdown opens (if saved address exists in mock data); clicking saved address fills all form fields; clicking outside closes popup

10. **Data-Driven Content**
    - Description: Zero hardcoded display text — all content comes from mock JSON data objects
    - Acceptance: Changing mock data values updates all rendered text; component structure accepts data as parameters

### Edge Cases

1. **Empty form submission** — All required fields show validation errors simultaneously; page scrolls to first error
2. **Country change** — State and City dropdowns reset; phone prefix updates; city list clears
3. **State change** — City dropdown resets to empty; previously selected city clears
4. **Modal scroll** — Content scrolls within modal bounds; page behind does not scroll
5. **Multiple dropdown open** — Opening one dropdown closes any other open dropdown
6. **Rapid accordion toggle** — Animation completes before next toggle; no visual glitch
7. **Geolocation denied** — Silent fail with `console.warn`; no user-facing error
8. **Long country/state names** — Text truncates with ellipsis in dropdown trigger; full name shows in dropdown list
9. **Sidebar at page bottom** — Sticky sidebar stops at footer boundary (CSS `sticky` + container height)
10. **Focus trap in modal** — Tab key cycles only within modal elements; Shift+Tab wraps backward

## Implementation Notes

### DO
- Use the EXACT design token system from the existing `style.css` (copy the full `@theme` block)
- Follow the `DOMContentLoaded` + `initFlowbite()` pattern from existing `main.ts`
- Use Flowbite's `data-tooltip-target` for the payment processing fee (i) tooltip and postal code (i) tooltip
- Use `position: sticky; top: 80px;` for the sidebar (not JS-based sticky)
- Use CSS `transition: all 0.2s ease` for float-label animations
- Use `overflow-y: auto` with `max-height: 80vh` for modal scrolling
- Use `body.overflow-hidden` class when modal is open
- Render all HTML via `document.getElementById('app')!.innerHTML = ...` in main.ts (same pattern as RFQ page)
- Use flag emojis for country dropdown items (e.g. `🇹🇷 Turkey/Turkiye`)
- Keep all mock data in a single `mock-data.ts` file with named exports
- Use `console.info('Checkout form submitted:', formData)` for form submission

### DON'T
- Don't touch site header or footer — use `<!-- SITE HEADER BURAYA GELIR -->` placeholders
- Don't use React/Vue/Svelte — this is vanilla TypeScript + Tailwind
- Don't use `position: fixed` for sidebar — use `position: sticky`
- Don't hardcode any display text — everything from mock data
- Don't create separate JS files per component — all logic in `main.ts`
- Don't use Swiper.js (not needed on this page)
- Don't use inline styles — everything via Tailwind utilities or BEM custom classes with CSS custom properties
- Don't redefine design tokens — copy them exactly from the existing project

## Development Environment

### Setup (Greenfield)

```bash
# Initialize project
npm init -y
npm install flowbite
npm install -D vite@^7.0.0 typescript@^5.8.3 tailwindcss@^4.1.3 @tailwindcss/vite@^4.1.3

# Start dev server
npm run dev
```

### Start Services

```bash
npm run dev
```

### Service URLs
- Checkout Page: http://localhost:5173/checkout (or http://localhost:5173/ if single page)

### Required Environment Variables
- None — static frontend, no API keys needed

---

# DETAILED COMPONENT SPECIFICATIONS

---

## Component 1: Page Header (C1)

**Visual Reference:** Screenshot 1 — top area below site header

### HTML Structure

```html
<section id="checkout-header" class="checkout-header">
  <h1 class="checkout-header__title"><!-- from mock data: "Checkout" --></h1>
</section>
```

### Tailwind / CSS Classes

```
.checkout-header
  → max-w-[var(--container-lg)] mx-auto px-4 pt-8 pb-6

.checkout-header__title
  → text-hero-lg (32px) font-bold text-text-primary leading-tight
```

### Specifications
| Property | Value | Token |
|----------|-------|-------|
| Font size | 32px | `var(--font-size-hero-lg)` / `text-hero-lg` |
| Font weight | 700 | `var(--font-weight-bold)` / `font-bold` |
| Color | #111827 | `var(--color-text-primary)` / `text-text-primary` |
| Padding top | 32px | `pt-8` (8 × 4px) |
| Padding bottom | 24px | `pb-6` |
| Border bottom | none | Clean — no divider below H1 |

---

## Component 2: Shipping Address Form (C2)

**Visual Reference:** Screenshot 1 (full form), Screenshot 5 (country dropdown open), Screenshot 6 (validation errors + geolocation popup), Screenshot 7 (state dropdown + autocomplete popup), Screenshot 8 (city dropdown filtered)

### Section Wrapper

```html
<section id="checkout-shipping" class="checkout-section checkout-section--active">
  <div class="checkout-section__header">
    <svg class="checkout-section__icon"><!-- settings/gear icon 24px --></svg>
    <h2 class="checkout-section__title">Shipping address</h2>
  </div>
  <div class="checkout-section__security">
    <svg class="checkout-section__lock-icon"><!-- lock icon 16px --></svg>
    <span>Your information is encrypted and secure</span>
  </div>
  <form id="checkout-form" class="checkout-form" novalidate>
    <!-- form fields here -->
  </form>
</section>
```

### Section Header Specs
| Property | Value | Token |
|----------|-------|-------|
| Icon | Settings/gear SVG, 24px, color #6b7280 | `text-text-tertiary` |
| Title font-size | 18-20px | `var(--font-size-lg)` or `var(--font-size-xl)` |
| Title font-weight | 700 | `font-bold` |
| Title color | #111827 | `text-text-primary` |
| Layout | Flex row, items-center, gap-2 (8px) | `flex items-center gap-2` |
| Padding | 24px vertical | `py-6` |

### Security Note Specs
| Property | Value | Token |
|----------|-------|-------|
| Lock icon | 16px, color #16a34a | `text-success-700` |
| Text | "Your information is encrypted and secure" | — |
| Text color | #16a34a (green) | `text-success-700` |
| Font size | 13px | `var(--font-size-caption)` / `text-caption` |
| Layout | Flex row, items-center, gap-2 | `flex items-center gap-2` |
| Margin bottom | 20-24px | `mb-5` or `mb-6` |

---

### 2.1 Float Label System (All Inputs)

**Visual Evidence:** Screenshot 1 shows "Ali BAL" filled (label up), "Phone number" empty (label centered)

**CSS Implementation:**

```css
/* Float Label Container */
.checkout-float-field {
  position: relative;
  border: 1px solid var(--color-border-strong); /* #d1d5db */
  border-radius: var(--radius-input); /* 8px */
  background: var(--color-input-bg); /* #ffffff */
  min-height: 52px;
  transition: border-color var(--transition-base); /* 200ms ease */
}

.checkout-float-field:focus-within {
  border-color: var(--color-input-focus-border); /* #cc9900 */
}

.checkout-float-field--error {
  border-color: var(--color-error-500); /* #ef4444 */
}

/* Float Label */
.checkout-float-field__label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary); /* #6b7280 */
  font-size: var(--font-size-base); /* 14px */
  pointer-events: none;
  transition: all var(--transition-base); /* 200ms ease */
  background: transparent;
}

.checkout-float-field__label .checkout-float-field__required {
  color: var(--color-error-500); /* #ef4444 */
}

/* Active/Filled State — label floats up */
.checkout-float-field--active .checkout-float-field__label,
.checkout-float-field:focus-within .checkout-float-field__label {
  top: 8px;
  transform: translateY(0);
  font-size: var(--font-size-sm); /* 12px */
}

/* Input */
.checkout-float-field__input {
  width: 100%;
  padding: 20px 16px 8px 16px; /* top padding for floated label */
  font-size: var(--font-size-base); /* 14px */
  color: var(--color-input-text); /* #111827 */
  background: transparent;
  border: none;
  outline: none;
}

/* Error message */
.checkout-float-field__error {
  color: var(--color-error-500); /* #ef4444 */
  font-size: var(--font-size-sm); /* 12px */
  margin-top: 4px;
  display: none;
}

.checkout-float-field--error + .checkout-float-field__error,
.checkout-float-field__error--visible {
  display: block;
}
```

**JavaScript Handler (generic for all inputs):**

```typescript
function initFloatLabels(): void {
  const fields = document.querySelectorAll('.checkout-float-field');
  fields.forEach(field => {
    const input = field.querySelector('input, select') as HTMLInputElement | HTMLSelectElement;
    if (!input) return;

    // Set initial state
    if (input.value.trim()) {
      field.classList.add('checkout-float-field--active');
    }

    input.addEventListener('focus', () => {
      field.classList.add('checkout-float-field--active');
    });

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        field.classList.remove('checkout-float-field--active');
      }
    });

    input.addEventListener('input', () => {
      if (input.value.trim()) {
        field.classList.add('checkout-float-field--active');
      }
    });
  });
}
```

---

### 2.2 Country/Region Dropdown

**Visual Reference:** Screenshot 5 — dropdown open with flag emojis

**Closed State (Screenshot 1):**
| Property | Value |
|----------|-------|
| Display | Flag emoji (🇹🇷) + "Turkey/Turkiye" |
| Chevron | Down arrow (▾) right-aligned, 16px, color #6b7280 |
| Border | 1px solid #d1d5db |
| Border radius | 8px |
| Padding | 12px 16px |
| Min-height | 52px |
| Full width | 100% |

**Open State (Screenshot 5):**
| Property | Value |
|----------|-------|
| Chevron | Up arrow (▴) — rotated |
| Border | Active/focus state border color #cc9900 |
| Dropdown container | White bg (#ffffff), shadow-lg, rounded-md (bottom corners), max-height ~300px, overflow-y auto |
| Item padding | 10px 16px |
| Item font-size | 14px |
| Item content | Flag emoji (~20px) + country name |
| Hover state | bg #f3f4f6 |
| Selected state | bg #f3f4f6 or font-weight bold |
| Scrollbar | Thin, custom webkit scrollbar |

**Country List (minimum 20, popular countries first):**
```
🇺🇸 United States    🇦🇺 Australia    🇨🇦 Canada
🇬🇧 United Kingdom   🇮🇳 India        🇲🇽 Mexico
🇩🇪 Germany          🇫🇷 France       🇮🇹 Italy
🇪🇸 Spain            🇧🇷 Brazil       🇯🇵 Japan
🇰🇷 South Korea      🇳🇱 Netherlands  🇷🇺 Russia
🇸🇦 Saudi Arabia     🇦🇪 UAE          🇹🇷 Turkey/Turkiye
🇵🇱 Poland           🇸🇪 Sweden       🇨🇭 Switzerland
🇳🇴 Norway           🇩🇰 Denmark      🇧🇪 Belgium
🇦🇹 Austria          🇮🇩 Indonesia    🇹🇭 Thailand
🇻🇳 Vietnam          🇵🇭 Philippines  🇲🇾 Malaysia
```

**Behavior:**
- Click field → opens dropdown, chevron rotates to ▴
- Click country → selects, closes dropdown, updates display, updates phone prefix
- Click outside / ESC → closes dropdown
- Only one dropdown open at a time (opening this closes State/City if open)

---

### 2.3 Name + Phone Row (Two fields side-by-side)

**Visual Reference:** Screenshot 1 — "Ali BAL" filled, "+90" prefix

**Layout:** Flex row, gap 16px (`gap-4`)
- Left field (~55%): "First name and Last name *" — standard float-label input
- Right field (~45%): Composite phone input

**Name Field Specs:**
| Property | Value |
|----------|-------|
| Label | "First name and Last name *" |
| Filled state (Screenshot 1) | Label shrunk to 12px at top; value "Ali BAL" at 14px |
| Required | Yes (red asterisk) |

**Phone Composite Input Specs:**
| Property | Value |
|----------|-------|
| Layout | Single border wrapper containing two parts |
| Border | 1px solid #d1d5db, rounded 8px |
| Left part (prefix) | "+90" — bg #f3f4f6, border-right 1px solid #d1d5db, ~60px width, text-center, non-editable, 14px, color #374151 |
| Right part (input) | "Phone number *" float label input, standard input styling |
| Prefix updates | When country changes: US→"+1", UK→"+44", DE→"+49", TR→"+90", etc. |

**Below Row Note:**
| Property | Value |
|----------|-------|
| Text | "Only used to contact you for delivery updates" |
| Color | #6b7280 (`text-text-tertiary`) |
| Font size | 12px (`text-sm`) |
| Padding top | 4px |

---

### 2.4 Street Address Field

**Visual Reference:** Screenshot 1 — field with "Use my current location" link

| Property | Value |
|----------|-------|
| Label | "Street address or P.O. box *" |
| Full width | 100% |
| Required | Yes |
| Right element | "📍 Use my current location" link (inside input row, right-aligned) |

**"Use my current location" Link:**
| Property | Value |
|----------|-------|
| Icon | Location pin (📍 or SVG), ~14px |
| Text | "Use my current location" |
| Color | #374151 (`text-text-secondary`) |
| Font size | 13px (`text-caption`) |
| Text decoration | Underline (visible in screenshot) |
| Layout | Flex items-center gap-1 |
| Cursor | Pointer |
| Position | Right side of the Street address row, vertically centered |
| On click | Triggers C7 geolocation feature |

---

### 2.5 Apartment Field

| Property | Value |
|----------|-------|
| Label | "Apartment, suite, unit, building, floor (optional)" |
| Full width | 100% |
| Required | No (no asterisk) |
| Style | Same float-label input as others |

---

### 2.6 State + City + Postal Code Row (3 fields)

**Visual Reference:** Screenshot 1 (3-col layout), Screenshot 7 (state open), Screenshot 8 (city filtered)

**Layout:** Flex row, gap 12-16px
- Left (~35%): State/Province dropdown
- Center (~30%): City dropdown
- Right (~35%): Postal code input + (i) help icon

**State Dropdown Open (Screenshot 7):**
| Property | Value |
|----------|-------|
| Container | White bg, shadow-lg, rounded-md, max-height ~250px, overflow-y auto |
| Items | Alphabetical Turkish provinces: Adana, Adiyaman, Afyonkarahisar, Agri, Aksaray, Amasya, Ankara... (all 81) |
| Item padding | 8px 16px |
| Item font-size | 14px, color #374151 |
| Hover | bg #f3f4f6 |

**City Dropdown Open (Screenshot 8 — state "Adiyaman" selected):**
| Property | Value |
|----------|-------|
| Filtered list | Besni, Celikhan, Gerger, Golbasi, Kahta, Merkez, Samsat |
| Same styling | As state dropdown |
| Cascading | City list updates when state changes; selected city clears |

**Postal Code Field:**
| Property | Value |
|----------|-------|
| Label | "Postal code *" |
| Required | Yes |
| Help icon | (i) circle icon, right side, ~16px, color #9ca3af |
| Tooltip | Flowbite `data-tooltip-target`, text: "Enter your postal/ZIP code" |

**Districts Mock Data (minimum 5 provinces):**

```typescript
// Adiyaman
{ state: "Adiyaman", cities: ["Besni", "Celikhan", "Gerger", "Golbasi", "Kahta", "Merkez", "Samsat", "Sincik", "Tut"] }

// Istanbul
{ state: "Istanbul", cities: ["Adalar", "Arnavutkoy", "Atasehir", "Avcilar", "Bagcilar", "Bahcelievler", "Bakirkoy", "Basaksehir", "Bayrampasa", "Besiktas", "Beykoz", "Beylikduzu", "Beyoglu", "Buyukcekmece", "Catalca", "Cekmekoy", "Esenler", "Esenyurt", "Eyupsultan", "Fatih", "Gaziosmanpasa", "Gungoren", "Kadikoy", "Kagithane", "Kartal", "Kucukcekmece", "Maltepe", "Pendik", "Sancaktepe", "Sariyer", "Silivri", "Sultanbeyli", "Sultangazi", "Sile", "Sisli", "Tuzla", "Umraniye", "Uskudar", "Zeytinburnu"] }

// Ankara
{ state: "Ankara", cities: ["Akyurt", "Altindag", "Ayas", "Bala", "Beypazari", "Cankaya", "Cubuk", "Elmadag", "Etimesgut", "Evren", "Golbasi", "Gudul", "Haymana", "Kahramankazan", "Kalecik", "Kecioren", "Kizilcahamam", "Mamak", "Nallihan", "Polatli", "Pursaklar", "Sincan", "Yenimahalle"] }

// Izmir
{ state: "Izmir", cities: ["Aliaga", "Balcova", "Bayindir", "Bayrakli", "Bergama", "Beydag", "Bornova", "Buca", "Cesme", "Cigli", "Dikili", "Foca", "Gaziemir", "Guzelbahce", "Karabaglar", "Karsiaka", "Kemalpasa", "Kinik", "Kiraz", "Konak", "Menderes", "Menemen", "Narlidere", "Odemis", "Seferihisar", "Selcuk", "Tire", "Torbali", "Urla"] }

// Adana
{ state: "Adana", cities: ["Aladag", "Ceyhan", "Cukurova", "Feke", "Imamoglu", "Karaisali", "Karatas", "Kozan", "Pozanti", "Saimbeyli", "Saricam", "Seyhan", "Tufanbeyli", "Yumurtalik", "Yuregir"] }
```

---

### 2.7 Default Address Checkbox

**Visual Reference:** Screenshot 1 — unchecked checkbox

| Property | Value |
|----------|-------|
| Label | "Set as default shipping address" |
| Default state | Unchecked |
| Component | Flowbite checkbox (standard) |
| Label font-size | 14px, color #374151 |
| Margin top | 16px (`mt-4`) |

---

### 2.8 "Continue to payment" CTA Button

**Visual Reference:** Screenshot 1 — orange button, left-aligned

| Property | Value | Token |
|----------|-------|-------|
| Text | "Continue to payment" | From mock data |
| Background | `#ea580c` (Alibaba checkout orange) | Custom — NOT `var(--color-btn-bg)` |
| Alt option | `var(--color-btn-bg)` (#cc9900) if brand consistency preferred | Project primary |
| Text color | #ffffff | `text-white` |
| Font size | 15-16px | `var(--font-size-md)` |
| Font weight | 600 | `var(--font-weight-semibold)` |
| Border radius | 8px | `var(--radius-button)` |
| Padding | 12px 32px | `py-3 px-8` |
| Hover | Darken to ~#dc2626 | `hover:bg-[#c2410c]` |
| Transition | 200ms ease | `var(--transition-base)` |
| Margin top | 24px | `mt-6` |
| Width | Auto (fits text) | `w-auto` |
| Alignment | Left (not centered) | Default block |

**IMPORTANT: Color Decision**
The original Alibaba checkout uses `#ea580c` (orange-red). The project design system uses `#cc9900` (amber/gold). The spec provides both options. **Recommendation: Use `#ea580c` for visual accuracy to Alibaba reference.**

---

### 2.9 Form Validation

**Visual Reference:** Screenshot 6 — Phone and Postal code with red borders + "Required"

**Validation Rules:**
| Field | Required | Validation |
|-------|----------|------------|
| Country/region | Yes | Must have selection |
| First name and Last name | Yes | Non-empty string |
| Phone number | Yes | Non-empty string |
| Street address | Yes | Non-empty string |
| Apartment | No | — |
| State/province | Yes | Must have selection |
| City | Yes | Must have selection |
| Postal code | Yes | Non-empty string |

**Error Display Specs:**
| Property | Value | Token |
|----------|-------|-------|
| Input border | #ef4444 (red) | `var(--color-error-500)` |
| Error text | "Required" | — |
| Error text color | #ef4444 | `var(--color-error-500)` / `text-error-500` |
| Error text size | 12px | `var(--font-size-sm)` / `text-sm` |
| Error text margin | 4px top | `mt-1` |

**Validation Behavior:**
1. On "Continue to payment" click → check all required fields
2. Empty required fields → add `checkout-float-field--error` class + show error text
3. Scroll to first error field (smooth scroll)
4. On field focus/input → remove error state for that field
5. If all valid → `console.info('Checkout form submitted:', formData)`

---

## Component 3: Payment Method — Collapsed Accordion (C3)

**Visual Reference:** Screenshot 1 — bottom of left column

### HTML Structure

```html
<section id="checkout-payment" class="checkout-section checkout-section--collapsed">
  <button class="checkout-section__header checkout-section__header--toggle" aria-expanded="false">
    <svg class="checkout-section__icon"><!-- dollar/payment icon 24px --></svg>
    <h2 class="checkout-section__title">Payment method</h2>
    <svg class="checkout-section__chevron"><!-- chevron down --></svg>
  </button>
  <div class="checkout-section__content" style="height: 0; overflow: hidden;">
    <p class="text-text-tertiary text-base p-6">Payment method options will appear here after shipping address is completed.</p>
  </div>
</section>
```

### Specs
| Property | Value |
|----------|-------|
| Icon | Dollar/payment SVG circle outline, 24px, color #6b7280 |
| Title | "Payment method", 18-20px, font-weight 700, color #111827 |
| Border top | 1px solid #e5e5e5 |
| Padding | 20-24px vertical |
| Cursor | Pointer |
| Hover | bg #fafafa (subtle) |
| Chevron | Right-aligned, rotates 180deg on open |
| Initial state | Collapsed (content hidden) |
| Toggle animation | `height: 0` → `height: auto`, `overflow: hidden`, transition 300ms ease |

---

## Component 4: Items and Delivery Options — Collapsed Accordion (C4)

**Visual Reference:** Screenshot 1 — bottom of left column

### HTML Structure

```html
<section id="checkout-items" class="checkout-section checkout-section--collapsed">
  <button class="checkout-section__header checkout-section__header--toggle" aria-expanded="false">
    <svg class="checkout-section__icon"><!-- package/box icon 24px --></svg>
    <h2 class="checkout-section__title">Items and delivery options</h2>
    <svg class="checkout-section__chevron"><!-- chevron down --></svg>
  </button>
  <div class="checkout-section__content" style="height: 0; overflow: hidden;">
    <p class="text-text-tertiary text-base p-6">Item and delivery details will appear here.</p>
  </div>
</section>
```

### Specs
- Same pattern as C3 (Payment Method)
- Icon: Package/box SVG circle outline, 24px
- Title: "Items and delivery options"
- Border top: 1px solid #e5e5e5
- Initial state: Collapsed

---

## Component 5: Order Summary Sidebar (C5)

**Visual Reference:** Screenshot 1 — right column, full sidebar

### Card Container Specs
| Property | Value | Token |
|----------|-------|-------|
| Background | #ffffff | `var(--color-card-bg)` |
| Border | 1px solid #e5e5e5 | `var(--color-card-border)` |
| Border radius | 12px | `rounded-xl` |
| Shadow | Small shadow | `var(--shadow-sm)` |
| Padding | 24-28px | `p-6` or `p-7` |
| Position | Sticky | `position: sticky` |
| Sticky top | 80px | `top: 80px` (header offset) |
| Max height | calc(100vh - 100px) | Prevent overflow |

### 5.1 Title
| Property | Value |
|----------|-------|
| Text | "Order summary (200 items)" |
| Font size | 18-20px |
| Font weight | 700 |
| Color | #111827 |

### 5.2 Product Thumbnail Grid

**Visual Reference:** Screenshot 1 — 2x2 grid with "200" badge

| Property | Value |
|----------|-------|
| Layout | 2×2 CSS Grid, gap 4px |
| Thumbnail size | ~48-56px square each |
| Border radius | 4px (`rounded-sm`) |
| "200" Badge | Position absolute top-left of grid, dark bg (#374151), white text, 11px font, rounded-sm, padding 2px 6px |
| Margin | 16px 0 |

### 5.3 Price Breakdown Rows

**From Screenshot 1:**

```
Item subtotal                    USD 60.00
Estimated shipping fee           USD 402.00
─────────────────────────────────────────── (border-top)
Subtotal                         USD 462.00    ← bold
Payment processing fee ⓘ        USD 13.82
─────────────────────────────────────────── (border-top)
Pay in USD                    USD 475.82       ← large total
```

**Row Specs:**
| Row | Label Style | Value Style | Special |
|-----|-------------|-------------|---------|
| Item subtotal | 14px, #374151, weight 400 | 14px, #111827, weight 400 | — |
| Est. shipping fee | 14px, #374151, weight 400 | 14px, #111827, weight 400 | — |
| Subtotal | 14px, #111827, weight 700 | 14px, #111827, weight 700 | border-top 1px solid #e5e5e5, padding-top 12px |
| Processing fee | 14px, #374151, weight 400 | 14px, #111827, weight 400 | ⓘ icon (Flowbite tooltip: "Payment processing fee applies to all orders") |
| Pay in USD | 14px, #374151, weight 400, "USD" dashed underline | 20-22px, #111827, weight 700 | border-top 1px solid #e5e5e5, padding-top 16px |

**Each row:** `display: flex; justify-content: space-between; align-items: center;`

### 5.4 Order Protection Link

| Property | Value |
|----------|-------|
| Text | "Alibaba.com order protection" |
| Color | #111827 |
| Font weight | 600 |
| Font size | 14px |
| Right element | Chevron (>) ~16px, color #6b7280 |
| Layout | Flex justify-between items-center |
| Cursor | Pointer |
| Border top | 1px solid #e5e5e5, margin-top 16px, padding-top 16px |
| On click | Opens C6 Order Protection Modal |

### 5.5 Protection Summary List (3 items)

**From Screenshot 1 — below order protection link:**

Each item: icon + bold title + description paragraph

| Item | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | ✅ Green check circle (20px) | "Secure payments" | "Every payment you make on Alibaba.com is secured with strict SSL encryption and PCI DSS data protection protocols." |
| 2 | 🚚 Green truck (20px) | "On-time Dispatch Guarantee" | "Dispatched within 7 days of payment or receive a 10% delay compensation." |
| 3 | 💰 Green shield/money (20px) | "Money-back protection" | "Claim a refund if your order doesn't ship, is missing, or arrives with product issues." |

**Item Specs:**
| Property | Value |
|----------|-------|
| Layout | Flex row, gap 8-12px |
| Margin top | 12-16px between items |
| Icon | 20px, green (#16a34a or #22c55e) |
| Title | 13px, font-weight 600, color #111827 |
| Description | 12px, color #6b7280, line-height 1.5, margin-top 2px |

### 5.6 Trade Assurance Footer

| Property | Value |
|----------|-------|
| Text | "Only orders placed and paid through Alibaba.com can enjoy free protection by 🛡 Trade Assurance" |
| Font size | 12px |
| Color | #9ca3af |
| Line height | 1.5 |
| "Trade Assurance" | Link style, color #b38600, font-weight 500, underline |
| Shield icon | Inline ~14px |
| Margin top | 16px |
| Border top | 1px solid #e5e5e5, padding-top 12px |

### 5.7 Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | Sticky sidebar, right column |
| Tablet (768-1024px) | Below form, not sticky, full width |
| Mobile (<768px) | Below form, not sticky, full width |

---

## Component 6: Order Protection Modal (C6)

**Visual Reference:** Screenshot 2 (top scroll), Screenshot 3 (mid scroll), Screenshot 4 (bottom scroll)

### Modal Wrapper Specs
| Property | Value | Token |
|----------|-------|-------|
| Backdrop | rgba(0,0,0,0.5) | `var(--color-surface-overlay)` |
| Backdrop z-index | 50 | `z-50` |
| Position | Fixed, inset 0 | `fixed inset-0` |
| Modal card bg | #ffffff | `bg-white` |
| Border radius | 16px | `rounded-xl` |
| Shadow | XL | `var(--shadow-xl)` |
| Max width | ~520px | `max-w-lg` |
| Max height | ~80vh | `max-h-[80vh]` |
| Centering | Fixed, top 50%, left 50%, transform translate(-50%, -50%) | — |
| Overflow | `overflow-y: auto` (scrollable) | — |
| Padding | 28-32px | `p-7` or `p-8` |

### Modal Header
| Property | Value |
|----------|-------|
| Title | "Alibaba.com order protection" |
| Font size | 20px (`text-xl`) |
| Font weight | 700 |
| Color | #111827 |
| Close button (X) | ~20px, color #6b7280, hover #111827, cursor pointer |
| Layout | Flex justify-between items-center |
| Position | Sticky top (within scroll container) or static |

### Section 1: Info Box (Screenshot 2 — gray box)
| Property | Value |
|----------|-------|
| Background | #f3f4f6 |
| Border radius | 12px |
| Padding | 16px 20px |
| Header | ⓘ icon (18px, gray) + "How to keep your order protected" (15px, font-weight 600) |
| Bullet 1 | Blue dot (● 8px, #3b82f6) + "**When placing an order yourself:**" (bold) + description (regular, #6b7280) |
| Bullet 2 | Green dot (● 8px, #22c55e) + "**When supplier drafts an order for you:**" (bold) + description |
| Margin top | 12px between bullets |

### Section 2: Secure Payments (Screenshot 2 — middle)
| Property | Value |
|----------|-------|
| Icon | ✅ Green check circle, ~28px |
| Title | "Secure payments", 18px, font-weight 700, #111827 |
| Description | "Choose your preferred local payment methods, currencies, bank transfers, or deferred payment plans to pay. Every transaction you make through Alibaba.com is protected by SSL encryption and PCI DSS data security protocols." |
| Description style | 14px, #374151, line-height 1.6 |
| **Payment Icons** | 11 icons in flex-wrap row, gap 8px, margin 16px 0 |
| Learn link | "Learn about secure payments" — underline, 13px, #374151 |
| Padding | 24px 0 |
| Border bottom | 1px solid #e5e5e5 |

**11 Payment Method Icons (Screenshot 2):**

| # | Brand | Approximate Color | Alt Text |
|---|-------|-------------------|----------|
| 1 | Visa | #1a1f71 dark blue | "Visa" |
| 2 | Mastercard | #eb001b + #f79e1b circles | "Mastercard" |
| 3 | American Express | #006fcf blue | "American Express" |
| 4 | PayPal | #003087 + #009cde | "PayPal" |
| 5 | Apple Pay | #000000 black | "Apple Pay" |
| 6 | Google Pay | multicolor | "Google Pay" |
| 7 | Discover | #ff6000 orange | "Discover" |
| 8 | Diners Club | #0079be blue | "Diners Club" |
| 9 | JCB | #0e4c96 blue + #e8161a red | "JCB" |
| 10 | UnionPay | #e21836 red + #00447c blue | "UnionPay" |
| 11 | T/T | #6b7280 gray | "T/T (Wire Transfer)" |

**Icon Specs:** ~36-40px width, ~24-28px height, object-fit contain, optional 1px border #e5e5e5 rounded-sm

### Section 3: Guaranteed Delivery (Screenshot 2-3)
| Property | Value |
|----------|-------|
| Icon | 🚚 Green truck, ~28px |
| Title | "Guaranteed delivery" |
| Description | "Better planning and managing inventory knowing that your order will be dispatched or delivered by the guaranteed date." + "In the rare case there is a delay, receive a 10% compensation on the total order amount." |
| Learn link | "Learn about guaranteed shipping" |
| Padding | 24px 0 |
| Border bottom | 1px solid #e5e5e5 |

### Section 4: Money-back Protection (Screenshot 3-4)
| Property | Value |
|----------|-------|
| Icon | 💰 Green shield, ~28px |
| Title | "Money-back protection" |
| Description | "Claim a refund if your order doesn't ship, is missing, or the products arrive defective, incorrect, or damaged." |
| Learn link | "Learn about refunds and returns" |
| Padding | 24px 0 |
| Border bottom | 1px solid #e5e5e5 |

### Section 5: 24/7 Support (Screenshot 3-4)
| Property | Value |
|----------|-------|
| Icon | 🕐 Green/yellow 24H badge, ~28px |
| Title | "24/7 support" |
| Description | "Access our virtual help center 24/7, or connect with live agents for order issues, reports, or inquiries." |
| Learn link | "Learn about 24/7 support" |
| Padding | 24px 0 |
| Border bottom | 1px solid #e5e5e5 |

### Section 6: Data Privacy (Screenshot 4 — last section)
| Property | Value |
|----------|-------|
| Icon | 🔒 Green lock, ~28px |
| Title | "Data privacy" |
| Description | "We never share your data with third parties without your consent. All personal information is handled in accordance with the Alibaba.com Privacy Policy." |
| Learn link | "Learn how we protect your data" |
| Padding | 24px 0 |
| Border bottom | None (last section) |

### Common Section Pattern

```
┌──────────────────────────────────────────────┐
│ [Icon 28px]  Title (18px, font-weight 700)    │
│                                                │
│ Description paragraph (14px, color #374151)    │
│ ...............                                │
│                                                │
│ Learn about ... ← link, underline, 13px        │
├────────────────────────────────────────────────┤ ← border-bottom 1px solid #e5e5e5
│                    24px gap                     │
```

### Modal Behaviors

| Behavior | Implementation |
|----------|----------------|
| Open | Triggered by clicking C5 "order protection" link |
| Close — X button | Click handler removes modal |
| Close — Backdrop | Click on backdrop (outside modal card) |
| Close — ESC key | `keydown` event listener for Escape |
| Body scroll lock | Add `overflow: hidden` to `<body>` on open; remove on close |
| Focus trap | Tab cycles within modal; Shift+Tab wraps backward |
| Transition | Opacity 0→1 + scale 0.95→1, 200ms ease |

---

## Component 7: Geolocation Feature (C7)

**Visual Reference:** Screenshot 6 — browser permission popup (Turkish: "Konumunuzu bilme")

### "Use my current location" Link (inside C2)

Already specified in Section 2.4 above.

### Geolocation Behavior

```typescript
function handleGeolocation(): void {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Mock: Ignore actual coordinates, fill with preset address
      const mockAddress = {
        street: "Gulbahar Mah. Cemal Sururi Sk. No:12",
        state: "Istanbul",
        city: "Sisli",
        postalCode: "34394",
        country: "TR"
      };
      fillFormWithAddress(mockAddress);
    },
    (error) => {
      console.warn('Geolocation error:', error.message);
      // Silent fail — no user-facing error
    }
  );
}
```

### Form Auto-Fill on Success
- Street address → "Gulbahar Mah. Cemal Sururi Sk. No:12"
- State/Province → "Istanbul"
- City → "Sisli"
- Postal code → "34394"
- All float labels animate to "active" state
- Validation errors clear for filled fields

---

## Component 8: Address Autocomplete Popup (C8)

**Visual Reference:** Screenshot 7 — dark popup next to state dropdown

### Popup Container Specs
| Property | Value |
|----------|-------|
| Background | #1f2937 (dark) |
| Border radius | 12px |
| Shadow | XL |
| Padding | 12px 16px |
| Max width | ~220px |
| Position | Absolute, positioned to the right of the State dropdown |
| Z-index | 40 (below modal but above dropdowns) |

### Popup Content

| Element | Style |
|---------|-------|
| City title | "Istanbul" — font-weight 700, color #ffffff, 14px |
| Address detail | "Gulbahar Mah. Cemal Sururi..." — color #9ca3af, 13px, text-overflow ellipsis, white-space nowrap, overflow hidden |
| Separator | border-top 1px solid #374151, margin 8px 0 |
| Manage link | ⚙ gear icon (14px) + "Adresleri yonet..." — color #ffffff, 13px, cursor pointer |

### Behavior

| Trigger | When state dropdown opens AND saved address exists in mock data |
|---------|----------------------------------------------------------------|
| Click address | Fills ALL form fields (country, name, phone, street, state, city, postal) with saved address data |
| Click outside | Popup closes |
| Dismiss | Popup hides when state dropdown closes |

### Saved Address Mock Data

```typescript
const savedAddress = {
  label: "Istanbul",
  fullAddress: "Gulbahar Mah. Cemal Sururi Sk. No:12",
  country: "TR",
  countryName: "Turkey/Turkiye",
  firstName: "Ali BAL",
  phone: "5551234567",
  phonePrefix: "+90",
  street: "Gulbahar Mah. Cemal Sururi Sk. No:12",
  apartment: "Daire 5, Kat 3",
  state: "Istanbul",
  city: "Sisli",
  postalCode: "34394"
};
```

---

## Full Page Layout — Two Column Structure

**Visual Reference:** Screenshot 1

```
┌──────────────────────────────────────────────────────────────────┐
│  <!-- SITE HEADER BURAYA GELIR -->                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  <main class="max-w-[1472px] mx-auto px-4 py-8">                 │
│                                                                    │
│  ┌─ "Checkout" H1 (C1) ─────────────────────────────────────┐    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                    │
│  <div class="flex flex-col xl:flex-row gap-8">                    │
│                                                                    │
│    ┌─── Left Column (xl:w-[60%]) ──────────┐  ┌── Right (xl:w-[35%]) ──┐
│    │ C2: Shipping Address Form (open)       │  │ C5: Order Summary      │
│    │ C3: Payment Method (collapsed)         │  │     (sticky)           │
│    │ C4: Items & Delivery (collapsed)       │  │                        │
│    └────────────────────────────────────────┘  └────────────────────────┘
│                                                                    │
│  </div>                                                            │
│  </main>                                                           │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│  <!-- SITE FOOTER BURAYA GELIR -->                                │
└──────────────────────────────────────────────────────────────────┘
```

**Layout CSS:**
```css
/* Two column container */
.checkout-layout {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (min-width: 1024px) {
  .checkout-layout {
    flex-direction: row;
  }
  .checkout-layout__main {
    flex: 0 0 60%;
    max-width: 60%;
  }
  .checkout-layout__sidebar {
    flex: 0 0 35%;
    max-width: 35%;
  }
}
```

---

## Mock Data Structure (src/data/mock-data.ts)

### Complete Data Exports Required

```typescript
// 1. Countries (20+ with flag, name, code, phone prefix)
export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", phonePrefix: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phonePrefix: "+61" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phonePrefix: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phonePrefix: "+44" },
  { code: "IN", name: "India", flag: "🇮🇳", phonePrefix: "+91" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", phonePrefix: "+52" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phonePrefix: "+49" },
  { code: "TR", name: "Turkey/Turkiye", flag: "🇹🇷", phonePrefix: "+90" },
  // ... 20+ total
];

// 2. Turkish Provinces (all 81, alphabetical)
export const turkishProvinces: Province[] = [
  { code: "01", name: "Adana" },
  { code: "02", name: "Adiyaman" },
  // ... all 81 provinces
  { code: "81", name: "Duzce" },
];

// 3. Districts per province (minimum 5 provinces detailed)
export const districtsByProvince: Record<string, string[]> = {
  "Adana": ["Aladag", "Ceyhan", ...],
  "Adiyaman": ["Besni", "Celikhan", "Gerger", "Golbasi", "Kahta", "Merkez", "Samsat"],
  "Ankara": [...],
  "Istanbul": [...],
  "Izmir": [...],
  // Other provinces: ["Merkez"] as fallback
};

// 4. Order Summary
export const orderSummary: OrderSummary = {
  itemCount: 200,
  thumbnails: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg", "/placeholder-4.jpg"],
  itemSubtotal: 60.00,
  estimatedShippingFee: 402.00,
  subtotal: 462.00,
  paymentProcessingFee: 13.82,
  totalUSD: 475.82,
  currency: "USD",
};

// 5. Modal Sections (6 sections)
export const modalSections: ModalSection[] = [...];

// 6. Payment Icons (11)
export const paymentIcons: PaymentIcon[] = [...];

// 7. Saved Address (1 entry)
export const savedAddress: SavedAddress = { ... };

// 8. Page text content
export const pageContent = {
  pageTitle: "Checkout",
  shippingTitle: "Shipping address",
  securityNote: "Your information is encrypted and secure",
  continueButton: "Continue to payment",
  paymentTitle: "Payment method",
  itemsTitle: "Items and delivery options",
  orderSummaryTitle: "Order summary",
  orderProtectionTitle: "Alibaba.com order protection",
  // ... all display text
};
```

---

## TypeScript Interfaces (src/types/index.ts)

```typescript
export interface Country {
  code: string;        // "TR"
  name: string;        // "Turkey/Turkiye"
  flag: string;        // "🇹🇷"
  phonePrefix: string; // "+90"
}

export interface Province {
  code: string;  // "34"
  name: string;  // "Istanbul"
}

export interface OrderSummary {
  itemCount: number;
  thumbnails: string[];
  itemSubtotal: number;
  estimatedShippingFee: number;
  subtotal: number;
  paymentProcessingFee: number;
  totalUSD: number;
  currency: string;
}

export interface ModalSection {
  id: string;
  iconType: string;  // "check" | "truck" | "shield" | "clock" | "lock"
  title: string;
  description: string;
  learnMoreText: string;
  learnMoreUrl: string;
}

export interface PaymentIcon {
  name: string;
  altText: string;
  bgColor: string;
  textColor: string;
}

export interface SavedAddress {
  label: string;
  fullAddress: string;
  country: string;
  countryName: string;
  firstName: string;
  phone: string;
  phonePrefix: string;
  street: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
}

export interface CheckoutFormData {
  country: string;
  firstName: string;
  phone: string;
  phonePrefix: string;
  street: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
  isDefaultAddress: boolean;
}
```

---

## TypeScript Interaction Handlers (src/main.ts)

### Complete Handler List

| Handler | Purpose |
|---------|---------|
| `initFloatLabels()` | Float label focus/blur/input for all `.checkout-float-field` elements |
| `initCountryDropdown()` | Country dropdown: toggle, select, close on outside click, update phone prefix |
| `initStateDropdown()` | State dropdown: toggle, select → filter city list + clear city selection |
| `initCityDropdown()` | City dropdown: toggle, select |
| `closeAllDropdowns()` | Utility: close all open dropdowns (called when opening a new one) |
| `initFormValidation()` | "Continue to payment" submit handler: validate required fields, show/hide errors |
| `initGeolocation()` | "Use my current location" click → geolocation API → mock fill |
| `initOrderProtectionModal()` | Modal open (link click) / close (X, backdrop, ESC) / body scroll lock / focus trap |
| `initAccordions()` | Payment method + Items & delivery toggle (click → expand/collapse with height animation) |
| `initAddressAutocomplete()` | Saved address popup: show/hide when state dropdown opens, click → fill form |
| `initTooltips()` | Flowbite tooltips for processing fee (i) and postal code (i) |
| `renderPage()` | Render all HTML into `#app` from mock data |

### Key Implementation Notes

**Dropdown Close on Outside Click:**
```typescript
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.checkout-dropdown')) {
    closeAllDropdowns();
  }
});
```

**ESC Key Handler:**
```typescript
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeModal();
  }
});
```

**Accordion Toggle Animation:**
```typescript
function toggleAccordion(section: HTMLElement): void {
  const content = section.querySelector('.checkout-section__content') as HTMLElement;
  const chevron = section.querySelector('.checkout-section__chevron') as HTMLElement;
  const button = section.querySelector('.checkout-section__header--toggle') as HTMLButtonElement;
  const isOpen = button.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    content.style.height = content.scrollHeight + 'px';
    requestAnimationFrame(() => {
      content.style.height = '0';
    });
    button.setAttribute('aria-expanded', 'false');
    chevron.style.transform = 'rotate(0deg)';
  } else {
    content.style.height = content.scrollHeight + 'px';
    content.addEventListener('transitionend', () => {
      content.style.height = 'auto';
    }, { once: true });
    button.setAttribute('aria-expanded', 'true');
    chevron.style.transform = 'rotate(180deg)';
  }
}
```

---

## Accessibility (a11y) Requirements

| Element | ARIA / Keyboard |
|---------|-----------------|
| Modal | `role="dialog"`, `aria-labelledby="modal-title"`, `aria-modal="true"` |
| Modal focus trap | Tab cycles within modal; focus returns to trigger on close |
| Dropdowns | `role="listbox"` on list, `role="option"` on items, `aria-expanded` on trigger |
| Accordion buttons | `aria-expanded="true/false"`, `aria-controls="content-id"` |
| Required fields | `aria-required="true"` |
| Error fields | `aria-invalid="true"`, `aria-describedby="field-error-id"` |
| Form | `aria-label="Shipping address form"` |
| Close button | `aria-label="Close modal"` |
| Tooltips | Flowbite `data-tooltip-target` + `role="tooltip"` |
| Keyboard — ESC | Closes modal and dropdowns |
| Keyboard — Enter/Space | Selects dropdown option, toggles accordion |
| Keyboard — Tab | Standard tab order; trapped in modal when open |

---

## Responsive Breakpoint Summary

| Breakpoint | Layout | Sidebar | 3-Col Fields | Accordion |
|------------|--------|---------|--------------|-----------|
| Desktop (>1024px) | 2-column (60% + 35%) | Sticky, right column | Side-by-side (3 cols) | Normal |
| Tablet (768-1024px) | Single column | Below form, not sticky | Side-by-side (3 cols) | Normal |
| Mobile (<768px) | Single column | Below form, not sticky | Stacked (1 col each) | Normal |

**Additional Mobile Adjustments:**
- Name + Phone row: Stack vertically (full width each)
- Padding: Reduce to `px-3` on mobile
- Modal: Full-width on small screens (`max-w-full mx-4`)
- Font sizes: Maintain minimum readability (no reduction below design system minimums)

---

## Dark Mode Notes (Future Reference)

Token mapping for class-based `.dark` support:

| Light | Dark |
|-------|------|
| `--color-surface: #ffffff` | `--color-surface: #111827` |
| `--color-text-primary: #111827` | `--color-text-primary: #f9fafb` |
| `--color-card-bg: #ffffff` | `--color-card-bg: #1f2937` |
| `--color-input-bg: #ffffff` | `--color-input-bg: #374151` |
| `--color-border-default: #e5e5e5` | `--color-border-default: #374151` |

*Not implemented in this task — noted for future enhancement.*

---

## Success Criteria

The task is complete when:

1. [ ] Two-column checkout layout renders correctly (60/35 split, 32px gap, 1472px max-width)
2. [ ] All 8 components (C1-C8) are visible and functional
3. [ ] Float-label animation works on ALL form inputs (focus → label up, blur empty → label down)
4. [ ] Country dropdown opens with flag emojis, selecting updates phone prefix
5. [ ] State dropdown shows 81 Turkish provinces alphabetically
6. [ ] City dropdown filters by selected state (e.g., Adiyaman → 7 districts)
7. [ ] Form validation shows red borders + "Required" on empty required fields
8. [ ] "Continue to payment" logs form data to console on successful validation
9. [ ] Order summary sidebar sticks on scroll (desktop)
10. [ ] "Alibaba.com order protection" link opens scrollable modal with 6 sections + 11 payment icons
11. [ ] Modal closes via X button, backdrop click, and ESC key
12. [ ] Accordion sections (Payment, Items) toggle open/closed with animation
13. [ ] "Use my current location" triggers geolocation prompt and mock-fills form
14. [ ] Address autocomplete dark popup appears and fills form on click
15. [ ] All content comes from mock data (zero hardcoded display text)
16. [ ] Page is responsive (single column on mobile/tablet)
17. [ ] No console errors
18. [ ] Existing design tokens from style.css are reused (not redefined)

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| Float label toggle | `src/main.ts` | Label gets `--active` class on focus; removes on blur when empty; stays on blur when filled |
| Country select updates prefix | `src/main.ts` | Selecting "US" shows "+1"; selecting "TR" shows "+90" |
| Cascading dropdown filter | `src/main.ts` | State "Adiyaman" → City shows exactly ["Besni","Celikhan","Gerger","Golbasi","Kahta","Merkez","Samsat"] |
| Form validation | `src/main.ts` | Empty required fields get error class; filled fields do not |
| Modal open/close | `src/main.ts` | Modal visible on link click; hidden on X/backdrop/ESC |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Mock data → DOM rendering | mock-data.ts ↔ main.ts | All mock data values appear in rendered HTML |
| Country → State → City chain | main.ts data flow | Full cascading works: country change → state reset → city reset |
| Geolocation → Form fill | main.ts | Geolocation success fills street, state, city, postal code fields |
| Saved address → Form fill | main.ts | Clicking saved address popup fills ALL form fields |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Happy path form submit | 1. Fill all required fields 2. Click "Continue to payment" | `console.info` logs complete CheckoutFormData object |
| Validation error flow | 1. Click "Continue to payment" with empty fields 2. Fill one field 3. Click again | Step 1: all errors show. Step 3: filled field error gone, others remain |
| Modal scroll | 1. Click "order protection" link 2. Scroll modal to bottom 3. Press ESC | Modal shows 6 sections, scrolls, closes on ESC |
| Cascading dropdown | 1. Select Turkey 2. Open state → select Adiyaman 3. Open city → verify list | City shows Adiyaman districts only |
| Saved address autofill | 1. Open state dropdown 2. Click dark popup saved address | All form fields auto-filled, float labels animate up |

### Browser Verification
| Page/Component | URL | Checks |
|----------------|-----|--------|
| Full page layout | `http://localhost:5173/` | Two columns, proper spacing, correct font (Roboto) |
| Country dropdown | Same URL | Flag emojis display, scroll works, selection works |
| Validation states | Same URL | Red borders and "Required" text appear on submit |
| Modal | Same URL | Opens centered, scrolls, has all 6 sections, 11 payment icons |
| Sidebar sticky | Same URL | Scrolling page keeps sidebar in view (desktop) |
| Mobile responsive | Same URL (375px viewport) | Single column, stacked fields, no horizontal scroll |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Browser verification complete
- [ ] No regressions in existing functionality
- [ ] Code follows established patterns (BEM naming, token usage, TypeScript strict)
- [ ] No security vulnerabilities introduced
- [ ] All 8 components render correctly
- [ ] All interactive behaviors work (dropdowns, modal, validation, accordion, float labels)
- [ ] Mock data is comprehensive and realistic
- [ ] Responsive layout works at all breakpoints
