# Satıcı Kayıt + Ürün Yönetimi + Ali Merge + Login Sistemi Düzeltme Planı

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ali'nin auth sistemi değişikliklerini merge etmek, satıcı kayıt akışını, ürün ekleme/yönetim sistemini ve login sonrası yönlendirmeyi çalışır hale getirmek.

**Architecture:** Önce Ali'nin branch'ı (origin/Ali) mevcut branch'a (ahmet) merge edilecek — conflict'leri kullanıcı çözecek. Sonra backend `seller.py`'ye eksik 11 endpoint eklenecek. Auth DocType uyumsuzluğu düzeltilecek. Frontend rebuild yapılacak.

**Tech Stack:** Python/Frappe v15 backend, TypeScript/Alpine.js frontend, Docker Compose, MariaDB

---

## Sorun Analizi

### 0. Ali'nin Branch'ı Merge Edilmemiş (`origin/Ali`)

Ali'nin "Auth Sistemi Versiyon 2.0" commit'leri mevcut `ahmet` branch'ına alınmamış. Ali'nin branch'ında şunlar var:

| Dosya/Özellik | Açıklama |
|---------------|----------|
| `admin_panel/` | Yeni Vue.js admin paneli (88 dosya) |
| `SupplierSetupForm.ts` | 4-adımlı tedarikçi kayıt formu (vergi, banka, TCKN) |
| `ResetPasswordPage.ts` | Şifre sıfırlama sayfası |
| `ApplicationPendingPage.ts` | Satıcı başvuru durumu sayfası |
| `password-validation.ts` | Merkezi şifre doğrulama |
| `tr-validation.ts` | TC Kimlik, VKN, IBAN, telefon doğrulama |
| `tr-tax-offices.ts` | 1008 satırlık Türk vergi daireleri verisi |
| `seller.ts` (ek) | `applicationPendingPage` Alpine bileşeni |
| `auth.ts` (güncel) | `rejected_seller_application`, `seller_application_status` alanları |
| `utils/seller.ts` | Merkezi seller routing utility |
| `LoginPage.ts` (güncel) | Toast entegrasyonu, daha iyi hata yönetimi |
| `ForgotPasswordPage.ts` | Refactored — daha temiz yapı |
| `EmailVerification.ts` | Geliştirilmiş OTP input |
| `auth-guard.ts` | Refactored auth guard |
| `settings/*.ts` | Account edit, password, phone, email, delete bileşenleri güncelleme |
| `i18n/locales/{en,tr}.ts` | ~150 yeni çeviri anahtarı |
| `pages/supplier-setup.ts` | Tedarikçi kurulum sayfası entry point |
| `pages/application-pending.ts` | Başvuru beklemede sayfası |
| `pages/reset-password.ts` | Şifre sıfırlama sayfası |
| `v1/auth.py` | `rejected_seller_application`, `seller_application_status` döndürür |
| `v1/identity.py` | `complete_registration_application` — tam tedarikçi başvuru |

**Ali'nin `getRedirectUrl` mantığı:**
```typescript
// Tüm kullanıcılar (buyer, seller, pending) marketplace'e gider.
// Seller'lar profil dropdown'dan "Mağaza Sayfam" linkiyle store'a gider.
export function getRedirectUrl(user: AuthUser): string {
  if (user.is_admin) return `${FRAPPE_BASE}/app`;
  return '/';
}
```

### 1. Eksik Backend Endpoint'ler (`seller.py`)
Frontend `sellerDashboard` Alpine bileşeni şu endpoint'leri çağırıyor ama backend'de **YOK**:

| Endpoint | Amaç | Durum |
|----------|-------|-------|
| `become_seller` | Satıcı profili oluştur | **EKSİK** |
| `get_my_profile` | Oturumdaki satıcının profili | **EKSİK** |
| `update_profile` | Profil güncelle | **EKSİK** |
| `get_products` | Satıcının ürünleri | **EKSİK** |
| `create_product` | Yeni ürün/listing ekle | **EKSİK** |
| `update_product` | Ürün güncelle | **EKSİK** |
| `delete_product` | Ürün sil | **EKSİK** |
| `get_categories` | Satıcının kategorileri (login gerektiren) | **EKSİK** |
| `create_category` | Yeni kategori | **EKSİK** |
| `update_category` | Kategori güncelle | **EKSİK** |
| `delete_category` | Kategori sil | **EKSİK** |

