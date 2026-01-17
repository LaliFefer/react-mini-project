// קומפוננטת Preact: ShabbatShopping.jsx
import { useEffect, useState } from 'preact/hooks'; 
import { getItems, addItem, updateItem, removeItem } from '../data/ShabbatShopping';

export default function ShabbatShopping({ filterKind = null }) { // הגדרת הקומפוננטה הראשית עם prop לסינון
	
	const [items, setItems] = useState([]); // משתנה מצב למערך הפריטים
	const [form, setForm] = useState({ name: '', quantity: '', note: '', kind: ['בשבת בבית'] }); // מצב לטופס הוספה עם kind ברירת מחדל
	const [editingId, setEditingId] = useState(null); // מזהה של פריט בעדכון
	const [editForm, setEditForm] = useState({}); // מצב לטופס עריכה
	const [showActions, setShowActions] = useState(false); // האם להראות כפתורי עריכה/מחיקה לכל פריט (ברירת מחדל: false => רק תצוגת תיבות סימון)

	// סינון פריטים לפי filterKind
	const filteredItems = filterKind
		? items.filter(it => it.kind && it.kind.includes(filterKind))
		: items;

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

{/* כפתור עליון שמחליף בין תצוגת "רק סימון" לבין תצוגת "פעולות נוספות" */}
			<div style={{ marginBottom: 12 }}>
				{/* לחיצה על הכפתור תשנה את מצב התצוגה */}
				<button onClick={() => setShowActions(s => !s)}>{showActions ? 'הסתר פעולות נוספות' : 'הצג פעולות נוספות'}</button>
			</div>

			{/* תצוגת הרשימה או הודעת ריק */}
			{filteredItems.length === 0 ? (
				<p>הרשימה ריקה.</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{filteredItems.map((it) => (
						<li key={it.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}>
							{/* תיבת סימון שמסמנת אם הפריט בוצע */}
							<input type="checkbox" checked={!!it.checked} onChange={() => toggleChecked(it)} />

							{/* אם showActions=false - מציגים תצוגה קומפקטית בלבד */}
							{!showActions ? (
								/* קומפקט: שם, כמות והערה, אין כפתורי עריכה/מחיקה */
								<div style={{ flex: 1 }}>
									{/* שם הפריט - אם מסומן מוצג קו חוצה */}
									<strong style={{ textDecoration: it.checked ? 'line-through' : 'none' }}>{it.name}</strong>
									{/* שורה פחות בולטת לכמות/הערה */}
									<div style={{ fontSize: 12, color: '#555' }}>{it.quantity ?? ''} {it.note ? `• ${it.note}` : ''}</div>
								</div>
							) : (
								/* אם showActions=true - מציגים גם כפתורי עריכה ומחיקה */
								editingId === it.id ? (
									/* מצב עריכה: שדות לשינוי ושמירה/ביטול */
									<>
										<input value={editForm.name ?? ''} onChange={(e) => setEditForm({ ...editForm, name: e.currentTarget.value })} style={{ flex: 2 }} />
										<input value={editForm.quantity ?? ''} onChange={(e) => setEditForm({ ...editForm, quantity: e.currentTarget.value })} style={{ flex: 1 }} />
										<input value={editForm.note ?? ''} onChange={(e) => setEditForm({ ...editForm, note: e.currentTarget.value })} style={{ flex: 1 }} />
										<button onClick={() => saveEdit(it.id)}>שמור</button>
										<button onClick={cancelEdit}>בטל</button>
									</>
								) : (
									/* תצוגת פריט עם כפתורי עריכה ומחיקה */	
								<>
										<div style={{ flex: 1 }}>
											<strong style={{ textDecoration: it.checked ? 'line-through' : 'none' }}>{it.name}</strong>
											<div style={{ fontSize: 12, color: '#555' }}>{it.quantity ?? ''} {it.note ? `• ${it.note}` : ''}</div>
										</div>
										<button onClick={() => startEdit(it)}>ערוך</button>
										<button onClick={() => handleRemove(it.id)}>מחק</button>
									</>
								)
								)}
							</li>
						))}
					</ul>
				)}


			</div>
	);

}
