# Listing Cart Drawer — Mock'tan API-Driven'a Gecis

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Products listing sayfasindaki drawer'in mock data yerine `get_listing_detail` API'sinden gercek veri kullanmasini saglamak.

**Architecture:** `SharedCartDrawer.ts`'e bir `onItemMissing` callback mekanizmasi eklenir. `ListingCartDrawer.ts`'deki tum mock data kaldirilir ve yerine tiklamada API cagiran bir handler konur. `CartDrawer.ts` ve product-detail sayfasi degismez.

**Tech Stack:** TypeScript, Frappe REST API, SharedCartDrawer UI

---

## Chunk 1: Implementasyon

### Task 1: SharedCartDrawer'a `onItemMissing` callback ekle

**Files:**
- Modify: `tradehubfront/src/components/cart/overlay/SharedCartDrawer.ts:86-90` (global degiskenler)
- Modify: `tradehubfront/src/components/cart/overlay/SharedCartDrawer.ts:702-723` (click handler)

- [ ] **Step 1: `onItemMissing` callback degiskeni ve setter'i ekle**

`SharedCartDrawer.ts` dosyasinda, `let productsById` satirindan hemen sonra (satir 90 civarinda) su kodu ekle:

```typescript
let onItemMissing: ((id: string, mode: 'cart' | 'sample') => Promise<void>) | null = null;
```

Dosyanin sonundaki export'lar bolgesine (`openSharedCartDrawer` export'unun yakininda, satir 862 civarinda) su fonksiyonu ekle:

```typescript
export function setOnItemMissing(cb: ((id: string, mode: 'cart' | 'sample') => Promise<void>) | null): void {
  onItemMissing = cb;
}
```

- [ ] **Step 2: Click handler'lari `onItemMissing` fallback'i ile guncelle**

`[data-add-to-cart]` handler'inda (satir 706-712):

Mevcut:
```typescript
    const cartTrigger = target.closest<HTMLElement>('[data-add-to-cart]');
    if (cartTrigger) {
      const id = cartTrigger.dataset.addToCart;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'cart');
      }
      return;
    }
```

Yeni:
```typescript
    const cartTrigger = target.closest<HTMLElement>('[data-add-to-cart]');
    if (cartTrigger) {
      const id = cartTrigger.dataset.addToCart;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'cart');
      } else if (id && onItemMissing) {
        event.preventDefault();
        onItemMissing(id, 'cart');
      }
      return;
    }
```

Ayni degisikligi `[data-order-sample]` handler'inda da yap (satir 715-723):

Mevcut:
```typescript
    const sampleTrigger = target.closest<HTMLElement>('[data-order-sample]');
    if (sampleTrigger) {
      const id = sampleTrigger.dataset.orderSample;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'sample');
      }
      return;
    }
```

Yeni:
```typescript
    const sampleTrigger = target.closest<HTMLElement>('[data-order-sample]');
    if (sampleTrigger) {
      const id = sampleTrigger.dataset.orderSample;
      if (id && productsById.has(id)) {
        event.preventDefault();
        openDrawer(id, 'sample');
      } else if (id && onItemMissing) {
        event.preventDefault();
        onItemMissing(id, 'sample');
      }
      return;
    }
```

- [ ] **Step 3: Build kontrol**

Run: `cd tradehubfront && npx tsc --noEmit 2>&1 | head -20`
Expected: Hata yok (veya mevcut hatalar degismemis)

- [ ] **Step 4: Commit**

```bash
git add tradehubfront/src/components/cart/overlay/SharedCartDrawer.ts
git commit -m "feat: add onItemMissing callback to SharedCartDrawer for lazy-load support"
```

---

### Task 2: ListingCartDrawer.ts'i tamamen yeniden yaz (mock data kaldir, API-driven yap)

**Files:**
- Rewrite: `tradehubfront/src/components/products/ListingCartDrawer.ts`

- [ ] **Step 1: Dosyayi yeniden yaz**

`ListingCartDrawer.ts` dosyasinin tamamini su icerikle degistir:

