/**
 * Checkbox Atom
 * Alpine.js-powered custom checkbox with checked + indeterminate visuals.
 * Registered as Alpine.data('checkbox') in src/alpine.ts.
 */

export interface CheckboxProps {
  id: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange?: string;
  disabled?: boolean;
}

export function Checkbox({ id, checked, indeterminate = false, onChange, disabled = false }: CheckboxProps): string {
  const checkedAttr = checked ? 'checked' : '';
  const indeterminateAttr = indeterminate ? 'data-indeterminate="true"' : '';
  const onChangeAttr = onChange ? `data-onchange="${onChange}"` : '';
  const disabledAttr = disabled ? 'disabled' : '';
  const disabledCursor = disabled ? 'cursor-not-allowed opacity-50' : '';

  const checkVisible = checked ? 'block' : 'hidden';
  const dashVisible = indeterminate && !checked ? 'block' : 'hidden';

  return `
    <label class="next-checkbox-wrapper inline-flex items-center cursor-pointer select-none ${disabledCursor}" for="${id}"
      x-data="checkbox">
      <input
        type="checkbox"
        id="${id}"
        class="next-checkbox-input sr-only"
        data-checkbox
        ${checkedAttr}
        ${indeterminateAttr}
        ${onChangeAttr}
        ${disabledAttr}
        x-ref="input"
        x-effect="$el.indeterminate = indeterminate"
        @change="handleChange()"
        :aria-checked="indeterminate ? 'mixed' : String(checked)"
      />
      <span class="next-checkbox relative inline-flex w-5 h-5 rounded-[4px] border transition-colors duration-150"
        :class="(checked || indeterminate) ? 'border-transparent bg-cta-primary text-white' : 'border-border-strong bg-surface text-transparent'">
        <svg class="next-checkbox-check absolute inset-0 m-auto ${checkVisible}"
          :class="checked ? 'block' : 'hidden'"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m5 13 4 4L19 7"/>
        </svg>
        <span class="next-checkbox-dash absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded ${dashVisible}"
          :class="(indeterminate && !checked) ? 'block' : 'hidden'"
          aria-hidden="true"></span>
      </span>
    </label>
  `.trim();
}

/** @deprecated Alpine.js manages checkbox behavior declaratively now. Kept as no-op for backward compatibility. */
export function initCheckbox(_container?: HTMLElement): void {
  // No-op — Alpine.data('checkbox') handles all behavior declaratively.
}
