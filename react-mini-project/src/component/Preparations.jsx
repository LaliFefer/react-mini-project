import React from 'react' // React import for JSX

export const ShowTasksList = ({ tasks, onToggle, onOpenDetails }) => { // שונה: עכשיו מקבל props במקום לנהל state פנימי
    return (
        <>
            <h2>The tasks of this Shabat</h2> {/* שורה קיימת אך נשארה */}
            <button onClick={onOpenDetails}>Open details page</button> {/* הוספת כפתור לניווט לדף הפרטים */}
            <ul>
                {tasks.map((element, idx) =>(
                    <li key={element.id}> {/* שונה: משתמש ב-id כ-key */}
                        <label>
                            <input type="checkbox" checked={element.done} onChange={() => onToggle(element.id)} /> {/* שורה שונתה: משתמש ב-onToggle שמתקבל מ-App */}
                            <span style={{ textDecoration: element.done ? 'line-through' : 'none', marginLeft: '8px' }}>{element.name}</span> {/* שונתה: field name במקום text */}
                        </label>
                    </li>
                ))}
           </ul>
        </>
    )
}