### 2. Auth DocType Uyumsuzluğu
- `get_current_user` (auth.py) sadece "Seller Profile" kontrol ediyor
- `get_session_user` (v1/auth.py) sadece "Seller Profile" kontrol ediyor
- Ama seller dashboard ve tüm seller API'ler "Admin Seller Profile" kullanıyor
- **Her iki yerde de** Admin Seller Profile fallback eklenmeli

### 3. Ürün Sistemi
- `get_listings` API çalışıyor ama veritabanında listing yok (0 kayıt)
- Seller dashboard'dan ürün oluşturulunca `Listing` DocType'a kayıt yapılması lazım

---

## Chunk 1: Ali'nin Branch'ını Merge Et

### Task 1: Merge origin/Ali → ahmet

**Conflict'leri kullanıcı çözecek.**

- [ ] **Step 1: Ali'nin branch'ını fetch et**

```bash
git fetch origin Ali
```

- [ ] **Step 2: Merge başlat**

```bash
git merge origin/Ali --no-commit
```

- [ ] **Step 3: Conflict durumunu kontrol et**

```bash
git status
```

- [ ] **Step 4: KULLANICI conflict'leri çözer**

Beklenen conflict dosyaları:
- `docker-compose.yml` — Her iki tarafta değişiklik var
- `tradehubback/Dockerfile` — Her iki tarafta
- `tradehubback/entrypoint.sh` — Her iki tarafta
- `tradehubfront/src/utils/auth.ts` — Büyük refactor (Ali) vs mevcut değişiklikler
- `tradehubfront/src/utils/api.ts` — İki tarafta farklı error handling
- `tradehubfront/src/alpine/seller.ts` — Ali'nin `applicationPendingPage` eki
- `tradehubfront/src/components/auth/LoginPage.ts` — Ali'nin toast entegrasyonu
- `tradehubfront/src/components/auth/EmailVerification.ts` — Her iki tarafta
- `tradehubfront/src/components/auth/SupplierSetupForm.ts` — Ali'nin 482 satırlık yeni versiyonu
- `tradehubfront/src/i18n/locales/tr.ts` — ~150 yeni anahtar
- `tradehubfront/src/i18n/locales/en.ts` — ~150 yeni anahtar
- `tradehubfront/src/alpine/auth.ts` — Büyük değişiklik
- `tradehubfront/src/alpine/settings.ts` — Büyük değişiklik
- `tradehubfront/src/components/header/TopBar.ts` — Değişiklik
- `tradehubfront/.env.development` — API URL

**Conflict çözme rehberi — genel kural:**
- **Ali'nin auth bileşenleri** tercih edilmeli (daha kapsamlı)
- **Mevcut backend API'ler** korunmalı (seller.py, listing.py, cart.py, currency.py)
- **Yeni dosyalar** (admin_panel/, tr-validation.ts, vb.) doğrudan eklenecek (conflict yok)

- [ ] **Step 5: Merge commit oluştur**

```bash
git add -A
git commit -m "merge: Ali'nin auth sistemi v2.0 ahmet branch'ına merge edildi"
```

- [ ] **Step 6: TypeScript build kontrolü**

```bash
cd tradehubfront && npx tsc --noEmit 2>&1 | head -30
```

Hata varsa düzelt, yoksa devam.

---

## Chunk 2: Backend Seller API Eksik Endpoint'ler

### Task 2: `become_seller` endpoint'i

**Files:**
- Modify: `tradehubback/apps/tradehub_core/tradehub_core/api/seller.py`

- [ ] **Step 1: `become_seller` fonksiyonu ekle (dosya sonuna)**

```python
@frappe.whitelist()
def become_seller(seller_name, seller_type="Individual", company_name="", tax_id="", phone=""):
    """Oturumdaki kullanıcıyı satıcı yapar. Seller Profile + Admin Seller Profile oluşturur."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)

    if frappe.db.exists("Seller Profile", {"user": user}):
        frappe.throw(_("Zaten bir satici profiliniz var"), frappe.DuplicateEntryError)

    sp = frappe.new_doc("Seller Profile")
    sp.seller_name = seller_name
    sp.user = user
    sp.email = user
    sp.phone = phone or ""
    sp.seller_type = seller_type
    sp.company_name = company_name or ""
    sp.tax_id = tax_id or ""
    sp.status = "Active"
    sp.insert(ignore_permissions=True)

    asp = frappe.new_doc("Admin Seller Profile")
    asp.seller_name = seller_name
    asp.seller_code = sp.seller_code if hasattr(sp, "seller_code") else sp.name
    asp.user = user
    asp.email = user
    asp.phone = phone or ""
    asp.seller_type = seller_type
    asp.company_name = company_name or ""
    asp.tax_id = tax_id or ""
    asp.status = "Active"
    asp.insert(ignore_permissions=True)

    user_doc = frappe.get_doc("User", user)
    user_doc.add_roles("Seller")

    frappe.db.commit()
    return {"success": True, "seller_code": asp.name, "seller_name": seller_name}
```

