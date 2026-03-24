# Sipariş Entegrasyonu Düzeltme — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Checkout'tan verilen siparişlerin Siparişlerim sayfasında görünmesini sağla — `Order` → `Buyer Order` doctype geçişi.

**Architecture:** `cart.py::create_order` fonksiyonu `Buyer Order` doctype'ı oluşturacak şekilde güncellenir. `order.py` API dosyası doğru app dizinine kopyalanır. Frontend'deki çift sipariş oluşturma kaldırılır.

**Tech Stack:** Python (Frappe), TypeScript (Alpine.js)

**Spec:** `docs/superpowers/specs/2026-03-19-order-integration-fix-design.md`

---

## File Map

| Dosya | İşlem | Sorumluluk |
|-------|-------|------------|
| `tradehubback/apps/tradehub_core/tradehub_core/api/order.py` | CREATE (kopyala) | Buyer Order CRUD API — get_my_orders, cancel_order, get_order_counts, get_payment_records, submit_remittance |
| `tradehubback/apps/tradehub_core/tradehub_core/api/cart.py` | MODIFY (satır 598-757) | create_order → Buyer Order oluştur, get_orders → order.py'ye proxy |
| `tradehubfront/src/pages/checkout.ts` | MODIFY (satır 441-442, 458-459) | orderStore.addOrders() çağrılarını kaldır |
| `tradehubfront/src/components/orders/state/OrderStore.ts` | MODIFY (satır 163-183) | createOrder() ve addOrders() metotlarını kaldır |

---

## Task 1: `order.py`'yi doğru app dizinine kopyala

**Files:**
- Create: `tradehubback/apps/tradehub_core/tradehub_core/api/order.py`
- Source: `tradehubback/apps/tradehub/tradehub_core/api/order.py`

- [ ] **Step 1: order.py dosyasını kopyala**

Kaynak dosyayı birebir kopyala — içerik değişikliği yok:

```bash
cp tradehubback/apps/tradehub/tradehub_core/api/order.py \
   tradehubback/apps/tradehub_core/tradehub_core/api/order.py
```

- [ ] **Step 2: Python import'unun çalıştığını doğrula**

```bash
cd tradehubback && python -c "import tradehub_core.api.order; print('OK')"
```

Expected: `OK` (syntax error yoksa)

- [ ] **Step 3: Commit**

```bash
git add tradehubback/apps/tradehub_core/tradehub_core/api/order.py
git commit -m "feat: copy order.py API to correct tradehub_core app directory"
```

---

## Task 2: `cart.py::create_order` — `Buyer Order` oluşturacak şekilde güncelle

**Files:**
- Modify: `tradehubback/apps/tradehub_core/tradehub_core/api/cart.py:598-698`

- [ ] **Step 1: Import ekle**

