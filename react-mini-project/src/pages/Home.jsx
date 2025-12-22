/*
הסבר בעברית:
- `Home.jsx` הוא העמוד הראשי שבו המשתמשת יכולה להזין את נתוני השבת הנוכחית.
- הקומפוננטה משתמשת ב־`useShabbat()` כדי לגשת להגדרות הגלובליות ולפונקציות
  שמחזירות Promises (למשל `getShoppingList`) — זו דוגמה לשימוש בפרומיסים.
- יש כאן טופס שמנוהל ב־`useState` מקומי, ושמירה מתבצעת באמצעות `saveSettings`
  שמגיע מהקונטקסט.
- יש `useEffect` אחד שמעדכן את ה-countdown כל דקה — זו דוגמה לשימוש ב־`useEffect`.
- יש עוד `useEffect` שמבקש עדכוני סטטוס אסינכרוניים מהקונטקסט.
*/

import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useShabbat } from '../context/ShabbatContext'
import StatusCard from '../components/StatusCard'

function timeUntil(shabbatTime) {
  // shabbatTime like '18:00' -> compute ms until next occurrence
  const [hh, mm] = shabbatTime.split(':').map(Number)
  const now = new Date()
  const target = new Date(now)
  target.setHours(hh, mm, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 7) // next week
  const diffMs = target - now
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return { hours, mins }
}

export default function Home() {
  const { settings, saveSettings, resetSettings, getShoppingList, getTasksSummary, getCookingSummary } = useShabbat()
  const [local, setLocal] = useState(settings)
  const [countdown, setCountdown] = useState({ hours: 0, mins: 0 })
  const [shoppingStatus, setShoppingStatus] = useState('...')
  const [tasksStatus, setTasksStatus] = useState('...')
  const [cookingStatus, setCookingStatus] = useState('...')
  const [shoppingVariant, setShoppingVariant] = useState('info')
  const [tasksVariant, setTasksVariant] = useState('info')
  const [cookingVariant, setCookingVariant] = useState('info')

  // toast ref
  let toastEl = null

  useEffect(() => {
    setLocal(settings)
  }, [settings])

  useEffect(() => {
    // compute countdown when shabbat time changes
    function update() {
      setCountdown(timeUntil(local.shabbatTime))
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [local.shabbatTime])

  useEffect(() => {
    // show status summaries using promise-based APIs
    let mounted = true
    getShoppingList().then(list => {
      if (!mounted) return
      if (list.length === 0) { setShoppingStatus('הושלם'); setShoppingVariant('success') }
      else { setShoppingStatus(`נדרש ${list.length} פריטים`); setShoppingVariant('warning') }
    })

    getTasksSummary().then(s => {
      if (!mounted) return
      setTasksStatus(`${s.hoursLeft} שעות נשארו`)
      setTasksVariant(s.hoursLeft <= 1 ? 'success' : 'warning')
    })

    getCookingSummary().then(s => {
      if (!mounted) return
      setCookingStatus(`${s.dishesLeft} מנות, בערך ${s.hours} שעות`)
      setCookingVariant(s.dishesLeft === 0 ? 'success' : 'warning')
    })
    return () => { mounted = false }
  }, [local, getShoppingList, getTasksSummary, getCookingSummary])

  function onSubmit(e) {
    e.preventDefault()
    saveSettings(local)
    // show toast using Bootstrap's JS API
    try{
      if (!toastEl) toastEl = document.getElementById('saveToast')
      const bs = window.bootstrap?.Toast
      if (bs && toastEl) new bs(toastEl).show()
    } catch {}
  }

  function onReset() {
    resetSettings()
    setLocal({ shabbatTime: '18:00', location: 'home', mealsCount: 2, guests: false })
  }

  return (
    <section class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <div class="hero p-4 rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <div>
              <h1 class="h3 mb-1">הכנות לשבת — מיידיות וקלות</h1>
              <p class="mb-0 text-muted">הזיני את פרטי השבת ונראה מה נדרש: קניות, משימות ובישולים.</p>
            </div>
            <div class="mt-3 mt-md-0">
              <button class="btn btn-primary me-2" onClick={() => saveSettings(local)}>שמור הגדרות</button>
              <button class="btn btn-outline-secondary" onClick={onReset}>אפס</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6">
          <h2 class="mb-3">הגדרות שבת</h2>
          <form onSubmit={onSubmit} class="row g-3">
            <div class="col-12">
              <label class="form-label">שעת כניסת שבת</label>
              <input class="form-control" type="time" value={local.shabbatTime} onInput={(e) => setLocal({...local, shabbatTime: e.target.value})} />
            </div>
            <div class="col-6">
              <label class="form-label">מיקום</label>
              <select class="form-select" value={local.location} onChange={(e) => setLocal({...local, location: e.target.value})}>
                <option value="home">בבית</option>
                <option value="travel">נוסעים</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label">כמות סעודות בבית</label>
              <input class="form-control" type="number" min="0" value={local.mealsCount} onInput={(e) => setLocal({...local, mealsCount: Number(e.target.value)})} />
            </div>
            <div class="col-12 form-check">
              <input class="form-check-input" type="checkbox" id="guestsCheck" checked={local.guests} onChange={(e) => setLocal({...local, guests: e.target.checked})} />
              <label class="form-check-label" for="guestsCheck">אירוח</label>
            </div>

            <div class="col-12 d-flex gap-2">
              <button type="submit" class="btn btn-primary">שמור</button>
              <button type="button" class="btn btn-outline-secondary" onClick={onReset}>איפוס הגדרות</button>
            </div>
          </form>
        </div>

        <div class="col-12 col-md-6 mt-4 mt-md-0">
          <h3 class="mb-3">סטטוס כללי</h3>
          <div class="row g-3">
            <div class="col-12 col-sm-4"><StatusCard title="קניות" value={shoppingStatus} hint="עבור השבת הנוכחית" variant={shoppingVariant} onClick={() => alert('לך לעמוד קניות כדי לערוך')} /></div>
            <div class="col-12 col-sm-4"><StatusCard title="משימות בית" value={tasksStatus} hint="משך זמן משוער" variant={tasksVariant} onClick={() => alert('לך לעמוד משימות כדי לראות פרטים')} /></div>
            <div class="col-12 col-sm-4"><StatusCard title="בישולים" value={cookingStatus} hint="מנות/שעות" variant={cookingVariant} onClick={() => alert('לך לעמוד בישולים כדי לסמן מוכן')} /></div>
          </div>

          <div class="mt-4 p-3 bg-light rounded">
            <div class="fw-semibold">זמן עד שבת:</div>
            <div>{countdown.hours} שעות ו־{countdown.mins} דקות</div>
          </div>
        </div>
      </div>
        {/* Toast for save confirmation */}
        <div class="position-fixed bottom-0 start-50 translate-middle-x mb-3" style="z-index:2000">
          <div id="saveToast" class="toast align-items-center text-bg-light border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
              <div class="toast-body">ההגדרות נשמרו בהצלחה</div>
              <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </section>
  )
}
