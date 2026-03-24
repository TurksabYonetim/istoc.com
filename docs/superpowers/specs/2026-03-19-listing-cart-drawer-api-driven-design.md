# Listing Cart Drawer - Mock Data'dan API-Driven'a Gecis

**Tarih:** 2026-03-19
**Durum:** Onaylandi

## Problem

Products listing sayfasinda (`products.ts`) urune tiklaninca acilan drawer (`ListingCartDrawer.ts`) mock/hardcoded data kullaniyor:
- `buildPriceTiers()` — fiyat string'inden sahte tier'lar uretiyor
- `categoryColorMap` — kategoriye gore hardcoded renkler
- `defaultShipping` — DHL, Air Cargo, Sea Freight hardcoded
- `categoryVariantImages` — Unsplash URL'leri

Gercek backend verisi (`get_listing_detail` API) kullanilmiyor.

## Yaklasim

**Yaklasim B:** `ListingCartDrawer.ts` dosyasini koruyup, mock fonksiyonlari API cagrisiyla degistirmek.

## Tasarim

### Mevcut Akis (Mock)

```
sayfa yuklenir → searchListings() → products[]
→ initListingCartDrawer(products) → her urun icin toDrawerItem()
  → buildPriceTiers(priceText) [MOCK tier uret]
  → buildColors(kind) [MOCK categoryColorMap]
  → defaultShipping [MOCK]
→ initSharedCartDrawer(drawerItems) → productsById Map'e kaydet
→ kullanici tiklar → [data-add-to-cart] handler → productsById.get(id) → drawer acar
```

### Yeni Akis (API-Driven)

```
sayfa yuklenir → searchListings() → products[]
→ initListingCartDrawer(products) → product ID'lerini hafizada tut
→ kullanici tiklar → [data-add-to-cart] handler
  → loading goster
  → getListingDetail(productId) API cagrisi
  → ProductDetail verisinden gercek tier, variant, shipping al
  → toDrawerItem(productDetail) → CartDrawerItemModel olustur
  → initSharedCartDrawer([item]) + openSharedCartDrawer(item.id)
  → drawer acilir
```

### Degisecek Dosyalar

#### 1. `tradehubfront/src/components/products/ListingCartDrawer.ts`

**Kaldirilacaklar:**
- `categoryVariantImages` (satirlar 12-65)
- `categoryColorMap` (satirlar 67-118)
- `defaultShipping` (satirlar 120-124)
- `parsePriceRange()` (satirlar 126-137)
- `parseMoq()` (satirlar 139-142)
- `buildPriceTiers()` (satirlar 144-170)
- `buildColors()` (satirlar 172-183)
- Mevcut `toDrawerItem(ProductListingCard)` (satirlar 185-198)

**Eklenecekler:**
- `getListingDetail` import'u (`listingService.ts`'den)
- `ProductDetail` type import'u
- Yeni `toDrawerItem(ProductDetail)` — `CartDrawer.ts`'deki `toColors()`, `toShippingOptions()` mantigi kullanilacak
- `initListingCartDrawer()` — artik sadece product ID'lerini saklayacak, click handler kuracak
- Click handler'da: loading state + `getListingDetail()` API cagrisi + drawer acma

**Yeni `toDrawerItem` mantigi (CartDrawer.ts'den esinlenerek):**

```typescript
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
  const colorVariant = product.variants.find(v => v.type === 'color');
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
    priceTiers: product.priceTiers.map(t => ({
      minQty: t.minQty, maxQty: t.maxQty, price: t.price
    })),
    colors: toColors(product),
    shippingOptions: toShippingOptions(product),
  };
}
```

**Yeni `initListingCartDrawer` mantigi:**

```typescript
// Product ID'lerini sakla (API'den detay cekmek icin)
let productIds = new Set<string>();

export function initListingCartDrawer(products: ProductListingCard[]): void {
  productIds = new Set(products.map(p => p.id));
  // Click handler SharedCartDrawer icinde zaten var,
  // ama productsById bos olacagi icin intercept etmemiz lazim
}
```

#### 2. `tradehubfront/src/components/cart/overlay/SharedCartDrawer.ts`

Click handler'da (`[data-add-to-cart]` event listener, satir 705-713):

Mevcut:
```typescript
if (id && productsById.has(id)) {
  openDrawer(id, 'cart');
}
```

Yeni davranis icin `ListingCartDrawer`'dan bir async handler register edilecek. SharedCartDrawer'a bir `onItemNotFound` callback export'u eklenecek veya ListingCartDrawer kendi click handler'ini SharedCartDrawer'dan once kaydedecek.

**En temiz cozum:** SharedCartDrawer'daki click handler'da `productsById.has(id)` false dondugunde, bir fallback callback cagirmak:

```typescript
// SharedCartDrawer.ts'e eklenir:
let onItemMissing: ((id: string, mode: 'cart' | 'sample') => Promise<void>) | null = null;

export function setOnItemMissing(cb: typeof onItemMissing): void {
  onItemMissing = cb;
}

// Click handler guncellenir:
if (id && productsById.has(id)) {
  openDrawer(id, 'cart');
} else if (id && onItemMissing) {
  onItemMissing(id, 'cart');
}
```

#### 3. `tradehubfront/src/pages/products.ts`

Minimal degisiklik — `initListingCartDrawer(products)` cagrisi ayni kalir.

#### 4. `tradehubfront/src/components/products/index.ts`

Export'lar ayni kalir.

### Loading State

Drawer acilmadan once, tiklanan butonun uzerinde kisa bir loading spinner gosterilecek:

```typescript
async function handleItemMissing(id: string, mode: 'cart' | 'sample'): Promise<void> {
  // Butona loading state ekle
  const btn = document.querySelector(`[data-add-to-cart="${id}"]`);
  if (btn) btn.classList.add('loading');

  try {
    const product = await getListingDetail(id);
    const item = toDrawerItem(product);
    initSharedCartDrawer([item]);
    openSharedCartDrawer(item.id, mode);
  } catch (err) {
    console.error('[ListingCartDrawer] Failed to load product:', err);
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}
```

### Dokunulmayacaklar

- `SharedCartDrawer.ts` UI render mantigi — oldugi gibi kalir
- `CartDrawer.ts` — product-detail sayfasi icin oldugi gibi kalir
- `products.ts` — minimal degisiklik (initListingCartDrawer cagrisi ayni)

## Kenar Durumlar

- **API hatasi:** Loading kaldirilir, drawer acilmaz, console'a hata logu
- **Yavas network:** Loading spinner kullaniciya geri bildirim verir
- **Varyasyonu olmayan urun:** `toColors()` bos array doner (fallback renk yok — gercek veriye sadik)
- **Shipping verisi olmayan urun:** Bos array doner

## Test Plani

1. Products sayfasinda bir urune tikla → drawer'da gercek tier, varyasyon ve kargo verisi gorulur
2. Varyasyonu olmayan urune tikla → renk secimi gosterilmez
3. API hatasi simulate et → drawer acilmaz, hata logu gorulur
4. Product-detail sayfasindaki drawer hala ayni calisiyor (regression yok)