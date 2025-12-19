
const itemForShabbat = [ 
	{ id: '1', name: 'חלה', quantity: '2', note: '', checked: false },
	{ id: '2', name: 'יין', quantity: '1', note: '', checked: false }, 
	{ id: '3', name: 'בשר', quantity: '5', note: '', checked: false }, 
	{ id: '4', name: 'שתייה', quantity: '2', note: 'קולה', checked: false }, 
	{ id: '5', name: 'דגים', quantity: '5', note: 'סלמון', checked: false }, 
]; 

let items = itemForShabbat.slice(); // עותק של המערך לשימוש דינמי (שינוי ב-items לא ישנה את המקור)

function generateId() { // פונקציה ליצירת מזהה ייחודי
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 9); // שילוב תזמון + רנדום בסיס 36
}

// Public API (פונקציות שנחשפות לשימוש חיצוני)
function getItems() { // מחזיר העתק של המערך הנוכחי כדי למנוע שינוי ישיר
	return items.slice(); // שיכפול המערך
}

/**
 * addItem({ name, quantity, note, checked })
 */
function addItem(item) { // מוסיף פריט חדש
	if (!item || !item.name) throw new Error('Item must have a name'); // בדיקה שהפריט קיים ויש לו שם
	const newItem = {
		id: generateId(), 
		name: item.name, 
		quantity: item.quantity || '', 
		note: item.note || '',
		checked: !!item.checked, 
	};
	items.push(newItem); 
	return newItem; // החזרת הפריט שנוסף
}
/**
 * updateItem(id, { name?, quantity?, note?, checked? })
 */
function updateItem(id, updates) { // מעדכן פריט לפי id
	const idx = items.findIndex(i => i.id === id); // מחפש אינדקס לפי id
	if (idx === -1) throw new Error('Item not found'); // שגיאה אם לא נמצא
	items[idx] = { ...items[idx], ...updates }; // מיזוג העדכונים עם הפריט הקיים
	return items[idx]; // החזרת הפריט המעודכן
}

function removeItem(id) { // מסיר פריט לפי id
	const prevLen = items.length; // אורך לפני המחיקה
	items = items.filter(i => i.id !== id); // סינון כדי להוציא את הפריט
	if (items.length === prevLen) throw new Error('Item not found'); // אם האורך לא השתנה - לא נמצא פריט
	return true; // החזרה שמחיקה הצליחה
}

function clearItems() { // מנקה את כל הפריטים
	items = []; // אפס את המערך
	return []; // מחזיר מערך ריק
}

export { getItems, addItem, updateItem, removeItem, clearItems }; // ייצוא שמות
export default { getItems, addItem, updateItem, removeItem, clearItems }; // ייצוא ברירת מחדל כאובייקט