```typescript
import { getListingDetail } from '../../services/listingService';
import type { ProductDetail } from '../../types/product';
import type { ProductListingCard } from '../../types/productListing';
import {
  SharedCartDrawer,
  initSharedCartDrawer,
  openSharedCartDrawer,
  setOnItemMissing,
  type CartDrawerItemModel,
  type CartDrawerColorModel,
  type CartDrawerShippingOption,
} from '../cart/overlay/SharedCartDrawer';

/* ── Mapping helpers (mirrors CartDrawer.ts logic) ── */

function toShippingOptions(product: ProductDetail): CartDrawerShippingOption[] {
  return product.shipping.map((option, index) => ({
    id: `ship-${index + 1}`,
    method: option.method,
    estimatedDays: option.estimatedDays,
    cost: Number(option.cost.replace(/[^0-9.]/g, '')) || 0,
    costText: option.cost,
  }));
}

function toColors(product: ProductDetail): CartDrawerColorModel[] {
  const colorVariant = product.variants.find((v) => v.type === 'color');
  if (!colorVariant || colorVariant.options.length === 0) return [];
  return colorVariant.options.map((option, index) => ({
    id: option.id || `color-${index + 1}`,
    label: option.label,
    colorHex: option.value,
    imageKind: 'jewelry' as const,
    imageUrl: option.thumbnail || product.images[0]?.src,
  }));
}

function toDrawerItem(product: ProductDetail): CartDrawerItemModel {
  return {
    id: product.id,
    title: product.title,
    supplierName: product.supplier.name,
    unit: product.unit,
    moq: product.moq,
    imageKind: 'jewelry',
    priceTiers: product.priceTiers.map((tier) => ({
      minQty: tier.minQty,
      maxQty: tier.maxQty,
      price: tier.price,
    })),
    colors: toColors(product),
    shippingOptions: toShippingOptions(product),
  };
}

/* ── Lazy-load handler ── */

async function handleItemMissing(id: string, mode: 'cart' | 'sample'): Promise<void> {
  const btn = document.querySelector<HTMLElement>(`[data-add-to-cart="${id}"], [data-order-sample="${id}"]`);
  if (btn) btn.classList.add('loading');

  try {
    const product = await getListingDetail(id);
    const item = toDrawerItem(product);
    initSharedCartDrawer([item]);
    openSharedCartDrawer(item.id, mode);
  } catch (err) {
    console.error('[ListingCartDrawer] Failed to load product detail:', err);
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}

/* ── Public API (export signatures unchanged) ── */

export function ListingCartDrawer(): string {
  return SharedCartDrawer();
}

export function initListingCartDrawer(_products: ProductListingCard[]): void {
  setOnItemMissing(handleItemMissing);
}
```

- [ ] **Step 2: Build kontrol**

Run: `cd tradehubfront && npx tsc --noEmit 2>&1 | head -20`
Expected: Hata yok

- [ ] **Step 3: Commit**

```bash
git add tradehubfront/src/components/products/ListingCartDrawer.ts
git commit -m "feat: replace ListingCartDrawer mock data with API-driven lazy loading"
```

---

### Task 3: Loading state icin CSS ekle

**Files:**
- Modify: `tradehubfront/src/style.css` (veya uygun global CSS dosyasi)

- [ ] **Step 1: Hangi CSS dosyasinin kullanildigini kontrol et**

Run: `grep -r "\.loading" tradehubfront/src/ --include="*.css" --include="*.scss" -l | head -5`

Eger `.loading` class'i zaten tanimlanmissa, bu task'i atla. Yoksa devam et.

- [ ] **Step 2: Loading spinner CSS'i ekle**

Global CSS dosyasina su kurali ekle:

```css
[data-add-to-cart].loading,
[data-order-sample].loading {
  pointer-events: none;
  opacity: 0.6;
  position: relative;
}

[data-add-to-cart].loading::after,
[data-order-sample].loading::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

- [ ] **Step 3: Commit**

```bash
git add tradehubfront/src/style.css
git commit -m "style: add loading spinner for cart drawer buttons"
```

---

### Task 4: Manuel test

- [ ] **Step 1: Dev server'i baslat**

Run: `cd tradehubfront && npm run dev`

- [ ] **Step 2: Products sayfasini test et**

1. `localhost:5500/pages/products.html` ac
2. Bir urune tikla → drawer'da gercek backend tier, varyasyon ve kargo verisi gorulmeli
3. Varyasyonu olmayan urune tikla → renk secimi bos olmali (eski mock renkler GOSTERILMEMELI)
4. Network tab'da `get_listing_detail` API cagrisini dogrula

- [ ] **Step 3: Product-detail sayfasini test et (regression)**

1. `localhost:5500/pages/product-detail.html?id=XXXXX` ac
2. Drawer normal calismali (bu sayfa degismedi)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: listing cart drawer mock-to-api migration complete"
```
