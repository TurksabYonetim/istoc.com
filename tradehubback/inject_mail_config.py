#!/usr/bin/env python3
"""Inject MAIL_* environment variables into Frappe site_config.json.

Reads environment variables and merges mail settings into the site's
site_config.json. Idempotent — safe to run from multiple containers
that share the same volume. Uses atomic write (tempfile + os.replace)
to prevent race conditions.
"""
import json
import os
import sys
import tempfile

BENCH = "/home/frappe/frappe-bench"
SITE_NAME = os.environ.get("FRAPPE_SITE_NAME", "tradehub.localhost")
SITE_CONFIG = os.path.join(BENCH, "sites", SITE_NAME, "site_config.json")

# Mapping: env var name -> (site_config key, type converter)
ENV_MAP = {
    "MAIL_SERVER": ("mail_server", str),
    "MAIL_PORT": ("mail_port", int),
    "MAIL_USE_SSL": ("use_ssl", int),
    "MAIL_USE_TLS": ("use_tls", int),
    "MAIL_LOGIN": ("mail_login", str),
    "MAIL_PASSWORD": ("mail_password", str),
    "MAIL_DEFAULT_SENDER": ("auto_email_id", str),
    "MAIL_DISABLE_AUTH": ("disable_mail_smtp_authentication", int),
    "HOST_NAME": ("host_name", str),
}


def main():
    if not os.path.exists(SITE_CONFIG):
        print(f"[inject_mail_config] site_config.json not found at {SITE_CONFIG}, skipping")
        sys.exit(0)

    with open(SITE_CONFIG, "r") as f:
        config = json.load(f)

    changed = False
    for env_var, (config_key, converter) in ENV_MAP.items():
        value = os.environ.get(env_var)
        if value is not None:
            converted = converter(value) if value != "" else value
            if config.get(config_key) != converted:
                config[config_key] = converted
                changed = True

    if changed:
        # Atomic write: write to temp file then rename
        fd, tmp_path = tempfile.mkstemp(dir=os.path.dirname(SITE_CONFIG))
        with os.fdopen(fd, "w") as f:
            json.dump(config, f, indent=1)
            f.write("\n")
        os.replace(tmp_path, SITE_CONFIG)
        print(f"[inject_mail_config] Updated mail settings in {SITE_CONFIG}")
    else:
        print(f"[inject_mail_config] No changes needed in {SITE_CONFIG}")


if __name__ == "__main__":
    main()
