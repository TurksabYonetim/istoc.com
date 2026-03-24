/**
 * NewBuyerInfo Component
 * White card composing UserInfoCard + OperationSlider.
 */

import type { NewBuyerInfoProps } from '../../types/buyerDashboard';
import { UserInfoCard } from './UserInfoCard';
import { OperationSlider, initOperationSlider } from './OperationSlider';

export function NewBuyerInfo(props: NewBuyerInfoProps): string {
  return `
    <div class="bg-(--color-surface,#ffffff) rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_12px_0_rgba(0,0,0,0.12)]">
      ${UserInfoCard({ user: props.user, stats: props.stats })}
      ${OperationSlider({ notifications: props.notifications })}
    </div>
  `;
}

export function initNewBuyerInfo(): void {
  initOperationSlider();
}
