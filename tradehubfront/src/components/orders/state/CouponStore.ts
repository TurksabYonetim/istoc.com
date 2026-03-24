/**
 * CouponStore — Geriye dönük uyumluluk için boş stub.
 * Kupon verileri artık doğrudan Alpine bileşeni tarafından
 * tradehub_core.api.cart.get_buyer_coupons endpoint'inden çekilmektedir.
 */

export class CouponStore {
  load(): void {}
  getCoupons(): never[] { return []; }
  getByStatus(): never[] { return []; }
  useCoupon(_code: string): boolean { return false; }
  getCreditBalance(): number { return 0; }
  getCreditHistory(): never[] { return []; }
  subscribe(_listener: () => void): () => void { return () => {}; }
}

export const couponStore = new CouponStore();
