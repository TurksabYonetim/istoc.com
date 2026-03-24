import { ref, onMounted } from 'vue'

const stored = localStorage.getItem('th-theme')
const validStored = (stored === 'light' || stored === 'dark') ? stored : null
const browserPrefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = validStored || (browserPrefersDark ? 'dark' : 'light')
if (!validStored) localStorage.setItem('th-theme', initialTheme)
const currentTheme = ref(initialTheme)

function applyTheme(theme) {
    const root = document.documentElement
    if (theme === 'dark') {
        root.classList.add('dark')
    } else {
        root.classList.remove('dark')
    }
}

applyTheme(currentTheme.value)

export function useTheme() {
    function setTheme(theme) {
        const root = document.documentElement

        // 1. Kill all transitions & animations
        root.classList.add('no-transitions')

        // 2. Toggle theme
        currentTheme.value = theme
        localStorage.setItem('th-theme', theme)
        applyTheme(theme)

        // 3. Force browser to paint the new state immediately
        root.offsetHeight

        // 4. Re-enable transitions on next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                root.classList.remove('no-transitions')
            })
        })
    }

    onMounted(() => {
        applyTheme(currentTheme.value)
    })

    return {
        currentTheme,
        setTheme,
    }
}
