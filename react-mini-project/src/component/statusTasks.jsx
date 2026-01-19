import React, { useState } from 'react' // use React and hooks

export function ShowItemsTasksList({ tasks, onDelete, onUpdate, onAdd, onBack }) { // שונה: מקבל props במקום לנסות לטעון נתונים מקומית
  const [editingId, setEditingId] = useState(null) // שורה חדשה: מזהה המשימה שנערך כמצב מקומי
  const [form, setForm] = useState({ name: '', duration: '', favoriteDay: '' }) // שורה חדשה: state לטופס עריכה/הוספה

  const startAdd = () => { // שורה חדשה: מתחיל תהליך הוספה
    setEditingId('new') // שורה חדשה: שימוש במזהה מיוחד ליצירת פריט חדש
    setForm({ name: '', duration: '', favoriteDay: '' }) // שורה חדשה: מאתחל את הטופס
  }

  const startEdit = (task) => { // שורה חדשה: מתחיל עריכה של משימה קיימת
    setEditingId(task.id) // שורה חדשה: שומר את מזהה המשימה שנערך
    setForm({ name: task.name, duration: task.duration || '', favoriteDay: task.favoriteDay || '' }) // שורה חדשה: ממלא את הטופס בערכי המשימה
  }

  const cancel = () => { // שורה חדשה: מבטל עריכה/הוספה
    setEditingId(null) // שורה חדשה: מאפס את מצב העריכה
    setForm({ name: '', duration: '', favoriteDay: '' }) // שורה חדשה: מאפס את הטופס
  }

  const save = () => { // שורה חדשה: שומר שינוי או יוצר משימה חדשה
    if (editingId === 'new') { // שורה חדשה: אם מדובר בהוספה
      const newTask = { id: String(Date.now()), name: form.name, duration: form.duration, favoriteDay: form.favoriteDay, done: false } // שורה חדשה: יוצר אובייקט משימה חדש עם id ייחודי
      onAdd(newTask) // שורה חדשה: קורא ל-handler מ-App כדי להוסיף את המשימה לרשימה
    } else { // שורה חדשה: עדכון משימה קיימת
      const updated = { id: editingId, name: form.name, duration: form.duration, favoriteDay: form.favoriteDay } // שורה חדשה: אובייקט עדכון
      onUpdate(updated) // שורה חדשה: קורא ל-handler מ-App כדי לעדכן את המשימה
    }
    cancel() // שורה חדשה: מאפס מצב אחרי שמירת הנתונים
  }

  return (
    <div>
      <h2>Tasks Details Page</h2> {/* שורה שונתה/נוספה: כותרת דף הפרטים */}
      <button onClick={onBack}>Back to list</button> {/* הוספת כפתור חזרה שמפעיל handler מה-App */}
      <button onClick={startAdd} style={{ marginLeft: '8px' }}>Add New Task</button> {/* כפתור הוספה שמופיע פעם אחת בדף */}

      {/* טופס עריכה/הוספה שמוצג רק כש במצב עריכה/הוספה */}
      {editingId && (
        <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '8px' }}>
          <div>
            <label>שם: <input value={form.name} onInput={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} /></label> {/* שורה חדשה: קלט לשם המשימה שמעדכן את ה-state המקומי */}
          </div>
          <div>
            <label>משך (דקה): <input type="number" value={form.duration} onInput={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))} /></label> {/* שורה חדשה: קלט למשך */}
          </div>
          <div>
            <label>יום מועדף: <input value={form.favoriteDay} onInput={(e) => setForm(prev => ({ ...prev, favoriteDay: e.target.value }))} /></label> {/* שורה חדשה: קלט ליום המועדף */}
          </div>
          <div>
            <button onClick={save}>Save</button> {/* כפתור שמירת טופס */}
            <button onClick={cancel} style={{ marginLeft: '8px' }}>Cancel</button> {/* כפתור ביטול */}
          </div>
        </div>
      )}

      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ marginTop: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
            <div><strong>{task.name}</strong></div> {/* הצגת שם המשימה */}
            <div>Duration: {task.duration || '-'}</div> {/* הצגת משך או מקף אם לא קיים */}
            <div>Favorite day: {task.favoriteDay || '-'}</div> {/* הצגת יום מועדף */}
            <div>Done: {task.done ? 'Yes' : 'No'}</div> {/* הצגת מצב ה-done */}
            <div>
              <button onClick={() => startEdit(task)}>Edit</button> {/* כפתור עריכה שמפעיל את startEdit */}
              <button onClick={() => onDelete(task.id)} style={{ marginLeft: '8px' }}>Delete</button> {/* כפתור מחיקה שמפעיל handler מ-App */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
