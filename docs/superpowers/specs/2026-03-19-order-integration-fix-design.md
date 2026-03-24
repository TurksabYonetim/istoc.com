# Sipariş Entegrasyonu Düzeltme — Tasarım Spec

**Tarih:** 2026-03-19
**Durum:** Onaylandı
**Kapsam:** Checkout → Siparişlerim sayfası entegrasyonu

---

## Problem

Checkout akışı `Order` doctype'ına yazıyor, Siparişlerim sayfası `Buyer Order` doctype'ından okuyor. İki farklı tablo olduğu için sipariş verildikten sonra listede görünmüyor.

Ek olarak, `order.py` API dosyası yanlış app dizininde (`apps/tradehub/tradehub_core/api/`) bulunuyor. Doğru app (`apps/tradehub_core/tradehub_core/api/`) altında `order.py` mevcut değil, bu yüzden `tradehub_core.api.order.*` import path'i çalışmıyor.

Son olarak, checkout akışı (`checkout.ts:458-459`) hem `cart.py::create_order` hem de `orderStore.addOrders()` (ki bu `order.py::create_order`'ı çağırır) çağırarak **çift sipariş oluşturma riski** taşıyor.

## Hedef DocType: Buyer Order

Frontend `OrderStore.ts`, `Buyer Order` doctype'ının alan yapısına göre tasarlanmış. Bu doctype'ı kaynak olarak kullanacağız.

### Buyer Order Alanları
| Alan | Tür | Açıklama |
|------|------|----------|
| order_number | Data (unique, autoname) | Sipariş numarası |
| order_date | Datetime (reqd) | Sipariş tarihi |
| buyer | Link → User (reqd) | Alıcı |
| seller_name | Data (reqd) | Satıcı adı |
| status | Select | Waiting for payment, Confirming, Preparing Shipment, Delivering, Completed, Cancelled |
| status_color | Data | Tailwind renk sınıfı |
| status_description | Small Text | Durum açıklaması |
| currency | Data | Para birimi |
| subtotal | Currency | Ara toplam |
| shipping_fee | Currency | Kargo ücreti |
| grand_total | Currency (reqd) | Genel toplam |
| payment_method | Data | Ödeme yöntemi |
| payment_status | Select | Unpaid, Processing, Paid, Refunded |
| shipping_status | Data | Kargo durumu |
| shipping_address | Data | Teslimat adresi |
| ship_from | Data | Gönderim yeri |
| shipping_method | Data | Kargo yöntemi |
| incoterms | Data | Incoterms (default: DAP) |
| supplier_name | Data | Tedarikçi adı |
| supplier_contact | Data | İletişim kişisi |
| supplier_phone | Data | Telefon |
| supplier_email | Data | E-posta |
| cancel_reason | Small Text | İptal nedeni |
| items | Table → Buyer Order Item | Sipariş kalemleri |

### Buyer Order Item Alanları
| Alan | Tür |
|------|------|
| product_name | Data (reqd) |
| variation | Data |
| image | Data |
| unit_price | Currency (reqd) |
| quantity | Int (reqd) |
| total_price | Currency (reqd) |

## Çözüm Adımları

### Adım 1: `order.py`'yi doğru app'e taşı

**Kaynak:** `tradehubback/apps/tradehub/tradehub_core/api/order.py`
**Hedef:** `tradehubback/apps/tradehub_core/tradehub_core/api/order.py`

Bu dosya zaten `Buyer Order` doctype'ını kullanıyor ve frontend'in beklediği API yapısına sahip:
- `get_my_orders(status, search, date_from, date_to, page, page_size)`
- `get_order_detail(order_number)`
- `cancel_order(order_number, reason)`
- `get_order_counts()`
- `get_payment_records(order_number)`
- `submit_remittance(...)`

Dosya olduğu gibi kopyalanabilir, path değişikliği gerekmez (modül path zaten `tradehub_core.api.order`).

### Adım 2: `cart.py::create_order`'ı `Buyer Order` oluşturacak şekilde güncelle

**Mevcut** (`cart.py:641`):
```python
order_doc = frappe.new_doc("Order")
order_doc.buyer = user
order_doc.seller = seller_id
order_doc.status = "Ödeme Bekleniyor"
order_doc.total = max(0, total)
# subtotal, shipping_fee set edilir ama grand_total yok
```

**Yeni — tüm alanlar:**
```python
from frappe.utils import now_datetime

# seller_name çözümle (reqd alan — boş olmamalı)
seller_name = order_data.get("seller_name", "")
if not seller_name and seller_id:
    seller_name = frappe.db.get_value("Admin Seller Profile", seller_id, "seller_name") or seller_id

order_doc = frappe.new_doc("Buyer Order")
order_doc.order_number = "ORD-{}".format(frappe.generate_hash(length=8).upper())
order_doc.order_date = now_datetime()
order_doc.buyer = user
order_doc.seller_name = seller_name
order_doc.status = "Waiting for payment"
order_doc.status_color = "text-amber-600"
order_doc.status_description = ""
order_doc.currency = currency
order_doc.subtotal = subtotal
order_doc.shipping_fee = shipping_fee
order_doc.grand_total = max(0, total)
order_doc.payment_method = payment_method or "bank_transfer"
order_doc.payment_status = "Unpaid"
order_doc.shipping_status = "Pending"
order_doc.shipping_address = shipping_address or ""
order_doc.shipping_method = order_data.get("shipping_method", "")
order_doc.ship_from = order_data.get("ship_from", "")
order_doc.supplier_name = seller_name
```

**Alan eşleme tablosu (Order → Buyer Order):**
| cart.py (eski) | Buyer Order (yeni) | Not |
|----------------|-------------------|-----|
| `buyer = user` | `buyer = user` | Aynı |
| `seller` (Link) | `seller_name` (Data) | seller adı string olarak yazılacak, boşsa Admin Seller Profile'dan çözümlenecek |
| `status = "Ödeme Bekleniyor"` | `status = "Waiting for payment"` | İngilizce status değerleri |
| `total` | `grand_total` | Alan adı değişiyor |
| `subtotal` | `subtotal` | Aynı |
| `shipping_fee` | `shipping_fee` | Aynı |
| — | `order_number` | Hash ile otomatik üretilecek |
| — | `order_date` | `now_datetime()` |
| — | `status_color` | Default: "text-amber-600" |
| — | `payment_status` | Default: "Unpaid" |
| — | `shipping_status` | Default: "Pending" |
| — | `supplier_name` | seller_name ile aynı |
| `coupon_code` | — | Buyer Order'da yok, scope dışı |
| `coupon_discount` | — | Buyer Order'da yok, scope dışı |

**Child table eşleme (Order Item → Buyer Order Item):**
| cart.py (eski) | Buyer Order Item (yeni) |
|----------------|------------------------|
| `listing_title` | `product_name` |
| `listing` | — (kaldırılıyor, Buyer Order Item'da yok) |
| `listing_variant` | — (kaldırılıyor) |
| `variation` | `variation` |
| `unit_price` | `unit_price` |
| `quantity` | `quantity` |
| `total_price` | `total_price` |
| `image` | `image` |

### Adım 3: `cart.py::get_orders`'ı da `Buyer Order`'a yönlendir

`get_orders` fonksiyonunu `order.py::get_my_orders`'a proxy yaparak yeniden yaz. Bu:
- Duplikasyonu önler (tek veri kaynağı)
- Yanıt formatını otomatik olarak uyumlu hale getirir

```python
@frappe.whitelist()
def get_orders(page=1, page_size=20):
    from tradehub_core.api.order import get_my_orders
    return get_my_orders(page=page, page_size=page_size)
```

### Adım 4: Frontend — çift sipariş oluşturmayı kaldır (KRİTİK)

**Dosya:** `tradehubfront/src/pages/checkout.ts:458-459`

**Mevcut:**
```typescript
orderStore.load();
orderStore.addOrders(newOrders);  // BU DA order.py::create_order çağırıyor → ÇİFT SİPARİŞ!
```

**Yeni:**
```typescript
await orderStore.load();  // Backend'den güncel listeyi çek (cart.py zaten Buyer Order oluşturdu)
// orderStore.addOrders KALDIRILDI — cart.py::create_order zaten Buyer Order oluşturuyor
```

Ayrıca satır 440-442'deki sample order path'inde de aynı düzeltme:
```typescript
// Eski:
orderStore.load();
orderStore.addOrders(newOrders);  // KALDIR

// Yeni:
await orderStore.load();
```

### Adım 5: `OrderStore.ts` — `addOrders` ve `createOrder` temizliği

`addOrders()` ve `createOrder()` metotları artık kullanılmayacak. Kaldırılabilir ya da no-op olarak bırakılabilir. Tavsiye: tamamen kaldır (YAGNI).

## Dokunulacak Dosyalar

1. **`tradehubback/apps/tradehub_core/tradehub_core/api/order.py`** — YENİ (eski app'ten kopyala)
2. **`tradehubback/apps/tradehub_core/tradehub_core/api/cart.py`** — `create_order` ve `get_orders` güncelle
3. **`tradehubfront/src/pages/checkout.ts`** — `orderStore.addOrders()` çağrılarını kaldır
4. **`tradehubfront/src/components/orders/state/OrderStore.ts`** — `addOrders()` ve `createOrder()` kaldır

## Dokunulmayacak Dosyalar

- OrdersPageLayout.ts, orders.ts (Alpine bileşeni), cartService.ts
- Buyer Order / Buyer Order Item doctype JSON'ları
- Checkout UI bileşenleri (OrderSummary, OrderReviewModal vb.)

## Ön Koşul Kontrolü

Implementasyona başlamadan önce `Buyer Order` doctype'ının Frappe tarafından tanındığını doğrula:
```bash
bench --site tradehub.localhost console
>>> frappe.get_meta("Buyer Order")
```
Eğer hata verirse, doctype'ı `tradehub_core` app'ine taşımak gerekecek — bu ayrı bir görev olarak planlanır.

## Risk ve Dikkat Edilecekler

- `Order` doctype'ına daha önce yazılmış test verisi varsa, bunlar `Buyer Order`'da görünmeyecek — bu beklenen davranış
- `Buyer Order` doctype'ı eski `tradehub` app'inde tanımlı. App yüklüyse Frappe tanır. Tanımıyorsa, doctype'ı taşımak gerekir — scope dışı
- Kupon indirimi (`coupon_code`, `coupon_discount`) Buyer Order'da mevcut değil — cart.py parametreleri kabul eder ama Buyer Order'a yazmaz. İleride Buyer Order'a bu alanlar eklenebilir
- Order number collision: `frappe.generate_hash(length=8)` ~4.3 milyar kombinasyon, düşük risk. Yine de duplicate check eklenecek
