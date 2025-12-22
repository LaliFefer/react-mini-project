/*
הסבר :
- קובץ זה מייצר Context גלובלי בשם `ShabbatContext`.
- הוא שומר הגדרות ברירת מחדל (`defaultSettings`) ומספק פונקציות לשמירה ואיפוס של ההגדרות.
- כדי לדמות תקשורת ל"שרת", מספר פונקציות (כמו `getShoppingList`)
  מחזירות `Promise` — זה מאפשר להתאמן בעבודה עם פרומיסים ו־async.
- ההגדרות נשמרות ב־`localStorage` כדי לשמר מצב בין רענונים.
- שימוש מומלץ: בקומפוננטות השתמשו ב־`useShabbat()` כדי לקבל/לעדכן הגדרות
  ולקבל סיכומי קניות/משימות/בישולים.
*/

import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'

const ShabbatContext = createContext(null)

const defaultSettings = {
  shabbatTime: '18:00',
  location: 'home', // home | travel
  mealsCount: 2,
  guests: false,
}

// Simulated server: return promises
function fetchBaseShoppingList() {
  return Promise.resolve([
    { id: 'hallah', name: 'חלה', qty: 2 },
    { id: 'wine', name: 'יין', qty: 1 },
  ])
}

function fetchMealExtras(mealsCount, guests) {
  // extras per meal
  const extras = []
  if (mealsCount >= 1) extras.push({ id: 'salad', name: 'סלט', qty: mealsCount })
  if (mealsCount >= 2) extras.push({ id: 'main', name: 'מנה עיקרית', qty: mealsCount })
  if (guests) extras.push({ id: 'host-gift', name: 'מתנה למארחים', qty: 1 })
  return Promise.resolve(extras)
}

export function ShabbatProvider(props) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('shabbat:settings')
      return raw ? JSON.parse(raw) : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  function saveSettings(next) {
    const ns = typeof next === 'function' ? next(settings) : next
    setSettings(ns)
    try { localStorage.setItem('shabbat:settings', JSON.stringify(ns)) } catch {}
  }

  async function getShoppingList() {
    const base = await fetchBaseShoppingList()
    const extras = await fetchMealExtras(settings.mealsCount, settings.guests)
    return [...base, ...extras]
  }

  async function getTasksSummary() {
    // simulate tasks remaining time in hours
    const base = 2
    const perGuest = settings.guests ? 1 : 0
    return Promise.resolve({ hoursLeft: base + perGuest })
  }

  async function getCookingSummary() {
    const base = 3
    const perMeal = settings.mealsCount
    return Promise.resolve({ dishesLeft: Math.max(0, perMeal), hours: base + perMeal })
  }

  const value = {
    settings,
    saveSettings,
    getShoppingList,
    getTasksSummary,
    getCookingSummary,
    resetSettings() {
      saveSettings(defaultSettings)
    }
  }

  return <ShabbatContext.Provider value={value}>{props.children}</ShabbatContext.Provider>
}

export function useShabbat() {
  return useContext(ShabbatContext)
}
