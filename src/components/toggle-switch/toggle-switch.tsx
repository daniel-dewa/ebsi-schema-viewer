import { $, component$, Slot, useSignal, useTask$ } from '@builder.io/qwik';
import type { QRL } from '@builder.io/qwik';

type ToggleSwitchProps = {
  value?: boolean;
  onToggle$?: QRL<(newValue: boolean) => void>;
};

export const ToggleSwitch = component$(({ value = false, onToggle$ }: ToggleSwitchProps) => {
  const isOn = useSignal(value);

  useTask$(({ track }) => {
    track(() => value);
    isOn.value = value; // Keep signal in sync with prop
  });

  const toggle = $(async () => {
    isOn.value = !isOn.value;
    if (onToggle$) {
      await onToggle$(isOn.value);
    }
  });

  return (
    <div class="flex items-center space-x-4">
      <span class="text-sm font-medium text-gray-700">
        <Slot />
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn.value}
        onClick$={toggle}
        class={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
          isOn.value ? 'bg-blue-600' : 'bg-gray-300',
        ]}
      >
        <span
          class={[
            'inline-block h-4 w-4 transform rounded-full bg-white transition',
            isOn.value ? 'translate-x-5' : 'translate-x-0',
          ]}
        />
      </button>
    </div>
  );
});