- [ ] **Step 2: Backend restart ve test**

```bash
docker compose restart backend
curl -s -c /tmp/c.txt -X POST http://localhost:5500/api/method/login -H "Content-Type: application/json" -d '{"usr":"testuser@example.com","pwd":"TestPass1234"}'
curl -s -b /tmp/c.txt -X POST http://localhost:5500/api/method/tradehub_core.api.seller.become_seller -H "Content-Type: application/json" -d '{"seller_name":"Test Seller","seller_type":"Individual"}'
```

### Task 3: Profile CRUD endpoint'leri

- [ ] **Step 1: `get_my_profile` ve `update_profile` ekle**

```python
@frappe.whitelist()
def get_my_profile():
    """Oturumdaki satıcının Admin Seller Profile bilgilerini döndürür."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    profile_name = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not profile_name:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    doc = frappe.get_doc("Admin Seller Profile", profile_name)
    return doc.as_dict()


@frappe.whitelist()
def update_profile(data):
    """Oturumdaki satıcının profilini günceller."""
    import json as _json
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    profile_name = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not profile_name:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    if isinstance(data, str):
        data = _json.loads(data)
    doc = frappe.get_doc("Admin Seller Profile", profile_name)
    safe_fields = [
        "seller_name", "phone", "website", "city", "district", "postal_code",
        "slogan", "description", "logo", "banner_image",
        "company_name", "business_type", "founded_year", "staff_count",
        "annual_revenue", "factory_size", "tax_id", "tax_office", "main_markets",
        "address_line1", "address_line2", "iban",
    ]
    for field in safe_fields:
        if field in data:
            doc.set(field, data[field])
    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return doc.as_dict()
```

### Task 4: Product CRUD endpoint'leri

- [ ] **Step 1: `get_products`, `create_product`, `update_product`, `delete_product` ekle**

```python
@frappe.whitelist()
def get_products():
    """Oturumdaki satıcının Listing'lerini döndürür."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    listings = frappe.get_all(
        "Listing",
        filters={"seller_profile": seller_code},
        fields=["name", "title", "primary_image", "selling_price", "base_price",
                "min_order_qty", "category", "short_description", "status",
                "is_featured", "creation", "modified"],
        order_by="creation desc"
    )
    for l in listings:
        l["product_name"] = l.get("title", "")
        l["image"] = l.get("primary_image", "")
        l["price_min"] = l.get("selling_price") or l.get("base_price", 0)
        l["price_max"] = l.get("base_price", 0)
        l["moq"] = l.get("min_order_qty", 1)
        l["moq_unit"] = "Adet"
    return listings


@frappe.whitelist()
def create_product(data):
    """Yeni Listing oluşturur."""
    import json as _json
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    if isinstance(data, str):
        data = _json.loads(data)
    doc = frappe.new_doc("Listing")
    doc.title = data.get("product_name", "")
    doc.short_description = data.get("description", "")
    doc.primary_image = data.get("image", "")
    doc.selling_price = float(data.get("price_min", 0))
    doc.base_price = float(data.get("price_max", 0))
    doc.min_order_qty = int(data.get("moq", 1))
    doc.category = data.get("category", "")
    doc.is_featured = 1 if data.get("is_featured") else 0
    doc.status = data.get("status", "Active")
    doc.is_visible = 1
    doc.seller_profile = seller_code
    doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"success": True, "name": doc.name, "title": doc.title}


@frappe.whitelist()
def update_product(product_id, data):
    """Listing günceller (sahiplik kontrolü ile)."""
    import json as _json
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    if isinstance(data, str):
        data = _json.loads(data)
    doc = frappe.get_doc("Listing", product_id)
    if doc.seller_profile != seller_code:
        frappe.throw(_("Bu urun size ait degil"), frappe.PermissionError)
    field_map = {
        "product_name": "title", "description": "short_description",
        "image": "primary_image", "price_min": "selling_price",
        "price_max": "base_price", "moq": "min_order_qty",
        "category": "category", "status": "status",
    }
    for src, dst in field_map.items():
        if src in data:
            val = data[src]
            if dst in ("selling_price", "base_price"):
                val = float(val or 0)
            elif dst == "min_order_qty":
                val = int(val or 1)
            doc.set(dst, val)
    if "is_featured" in data:
        doc.is_featured = 1 if data["is_featured"] else 0
    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return {"success": True, "name": doc.name}


@frappe.whitelist()
def delete_product(product_id):
    """Listing siler (sahiplik kontrolü ile)."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    doc = frappe.get_doc("Listing", product_id)
    if doc.seller_profile != seller_code:
        frappe.throw(_("Bu urun size ait degil"), frappe.PermissionError)
    frappe.delete_doc("Listing", product_id, ignore_permissions=True)
    frappe.db.commit()
    return {"success": True}
```

