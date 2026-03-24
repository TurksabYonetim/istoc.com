import { ref } from 'vue'

const active = ref(null)

export function useOverlay() {
  function toggle(name) {
    active.value = active.value === name ? null : name
  }

  function close() {
    active.value = null
  }

  return { active, toggle, close }
}
