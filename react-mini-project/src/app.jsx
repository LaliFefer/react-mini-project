import { h } from 'preact'
import { useState } from 'preact/hooks'
import './app.css'
import { ShabbatProvider } from './context/ShabbatContext'
import Header from './components/Header'
import Home from './pages/Home'

// הערות :
// קובץ זה מהווה את ה"מסגרת" (layout) של האפליקציה.
// 1. `ShabbatProvider` עוטף את כל האפליקציה ומספק הקשר גלובלי (Context)
//    שבו מאוחסנות הגדרות השבת ופונקציות אסינכרוניות לדוגמה.
// 2. הוספתי `Header` כקומפוננטה נפרדת שמציגה לוגו ותפריט ניווט.
// 3. במקום להשתמש ב-router חיצוני, משתמשים כאן ב-routing פשוט מבוסס state
//    (החלפה של `route` תציג עמוד מתאים). זה מספיק לפרויקט לימודי ופשוט.
// 4. מטרת `App` — להחזיק את הפריסה הכללית בלבד (logo, nav, container),
//    ולא לכלול לוגיקה גדולה או טפסים — אלה עוברים לעמודים נפרדים.

function Placeholder({ title }) {
  return <section><h2>{title}</h2><p>עמוד דמה — עוד יש לממש.</p></section>
}

export function App() {
  const [route, setRoute] = useState('home')

  return (
    <ShabbatProvider>
      <div class="app-root">
        <Header onNavigate={setRoute} />
        <main class="container">
          {route === 'home' && <Home />}
          {route === 'shopping' && <Placeholder title="קניות" />}
          {route === 'tasks' && <Placeholder title="משימות" />}
          {route === 'cooking' && <Placeholder title="בישולים" />}
        </main>
      </div>
    </ShabbatProvider>
  )
}