Dosyanın başına `from frappe.utils import now_datetime` ekle (zaten `json` ve `frappe` import'ları var).

```python
import json
import frappe
from frappe import _
from frappe.utils import now_datetime
```

- [ ] **Step 2: `create_order` fonksiyonundaki order oluşturma bloğunu değiştir**

`cart.py` satır 629-680 arasındaki for döngüsünün içi değişecek. Tam yeni kod:

```python
	for order_data in orders_data:
		seller_id = order_data.get("seller_id", "")
		products = order_data.get("products", [])
		shipping_fee = float(order_data.get("shipping_fee", 0))
		currency = order_data.get("currency", "USD")

		if not products:
			continue

		subtotal = sum(float(p.get("total_price", 0)) for p in products)
		total = subtotal + shipping_fee - per_order_coupon_discount

		# seller_name çözümle (Buyer Order'da reqd alan)
		seller_name = order_data.get("seller_name", "")
		if not seller_name and seller_id:
			seller_name = frappe.db.get_value(
				"Admin Seller Profile", seller_id, "seller_name"
			) or seller_id
		if not seller_name:
			seller_name = seller_id or "Unknown Seller"

		# order_number üret, duplicate kontrolü yap
		order_number = "ORD-{}".format(frappe.generate_hash(length=8).upper())
		while frappe.db.exists("Buyer Order", {"order_number": order_number}):
			order_number = "ORD-{}".format(frappe.generate_hash(length=8).upper())

		order_doc = frappe.new_doc("Buyer Order")
		order_doc.order_number = order_number
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
		# Not: coupon_code/coupon_discount Buyer Order doctype'ında yok, kaydedilmiyor

		for p in products:
			order_doc.append("items", {
				"product_name": p.get("listing_title", "") or p.get("product_name", ""),
				"variation": p.get("variation", ""),
				"unit_price": float(p.get("unit_price", 0)),
				"quantity": int(p.get("quantity", 1)),
				"total_price": float(p.get("total_price", 0)),
				"image": p.get("image", ""),
			})

		order_doc.insert(ignore_permissions=True)
		created_orders.append({
			"order_name": order_doc.name,
			"order_number": order_doc.order_number,
			"seller_name": seller_name,
			"total": max(0, total),
			"currency": currency,
		})
```

- [ ] **Step 3: `get_orders` fonksiyonunu proxy olarak yeniden yaz**

`cart.py` satır 701-756 arası (`get_orders` fonksiyonu ve tamamı) şu şekilde değişecek:

```python
@frappe.whitelist()
def get_orders(page=1, page_size=20):
	"""Oturumdaki kullanıcının siparişlerini döndürür. order.py'ye proxy."""
	from tradehub_core.api.order import get_my_orders
	return get_my_orders(page=page, page_size=page_size)
```

- [ ] **Step 4: Syntax kontrolü**

```bash
cd tradehubback && python -c "import tradehub_core.api.cart; print('OK')"
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add tradehubback/apps/tradehub_core/tradehub_core/api/cart.py
git commit -m "feat: create_order now writes to Buyer Order doctype instead of Order"
```

---

## Task 3: Frontend — çift sipariş oluşturmayı kaldır

**Files:**
- Modify: `tradehubfront/src/pages/checkout.ts:441-442, 458-459`

- [ ] **Step 1: Misafir kullanıcı bloğundaki addOrders'ı kaldır (satır 441-442)**

**Eski (satır 440-443):**
```typescript
    const newOrders = buildOrdersFromCheckout(paymentMethod, shippingAddress);
    orderStore.load();
    orderStore.addOrders(newOrders);
    redirectToSuccess(newOrders.map((o) => o.orderNumber).join(','));
```

**Yeni:**
```typescript
    const newOrders = buildOrdersFromCheckout(paymentMethod, shippingAddress);
    orderStore.load();
    redirectToSuccess(newOrders.map((o) => o.orderNumber).join(','));
```

- [ ] **Step 2: Giriş yapmış kullanıcı bloğundaki addOrders'ı kaldır (satır 457-459)**

**Eski (satır 457-459):**
```typescript
      const newOrders = buildOrdersFromCheckout(paymentMethod, shippingAddress, backendNums);
      orderStore.load();
      orderStore.addOrders(newOrders);
```

**Yeni:**
```typescript
      orderStore.load();
```

Not: `newOrders` değişkeni artık burada kullanılmıyor — `backendNums` zaten satır 453-455'te hesaplanıyor ve satır 461-463'te `orderNumbers` için kullanılıyor. `buildOrdersFromCheckout` çağrısı da kaldırılabilir çünkü `newOrders` sadece `addOrders` için kullanılıyordu.

Satır 461-463'teki `orderNumbers` hesaplaması da sadeleştirilebilir:

**Eski:**
```typescript
      const orderNumbers = backendNums.length > 0
        ? backendNums.join(',')
        : newOrders.map((o) => o.orderNumber).join(',');
```

**Yeni:**
```typescript
      const orderNumbers = backendNums.join(',');
```

(Backend her zaman `order_number` döndürür, fallback gerekmez.)

- [ ] **Step 3: Commit**

```bash
git add tradehubfront/src/pages/checkout.ts
git commit -m "fix: remove duplicate order creation from checkout flow"
```

---

## Task 4: `OrderStore.ts` — kullanılmayan metotları kaldır

**Files:**
- Modify: `tradehubfront/src/components/orders/state/OrderStore.ts:109-183`

- [ ] **Step 1: `createOrder` ve `addOrders` metotlarını kaldır**

Satır 163-183 arası (3 metot) tamamen kaldır:

```typescript
  // KALDIR: satır 163-176
  /** Sipariş oluştur — API'ye gönder, sonra listeyi güncelle */
  async createOrder(orderData: Order): Promise<boolean> {
    ...
  }

  // KALDIR: satır 178-183
  /** Toplu sipariş ekleme (checkout'tan) */
  async addOrders(newOrders: Order[]): Promise<void> {
    ...
  }
```

- [ ] **Step 2: `loadSync` metotunu kaldır (artık gereksiz)**

Satır 109-112 kaldır:

```typescript
  // KALDIR
  /** Backward compat — checkout.ts calls this before addOrders */
  loadSync(): void {
    // no-op: veri sadece API'den gelir
  }
```

- [ ] **Step 3: Commit**

```bash
git add tradehubfront/src/components/orders/state/OrderStore.ts
git commit -m "refactor: remove unused createOrder/addOrders/loadSync from OrderStore"
```

---

## Task 5: Doğrulama

- [ ] **Step 1: Backend syntax kontrolü**

```bash
cd tradehubback
python -c "import tradehub_core.api.order; print('order.py OK')"
python -c "import tradehub_core.api.cart; print('cart.py OK')"
```

- [ ] **Step 2: Frontend build kontrolü**

```bash
cd tradehubfront && npm run build
```

Expected: Build hatası yok.

- [ ] **Step 3: Manuel test (Docker ortamında)**

1. Siteye giriş yap
2. Bir ürünü sepete ekle
3. Checkout'a git, adres ve ödeme yöntemi seç
4. "Siparişi Ver" butonuna tıkla
5. Siparişlerim sayfasına git → sipariş "TÜMÜ" sekmesinde görünmeli
6. Status: "Waiting for payment" olmalı
7. Sekmelere tıkla (Onaylanıyor, Ödenmemiş, vb.) → filtreleme çalışmalı
