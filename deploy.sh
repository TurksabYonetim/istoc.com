#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
#  istoc.com — Deploy Script
#  Kod çektikten sonra çalıştır: ./deploy.sh
#  Sadece backend:        ./deploy.sh backend
#  Sadece frontend:       ./deploy.sh frontend
#  Her ikisi (varsayılan): ./deploy.sh all
# ─────────────────────────────────────────────────────────

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

step() { echo -e "\n${CYAN}[$1/$TOTAL] $2${NC}"; }
ok()   { echo -e "${GREEN}  ✔ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
fail() { echo -e "${RED}  ✘ $1${NC}"; exit 1; }

MODE="${1:-all}"

# ─────────────────────────────────────────────────────────
#  Backend deploy
# ─────────────────────────────────────────────────────────
deploy_backend() {
    TOTAL=5
    echo -e "${CYAN}═══ Backend Deploy ═══${NC}"

    # 1) pip install (tradehub_core modülünü güncelle)
    step 1 "pip install -e tradehub_core"
    docker exec istoccom-backend-1 \
        /home/frappe/frappe-bench/env/bin/pip install -e apps/tradehub_core \
        --quiet 2>&1 || fail "pip install başarısız"
    ok "tradehub_core kuruldu"

    # 2) bench migrate (veritabanı şemasını güncelle)
    step 2 "bench migrate"
    docker exec -w /home/frappe/frappe-bench istoccom-backend-1 \
        bench --site tradehub.localhost migrate 2>&1 || warn "migrate atlandı (site sorunu olabilir)"
    ok "Migrasyon tamamlandı"

    # 3) bench build (assets rebuild)
    step 3 "bench build (assets)"
    docker exec -w /home/frappe/frappe-bench istoccom-backend-1 \
        bench --site tradehub.localhost build 2>&1 | tail -5
    ok "Assets yeniden derlendi"

    # 4) bench clear-cache
    step 4 "bench clear-cache"
    docker exec -w /home/frappe/frappe-bench istoccom-backend-1 \
        bench --site tradehub.localhost clear-cache 2>&1 || true
    ok "Cache temizlendi"

    # 5) Container restart
    step 5 "Container restart (backend + worker + scheduler)"
    docker restart istoccom-backend-1 istoccom-worker-1 istoccom-scheduler-1 2>&1
    ok "Container'lar yeniden başlatıldı"
}

# ─────────────────────────────────────────────────────────
#  Frontend deploy
# ─────────────────────────────────────────────────────────
deploy_frontend() {
    TOTAL=2
    echo -e "${CYAN}═══ Frontend Deploy ═══${NC}"

    # 1) Frontend image rebuild
    step 1 "Frontend image rebuild"
    docker compose build frontend 2>&1 | tail -3
    ok "Frontend image build edildi"

    # 2) Frontend container recreate
    step 2 "Frontend container recreate"
    docker compose up -d --force-recreate frontend 2>&1 | tail -3
    ok "Frontend container yeniden oluşturuldu"
}

# ─────────────────────────────────────────────────────────
#  Sağlık kontrolü
# ─────────────────────────────────────────────────────────
health_check() {
    echo -e "\n${CYAN}═══ Sağlık Kontrolü ═══${NC}"
    sleep 5

    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/ 2>/dev/null || echo "000")
    if [ "$BACKEND_STATUS" = "200" ]; then
        ok "Backend: http://localhost:8001 → $BACKEND_STATUS"
    else
        warn "Backend: http://localhost:8001 → $BACKEND_STATUS"
    fi

    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5500/ 2>/dev/null || echo "000")
    if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "304" ]; then
        ok "Frontend: http://localhost:5500 → $FRONTEND_STATUS"
    else
        warn "Frontend: http://localhost:5500 → $FRONTEND_STATUS"
    fi
}

# ─────────────────────────────────────────────────────────
#  Çalıştır
# ─────────────────────────────────────────────────────────
START=$(date +%s)

case "$MODE" in
    backend)  deploy_backend ;;
    frontend) deploy_frontend ;;
    all)      deploy_backend; deploy_frontend ;;
    *)        echo "Kullanım: $0 [backend|frontend|all]"; exit 1 ;;
esac

health_check

END=$(date +%s)
echo -e "\n${GREEN}═══ Deploy tamamlandı! ($(( END - START )) saniye) ═══${NC}"
