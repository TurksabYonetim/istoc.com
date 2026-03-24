import os
import frappe.app

# Frappe'ın sites dizinini ve site adını env'den al
frappe.app._sites_path = os.environ.get("SITES_PATH", "sites")
frappe.app._site = os.environ.get("FRAPPE_SITE_NAME", "tradehub.localhost")

# Statik dosyaları gunicorn'dan serve et (SharedDataMiddleware)
# bench serve'deki application_with_statics() ile aynı davranış
if not os.environ.get("NO_STATICS"):
    frappe.app.application = frappe.app.application_with_statics()

application = frappe.app.application