### Task 5: Category CRUD endpoint'leri

- [ ] **Step 1: `get_categories`, `create_category`, `update_category`, `delete_category` ekle**

```python
@frappe.whitelist()
def get_categories():
    """Oturumdaki satıcının Seller Category'lerini döndürür."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    return frappe.get_all(
        "Seller Category",
        filters={"seller": seller_code},
        fields=["name", "category_name", "image", "sort_order"],
        order_by="sort_order asc, category_name asc"
    )


@frappe.whitelist()
def create_category(data):
    """Yeni Seller Category oluşturur."""
    import json as _json
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    if isinstance(data, str):
        data = _json.loads(data)
    doc = frappe.new_doc("Seller Category")
    doc.seller = seller_code
    doc.category_name = data.get("category_name", "")
    doc.image = data.get("image", "")
    doc.sort_order = int(data.get("sort_order", 0))
    doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"success": True, "name": doc.name}


@frappe.whitelist()
def update_category(category_id, data):
    """Seller Category günceller."""
    import json as _json
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    if isinstance(data, str):
        data = _json.loads(data)
    doc = frappe.get_doc("Seller Category", category_id)
    if doc.seller != seller_code:
        frappe.throw(_("Bu kategori size ait degil"), frappe.PermissionError)
    if "category_name" in data:
        doc.category_name = data["category_name"]
    if "image" in data:
        doc.image = data["image"]
    if "sort_order" in data:
        doc.sort_order = int(data["sort_order"])
    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return {"success": True, "name": doc.name}


@frappe.whitelist()
def delete_category(category_id):
    """Seller Category siler."""
    user = frappe.session.user
    if not user or user == "Guest":
        frappe.throw(_("Giris yapmaniz gerekiyor"), frappe.AuthenticationError)
    seller_code = frappe.db.get_value("Admin Seller Profile", {"user": user}, "name")
    if not seller_code:
        frappe.throw(_("Satici profiliniz bulunamadi"), frappe.DoesNotExistError)
    doc = frappe.get_doc("Seller Category", category_id)
    if doc.seller != seller_code:
        frappe.throw(_("Bu kategori size ait degil"), frappe.PermissionError)
    frappe.delete_doc("Seller Category", category_id, ignore_permissions=True)
    frappe.db.commit()
    return {"success": True}
```

---

## Chunk 3: Auth DocType Uyumsuzluk Düzeltme

### Task 6: `get_current_user` — Admin Seller Profile fallback

**Files:**
- Modify: `tradehubback/apps/tradehub_core/tradehub_core/api/auth.py`

- [ ] **Step 1: `get_current_user` içinde "Admin Seller Profile" fallback ekle**

Mevcut `frappe.db.get_value("Seller Profile", ...)` sorgusundan sonra:
```python
    if not seller:
        seller = frappe.db.get_value(
            "Admin Seller Profile",
            {"user": user_email},
            ["name", "seller_name", "seller_code", "status", "logo",
             "health_score", "score_grade"],
            as_dict=True,
        )
```

### Task 7: `get_session_user` — Admin Seller Profile fallback

**Files:**
- Modify: `tradehubback/apps/tradehub_core/tradehub_core/api/v1/auth.py`

- [ ] **Step 1: `has_seller_profile` kontrolüne Admin Seller Profile ekle**

Ali'nin kodu sadece `"Seller Profile"` kontrol ediyor. Sonrasına ekle:
```python
    if not has_seller_profile:
        has_seller_profile = bool(
            frappe.db.exists(
                "Admin Seller Profile",
                {"user": frappe.session.user, "status": "Active"},
            )
        )

    if not seller_profile:
        seller_profile = (
            frappe.db.get_value(
                "Admin Seller Profile", {"user": frappe.session.user}, "name"
            )
            or None
        )
```

