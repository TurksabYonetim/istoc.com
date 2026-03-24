import frappe
import json

frappe.init(site="tradehub.localhost")
frappe.connect()

# Delete existing shortcuts for this workspace
frappe.db.sql("DELETE FROM `tabWorkspace Shortcut` WHERE parent='Satıcı Paneli'")
frappe.db.commit()

ws = frappe.get_doc("Workspace", "Satıcı Paneli")
ws.shortcuts = []

shortcuts = [
    {"label": "İlanlar", "type": "DocType", "link_to": "Listing"},
    {"label": "İlan Varyantları", "type": "DocType", "link_to": "Listing Variant"},
    {"label": "Satıcı Profili", "type": "DocType", "link_to": "Seller Profile"},
    {"label": "Admin Satıcı Profili", "type": "DocType", "link_to": "Admin Seller Profile"},
    {"label": "Bakiye", "type": "DocType", "link_to": "Seller Balance"},
    {"label": "Ürün Kategorileri", "type": "DocType", "link_to": "Product Category"},
    {"label": "Satıcı Kategorileri", "type": "DocType", "link_to": "Seller Category"},
    {"label": "Kargo Yöntemleri", "type": "DocType", "link_to": "Shipping Method"},
    {"label": "Siparişler", "type": "DocType", "link_to": "Order"},
    {"label": "Sorgular", "type": "DocType", "link_to": "Seller Inquiry"},
    {"label": "Döviz Kurları", "type": "DocType", "link_to": "Currency Rate"},
    {"label": "Kuponlar", "type": "DocType", "link_to": "Coupon"},
]

for s in shortcuts:
    ws.append("shortcuts", s)

content = []

# Section 1: Urun & Ilanlar
content.append({"id": "sp_h1", "type": "header", "data": {"text": '<span class="h4"><b>Ürün & İlanlar</b></span>', "col": 12}})
for i, s in enumerate(ws.shortcuts[:3]):
    content.append({"id": f"sp_s{i}", "type": "shortcut", "data": {"shortcut_name": s.label, "col": 4}})

content.append({"id": "sp_x1", "type": "spacer", "data": {"col": 12}})

# Section 2: Kategori & Kargo
content.append({"id": "sp_h2", "type": "header", "data": {"text": '<span class="h4"><b>Kategori & Kargo</b></span>', "col": 12}})
for i, s in enumerate(ws.shortcuts[5:8]):
    content.append({"id": f"sp_s{i+5}", "type": "shortcut", "data": {"shortcut_name": s.label, "col": 4}})

content.append({"id": "sp_x2", "type": "spacer", "data": {"col": 12}})

# Section 3: Profil & Finans
content.append({"id": "sp_h3", "type": "header", "data": {"text": '<span class="h4"><b>Profil & Finans</b></span>', "col": 12}})
for i, s in enumerate(ws.shortcuts[3:5]):
    content.append({"id": f"sp_s{i+3}", "type": "shortcut", "data": {"shortcut_name": s.label, "col": 4}})

content.append({"id": "sp_x3", "type": "spacer", "data": {"col": 12}})

# Section 4: Siparis & Iletisim
content.append({"id": "sp_h4", "type": "header", "data": {"text": '<span class="h4"><b>Sipariş & İletişim</b></span>', "col": 12}})
for i, s in enumerate(ws.shortcuts[8:]):
    content.append({"id": f"sp_s{i+8}", "type": "shortcut", "data": {"shortcut_name": s.label, "col": 3}})

ws.content = json.dumps(content)
ws.flags.ignore_permissions = True
ws.flags.ignore_links = True
ws.save()
frappe.db.commit()
print(f"OK - {len(ws.shortcuts)} shortcuts added to Satıcı Paneli")
