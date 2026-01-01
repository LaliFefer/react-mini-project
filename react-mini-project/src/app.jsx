import { useState } from 'preact/hooks' // שונתה/נוספה: מביא useState לנהל מצב ברכיב
import preactLogo from './assets/preact.svg' // ...existing code...
import viteLogo from '/vite.svg' // ...existing code...
import './app.css' // ...existing code...
import { ShowTasksList } from './component/Preparations.jsx' // שורה קיימת/שונתה: ייבוא קומפוננטת התצוגה הראשית
import { ShowItemsTasksList } from './component/statusTasks.jsx'; // שורה קיימת/שונתה: ייבוא דף הפרטים
import { getStandardTasks } from './data/Preparations' // שורה חדשה: ייבוא נתוני המשימות מהקובץ הנכון

export function App() { // שורש הרכיב נשאר אך תוכן שונה
  // אתחול המשימות ממקור הנתונים כאשר הרכיב נוצר
  const initial = getStandardTasks().map((t, i) => ({ id: `${i}-${Date.now()}`, name: t.name, duration: t.duration, favoriteDay: t.favoriteDay, done: false })) // שורה חדשה: יוצר מזהי משימות ותחילת מצב
  const [tasks, setTasks] = useState(initial) // שורה חדשה: state ישמור את רשימת המשימות
  const [view, setView] = useState('list') // שורה חדשה: view יכול להיות 'list' או 'details' לקביעת הדף המוצג

  const toggleDone = (id) => { // שורה חדשה: מטפל בסימון/ביטול של משימה כבוצעה
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)) // שורה חדשה: מעדכן רק את השדה done של המשימה המתאימה
  }

  const openDetails = () => { // שורה חדשה: פותח את דף הפרטים
    setView('details') // שורה חדשה: מעדכן את ה-view ל-details
  }

  const backToList = () => { // שורה חדשה: חוזר לדף הרשימה
    setView('list') // שורה חדשה: מעדכן את ה-view ל-list
  }

  const addTask = (newTask) => { // שורה חדשה: מוסיף משימה חדשה לרשימה
    setTasks(prev => [...prev, newTask]) // שורה חדשה: מוסיף בסוף מערך המשימות
  }

  const updateTask = (updated) => { // שורה חדשה: מעדכן משימה קיימת לפי id
    setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, name: updated.name, duration: updated.duration, favoriteDay: updated.favoriteDay } : t)) // שורה חדשה: מחליף את הפרטים של המשימה המעודכנת
  }

  const deleteTask = (id) => { // שורה חדשה: מוחק משימה לפי id
    setTasks(prev => prev.filter(t => t.id !== id)) // שורה חדשה: מסנן את המשימה הנמחקת מתוך המערך
  }

  return (
    <>
      {/* שיניתי את ה-render: מציג את דף הרשימה או דף הפרטים לפי view */}
      {view === 'list' && (
        <ShowTasksList tasks={tasks} onToggle={toggleDone} onOpenDetails={openDetails} /> // שורה חדשה/שונתה: מעביר handlers לרכיב התצוגה
      )}

      {view === 'details' && (
        <ShowItemsTasksList tasks={tasks} onDelete={deleteTask} onUpdate={updateTask} onAdd={addTask} onBack={backToList} /> // שורה חדשה/שונתה: מעביר handlers לדף הפרטים
      )}
    </>
  )
}

