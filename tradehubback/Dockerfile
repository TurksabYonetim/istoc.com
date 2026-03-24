FROM frappe/erpnext:v15.101.0
RUN mkdir -p /home/frappe/logs && chown -R frappe:frappe /home/frappe/logs
# Frappe assets/assets.json'u bench kökünde arar; sites/assets'e symlink
RUN ln -sf /home/frappe/frappe-bench/sites/assets /home/frappe/frappe-bench/assets
# tradehub_core'u Python path'e kalıcı olarak ekle
RUN echo "/home/frappe/frappe-bench/apps/tradehub_core" > \
    /home/frappe/frappe-bench/env/lib/python3.11/site-packages/tradehub_core.pth
# Entrypoint: her başlatmada assets.json'u image'daki dist dosyalarından oluşturur
COPY generate_assets_json.py /home/frappe/frappe-bench/generate_assets_json.py
COPY inject_mail_config.py /home/frappe/frappe-bench/inject_mail_config.py
COPY entrypoint.sh /home/frappe/frappe-bench/entrypoint.sh
ENTRYPOINT ["/home/frappe/frappe-bench/entrypoint.sh"]