---

## Chunk 4: Build, Deploy, End-to-End Test

### Task 8: Backend restart

- [ ] **Step 1: Docker backend restart**

```bash
docker compose restart backend worker scheduler
```

- [ ] **Step 2: Endpoint test**

```bash
curl -s http://localhost:8001/api/method/tradehub_core.api.seller.become_seller 2>&1 | grep -o '"exc_type":[^,]*'
# "become_seller" var ama auth gerekli → AttributeError OLMAMALI
```

### Task 9: Frontend rebuild

- [ ] **Step 1: TypeScript hata kontrolü**

```bash
cd tradehubfront && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 2: Hataları düzelt (varsa)**

- [ ] **Step 3: Docker frontend build**

```bash
docker compose build frontend && docker compose up -d frontend
```

### Task 10: End-to-end tam akış testi

- [ ] **Step 1: Yeni kullanıcı kaydı**

```bash
# 1. Email kontrolü
curl -s -X POST http://localhost:5500/api/method/tradehub_core.api.v1.auth.check_email_exists -H "Content-Type: application/json" -d '{"email":"seller@test.com"}'

# 2. OTP gönder
curl -s -X POST http://localhost:5500/api/method/tradehub_core.api.v1.identity.send_registration_otp -H "Content-Type: application/json" -d '{"email":"seller@test.com"}'

# 3. OTP mailpit'ten al
curl -s http://localhost:8025/api/v1/messages | python3 -c "import sys,json; msgs=json.load(sys.stdin)['messages']; print([m['Subject'] for m in msgs if 'seller@test.com' in m['To'][0]['Address']])"

# 4. OTP doğrula (kodu mailpit'ten al)
# 5. Kayıt tamamla
# 6. Login
curl -s -c /tmp/seller.cookies -X POST http://localhost:5500/api/method/login -H "Content-Type: application/json" -d '{"usr":"seller@test.com","pwd":"TestPass1234"}'
```

- [ ] **Step 2: Satıcı ol**

```bash
curl -s -b /tmp/seller.cookies -X POST http://localhost:5500/api/method/tradehub_core.api.seller.become_seller -H "Content-Type: application/json" -d '{"seller_name":"Test Magaza","seller_type":"Corporate","company_name":"Test Ltd","tax_id":"1234567890","phone":"5551234567"}'
```

- [ ] **Step 3: Dashboard profil yükleme**

```bash
curl -s -b /tmp/seller.cookies -X POST http://localhost:5500/api/method/tradehub_core.api.seller.get_my_profile | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['message']['seller_name'])"
```

- [ ] **Step 4: Ürün ekle**

```bash
curl -s -b /tmp/seller.cookies -X POST http://localhost:5500/api/method/tradehub_core.api.seller.create_product -H "Content-Type: application/json" -d '{"data":{"product_name":"Premium Deri Canta","description":"El yapimi deri canta","price_min":150,"price_max":250,"moq":10,"status":"Active"}}'
```

- [ ] **Step 5: Ürün listede görünsün**

```bash
# Seller'ın ürünleri
curl -s -b /tmp/seller.cookies -X POST http://localhost:5500/api/method/tradehub_core.api.seller.get_products | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Urun sayisi: {len(d[\"message\"])}')"

# Public listing API'den de görünsün
curl -s http://localhost:5500/api/method/tradehub_core.api.listing.get_listings | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Toplam listing: {d[\"message\"][\"total\"]}')"
```

- [ ] **Step 6: Session kontrolü (seller flag'leri)**

```bash
curl -s -b /tmp/seller.cookies http://localhost:5500/api/method/tradehub_core.api.v1.auth.get_session_user | python3 -c "import sys,json; u=json.load(sys.stdin)['message']['user']; print(f'is_seller={u[\"is_seller\"]}, has_profile={u[\"has_seller_profile\"]}')"
```

---

## Yapılacaklar Sırası (Özet)

1. **`git merge origin/Ali`** → Kullanıcı conflict'leri çözer
2. **seller.py** → 11 eksik endpoint ekle
3. **auth.py** → `get_current_user()` Admin Seller Profile fallback
4. **v1/auth.py** → `get_session_user()` Admin Seller Profile fallback
5. **Docker restart** → Backend yeni kodu alsın
6. **Frontend TS hata kontrolü** → Merge sonrası hatalar düzelt
7. **Frontend rebuild** → Docker image yeniden build
8. **End-to-end test** → Register → Login → Become Seller → Add Product → View Products
