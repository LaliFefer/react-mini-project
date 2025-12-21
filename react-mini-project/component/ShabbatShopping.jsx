// קומפוננטת Preact: ShabbatShopping.jsx
import { useEffect, useState } from 'preact/hooks'; // ייבוא הוקים מ־Preact (אין ספריית react בתלויות)
import { Component } from 'preact'; // <-- נוסף כדי לממש ErrorBoundary
import { getItems, addItem, updateItem, removeItem, clearItems } from '../data/ShabbatShopping'; // פונקציות נתונים

export default function ShabbatShopping() { // הגדרת הקומפוננטה הראשית
	// state
	const [items, setItems] = useState([]); // משתנה מצב למערך הפריטים
	const [form, setForm] = useState({ name: '', quantity: '', note: '' }); // מצב לטופס הוספה
	const [editingId, setEditingId] = useState(null); // מזהה של פריט בעדכון
	const [editForm, setEditForm] = useState({}); // מצב לטופס עריכה

	// load on mount
	useEffect(() => { // ריצה פעם אחת בעת טעינת הקומפוננטה
		console.log('ShabbatShopping mounted'); // <-- בדיקת טעינה
		let mounted = true;
		(async () => {
			try {
				const list = await getItems(); // עכשיו getItems() מחזיר Promise
				if (mounted) setItems(list);
			} catch (err) {
				console.error('Failed to load items:', err);
				if (mounted) setItems([]);
			}
		})();
		return () => { mounted = false; };
	}, []); // מערך תלות ריק => פועל פעם אחת

	const refresh = async () => { // רענון אסינכרוני
		try {
			const list = await getItems();
			setItems(list);
		} catch (err) {
			console.error('refresh failed:', err);
			setItems([]);
		}
	};

	// add
	async function handleAdd(e) { // מטפל בשליחת הטופס להוספה
		e.preventDefault();
		if (!form.name.trim()) return;
		try {
			await addItem(form); // כעת מחכים ל־Promise
			setForm({ name: '', quantity: '', note: '' });
			await refresh();
		} catch (err) {
			console.error(err);
		}
	}

	// start editing
	 function startEdit(item) { // מתחיל מצב עריכה עבור פריט
		 setEditingId(item.id); // שומר את ה־id שנערך
		 setEditForm({ name: item.name, quantity: item.quantity, note: item.note, checked: item.checked }); // ממלא את הטופס בערכי הפריט
	}

	// save edit
	async function saveEdit(id) { // שומר שינויים לפריט
		if (!editForm.name || !editForm.name.trim()) return;
		try {
			await updateItem(id, editForm);
			setEditingId(null);
			setEditForm({});
			await refresh();
		} catch (err) {
			console.error(err);
		}
	}

	function cancelEdit() { // מבטל עריכה אקטיבית
		setEditingId(null); // מאפס id
		setEditForm({}); // מאפס טופס
	}

	async function toggleChecked(item) { // מעביר מצב סימון/לא סימון
		try {
			await updateItem(item.id, { checked: !item.checked });
			await refresh();
		} catch (err) {
			console.error(err);
		}
	}

	// remove
	async function handleRemove(id) { // מטפל במחיקה של פריט
		if (!window.confirm('למחוק את הפריט?')) return;
		try {
			await removeItem(id);
			await refresh();
		} catch (err) {
			console.error(err);
		}
	}

	async function handleClearAll() { // מנקה את כל הפריטים
		if (!window.confirm('למחוק את כל הפריטים?')) return;
		try {
			await clearItems();
			await refresh();
		} catch (err) {
			console.error(err);
		}
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
						onChange={(e) => setForm({ ...form, name: e.currentTarget.value })} // עדכון שדה
						required // חובה
						style={{ flex: 2 }} // גמישות בעיצוב
					/>
					{/* שדה כמות */}
					<input
						placeholder="כמות"
						value={form.quantity}
						onChange={(e) => setForm({ ...form, quantity: e.currentTarget.value })}
						style={{ flex: 1 }}
					/>
					{/* שדה הערה */}
					<input
						placeholder="הערה"
						value={form.note}
						onChange={(e) => setForm({ ...form, note: e.currentTarget.value })}
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
								{/* מתקנים: כעת נכונה הצגת הסימון (true => מסומן) */}
								<input type="checkbox" checked={!!it.checked} onChange={() => toggleChecked(it)} />
								{editingId === it.id ? (
									// מצב טקסטים לעריכה
									<>
										<input
											value={editForm.name ?? ''} // שם לעריכה (הגנה מפני undefined)
											onChange={(e) => setEditForm({ ...editForm, name: e.currentTarget.value })}
											style={{ flex: 2 }}
										/>
										<input
											value={editForm.quantity ?? ''} // כמות לעריכה (הגנה)
											onChange={(e) => setEditForm({ ...editForm, quantity: e.currentTarget.value })}
											style={{ flex: 1 }}
										/>
										<input
											value={editForm.note ?? ''} // הערה לעריכה (הגנה)
											onChange={(e) => setEditForm({ ...editForm, note: e.currentTarget.value })}
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
											<div style={{ fontSize: 12, color: '#555' }}>{it.quantity ?? ''} {it.note ? `• ${it.note}` : ''}</div> {/* כמות והערה אם קיימת */}
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
