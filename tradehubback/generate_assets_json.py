#!/usr/bin/env python3
"""Generate assets.json and assets-rtl.json from actual dist files.

This script scans the built dist directories of Frappe and ERPNext apps,
and writes correct assets.json / assets-rtl.json to sites/assets/.
It must run inside the container where apps are installed.
"""
import json
import os
import glob
import re

BENCH = "/home/frappe/frappe-bench"
SITES_ASSETS = os.path.join(BENCH, "sites", "assets")
APPS = [
    ("frappe", os.path.join(BENCH, "apps", "frappe", "frappe", "public")),
    ("erpnext", os.path.join(BENCH, "apps", "erpnext", "erpnext", "public")),
]

BUNDLE_RE = re.compile(r"(.+\.bundle)\.([A-Z0-9]+)\.(js|css)$")


def scan_bundles(app_name, public_dir, subdir):
    """Scan a dist subdirectory and return {canonical_name: asset_path}."""
    result = {}
    pattern = os.path.join(public_dir, "dist", subdir, "*")
    for filepath in glob.glob(pattern):
        if os.path.isfile(filepath) and not filepath.endswith(".map"):
            basename = os.path.basename(filepath)
            match = BUNDLE_RE.match(basename)
            if match:
                canonical = f"{match.group(1)}.{match.group(3)}"
                rel_path = filepath.replace(public_dir, f"/assets/{app_name}")
                result[canonical] = rel_path
    return result


def main():
    assets = {}
    assets_rtl = {}

    for app_name, public_dir in APPS:
        if not os.path.isdir(public_dir):
            continue

        # LTR JS + CSS
        assets.update(scan_bundles(app_name, public_dir, "js"))
        assets.update(scan_bundles(app_name, public_dir, "css"))

        # RTL CSS (keys prefixed with rtl_ as Frappe expects)
        for key, val in scan_bundles(app_name, public_dir, "css-rtl").items():
            assets_rtl[f"rtl_{key}"] = val

    os.makedirs(SITES_ASSETS, exist_ok=True)

    with open(os.path.join(SITES_ASSETS, "assets.json"), "w") as f:
        json.dump(assets, f, indent=4)

    with open(os.path.join(SITES_ASSETS, "assets-rtl.json"), "w") as f:
        json.dump(assets_rtl, f, indent=4)

    print(f"[generate_assets_json] assets.json: {len(assets)} entries, assets-rtl.json: {len(assets_rtl)} entries")


if __name__ == "__main__":
    main()
