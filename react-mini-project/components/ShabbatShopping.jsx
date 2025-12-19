// קומפוננטת React/Preact: ShabbatShopping.jsx
import React, { useEffect, useState } from 'react'; // ייבוא React והוקי מצב/אפקט
import { getItems, addItem, updateItem, removeItem, clearItems } from '../data/ShabbatShopping'; // פונקציות נתונים

export default function ShabbatShopping() { // הגדרת הקומפוננטה הראשית
	// state
	const [items, setItems] = useState([]); // משתנה מצב למערך הפריטים
	const [form, setForm] = useState({ name: '', quantity: '', note: '' }); // מצב לטופס הוספה
	const [editingId, setEditingId] = useState(null); // מזהה של פריט בעדכון
	const [editForm, setEditForm] = useState({}); // מצב לטופס עריכה

	// load on mount
	useEffect(() => { // ריצה פעם אחת בעת טעינת הקומפוננטה
		setItems(getItems()); // קורא לפריטים מתוך מודול הנתונים ומעדכן סטייט
	}, []); // מערך תלות ריק => פועל פעם אחת

	const refresh = () => setItems(getItems()); // פונקציה קצרה לרענון הפריטים

	// add
	function handleAdd(e) { // מטפל בשליחת הטופס להוספה
		e.preventDefault(); // מונע רענון דף
		if (!form.name.trim()) return; // לא מוסיף אם השדה שם ריק
		try {
			addItem(form); // קורא לפונקציית הוספה
			setForm({ name: '', quantity: '', note: '' }); // מאפס את הטופס
			refresh(); // מרענן את הרשימה
		} catch (err) {
			console.error(err); // מטפל בשגיאות
		}
	}

	// start editing
	function startEdit(item) { // מתחיל מצב עריכה עבור פריט
		setEditingId(item.id); // שומר את ה־id שנערך
		setEditForm({ name: item.name, quantity: item.quantity, note: item.note, checked: item.checked }); // ממלא את הטופס בערכי הפריט
	}

	// save edit
	function saveEdit(id) { // שומר שינויים לפריט
		if (!editForm.name || !editForm.name.trim()) return; // בודק שם תקין
		try {
			updateItem(id, editForm); // קורא לפונקציית עדכון
			setEditingId(null); // סוגר מצב עריכה
			setEditForm({}); // מאפס את טופס העריכה
			refresh(); // מרענן את הרשימה
		} catch (err) {
			console.error(err); // מדפיס שגיאות
		}
	}

	function cancelEdit() { // מבטל עריכה אקטיבית
		setEditingId(null); // מאפס id
		setEditForm({}); // מאפס טופס
	}

	// toggle checked
	function toggleChecked(item) { // מעביר מצב סימון/לא סימון
		updateItem(item.id, { checked: !item.checked }); // עדכון הפריט עם הערך הנגדי
		refresh(); // מרענן תצוגה
	}

	// remove
	function handleRemove(id) { // מטפל במחיקה של פריט
		if (!window.confirm('למחוק את הפריט?')) return; // שואל אישור מהמשתמש
		try {
			removeItem(id); // קורא לפונקציית מחיקה
			refresh(); // מרענן רשימה
		} catch (err) {
			console.error(err); // מטפל בשגיאות
		}
	}

	function handleClearAll() { // מנקה את כל הפריטים
		if (!window.confirm('למחוק את כל הפריטים?')) return; // אישור מהמשתמש
		clearItems(); // קורא לניקיון
		refresh(); // מרענן
	}

	return (
		// JSX: תצוגת הקומפוננטה
		<div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
			{/* כותרת ראשית */}
			<h2>רשימת קניות לשבת</h2>

			{/* טופס הוספה */}
			<form onSubmit={handleAdd} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
				{/* שדה שם */}
				<input
					placeholder="שם פריט" // טקסט מקום
					value={form.name} // קשור לסטייט
					onChange={(e) => setForm({ ...form, name: e.target.value })} // עדכון שדה
					required // חובה
					style={{ flex: 2 }} // גמישות בעיצוב
				/>
				{/* שדה כמות */}
				<input
					placeholder="כמות"
					value={form.quantity}
					onChange={(e) => setForm({ ...form, quantity: e.target.value })}
					style={{ flex: 1 }}
				/>
				{/* שדה הערה */}
				<input
					placeholder="הערה"
					value={form.note}
					onChange={(e) => setForm({ ...form, note: e.target.value })}
					style={{ flex: 1 }}
				/>
				{/* כפתור הוספה */}
				<button type="submit">הוסף</button>
			</form>

			{/* תצוגת הרשימה או הודעת ריק */}
			{items.length === 0 ? (
				<p>הרשימה ריקה.</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{items.map((it) => (
						<li key={it.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}>
							{/* תיבת סימון */}
							<input type="checkbox" checked={!!it.checked} onChange={() => toggleChecked(it)} />
							{editingId === it.id ? (
								// מצב טקסטים לעריכה
								<>
									<input
										value={editForm.name} // שם לעריכה
										onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
										style={{ flex: 2 }}
									/>
									<input
										value={editForm.quantity} // כמות לעריכה
										onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
										style={{ flex: 1 }}
									/>
									<input
										value={editForm.note} // הערה לעריכה
										onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
										style={{ flex: 1 }}
									/>
									<button onClick={() => saveEdit(it.id)}>שמור</button>
									<button onClick={cancelEdit}>בטל</button>
								</>
							) : (
								// מצב תצוגה רגיל
								<>
									<div style={{ flex: 1 }}>
										<strong style={{ textDecoration: it.checked ? 'line-through' : 'none' }}>{it.name}</strong> {/* שם עם קו חוצה אם מסומן */}
										<div style={{ fontSize: 12, color: '#555' }}>{it.quantity} {it.note ? `• ${it.note}` : ''}</div> {/* כמות והערה אם קיימת */}
									</div>
									<button onClick={() => startEdit(it)}>ערוך</button>
									<button onClick={() => handleRemove(it.id)}>מחק</button>
								</>
							)}
						</li>
					))}
				</ul>
			)}

			{/* כפתור לניקוי כל הפריטים */}
			<button onClick={handleClearAll} style={{ marginTop: 12 }}>נקה הכל</button>
		</div>
	);
}
