#!/bin/bash
set -e

# Generate correct assets.json from actual dist files
python3 /home/frappe/frappe-bench/generate_assets_json.py

# Inject MAIL_* env vars into site_config.json
python3 /home/frappe/frappe-bench/inject_mail_config.py

# Ensure symlinks for app public dirs exist in sites/assets
ASSETS_DIR="/home/frappe/frappe-bench/sites/assets"
for app_dir in /home/frappe/frappe-bench/apps/*/; do
    app_name=$(basename "$app_dir")
    public_dir="$app_dir$app_name/public"
    if [ -d "$public_dir" ]; then
        ln -sfn "$public_dir" "$ASSETS_DIR/$app_name"
    fi
done

# Execute the original command
exec "$@"
