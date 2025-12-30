import React, { useState, useEffect, useMemo } from 'react';
import { addNewCookingItem, updateCookingItem, deleteCookingItem, clearAllCookingItems } from '../data/cookin.js';

export default function ShabbatCooking() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', PreparationTime: '', comment: '', done: false });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // טעינה אסינכרונית בהתקבלות הקומפוננטה
    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                // ניסיון לקרוא מ-API (אם קיים)
                const res = await fetch('/api/preparations');
                if (!res.ok) throw new Error('network');
                const data = await res.json();
                if (mounted) setItems(data);
            } catch (e) {
                // Fallback: קריאה מ-localStorage
                const cached = localStorage.getItem('cookingItems');
                if (mounted && cached) {
                    try {
                        setItems(JSON.parse(cached));
                    } catch (err) {
                        console.error('Failed to parse cached items:', err);
                    }
                }
            }
        }
        load();
        return () => { mounted = false; };
    }, []);

    //רענון תקופתי (כל 5 שניות)
    useEffect(() => {
        localStorage.setItem('cookingItems', JSON.stringify(items));
    }, [items]);

    // // חישובי סטטיסטיקות נגזרות מ-items
    // const stats = useMemo(() => {
    //     const count = items.length;
    //     const total = items.reduce((s, i) => {
    //         const time = typeof i.PreparationTime === 'string'
    //             ? parseInt(i.PreparationTime, 10) || 0
    //             : Number(i.PreparationTime || 0);
    //         return s + time;
    //     }, 0);
    //     const avg = count ? total / count : 0;
    //     return { count, total, avg };
    // }, [items]);

    // הוספה
    async function handleAdd(e) {
        e && e.preventDefault && e.preventDefault();
        if (!form.name.trim()) return;
        const newItem = { id: Date.now(), name: form.name, PreparationTime: form.PreparationTime, comment: form.comment, done: !!form.done };
        try {
            const added = await addNewCookingItem(newItem);
            setItems(prev => [...prev, added || newItem]);
            setForm({ name: '', PreparationTime: '', comment: '', done: false });
        } catch (err) {
            console.error('Add item failed:', err);
        }
    }

    // התחלת עריכה
    function startEdit(item) {
        setEditingId(item.id);
        setEditForm({ ...item });
    }

    // שמירת עריכה
    async function saveEdit(id) {
        if (!editForm.name || !editForm.name.trim()) return;
        try {
            const updated = await updateCookingItem(id, editForm);
            setItems(prev => prev.map(item => item.id === id ? (updated || { ...item, ...editForm }) : item));
            setEditingId(null);
            setEditForm({});
        } catch (err) {
            console.error('Save edit failed:', err);
        }
    }

    // סימון כהוכן/לא הוכן
    async function toggleDone(id) {
        try {
            const item = items.find(i => i.id === id);
            if (!item) return;
            const updatedPayload = { ...item, done: !item.done };
            const updated = updateCookingItem(id, updatedPayload);
            setItems(prev => prev.map(i => i.id === id ? (updated || updatedPayload) : i));
            await refresh
        } catch (err) {
            console.error('Toggle done failed:', err);
        }
    }

    // ביטול עריכה
    function cancelEdit() {
        setEditingId(null);
        setEditForm({});
    }

    // מחיקה
    async function handleDelete(id) {
        try {
            const deleted = await deleteCookingItem(id);
            setItems(prev => prev.filter(x => x.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    }

    // נקה הכל
    async function handleClearAll() {
        try {
            await clearAllCookingItems();
            setItems([]);
        } catch (err) {
            console.error('Clear all failed:', err);
        }
    }



    return (
        <div style={{ padding: '20px' }}>
            <h2>Shabbat Cooking Items</h2>

            {/* סטטיסטיקות
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <strong>Stats:</strong> 
                <span style={{ marginLeft: '10px' }}>Count: {stats.count}</span>
                <span style={{ marginLeft: '10px' }}>Total Time: {stats.total}</span>
                <span style={{ marginLeft: '10px' }}>Avg Time: {Math.round(stats.avg * 100) / 100}</span>
            </div> */}

            {/* טופס הוספה */}
            <form onSubmit={handleAdd} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                <input
                    type="text"
                    placeholder="שם המנה"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="זמן הכנה"
                    value={form.PreparationTime}
                    onChange={(e) => setForm({ ...form, PreparationTime: e.target.value })}
                    required
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="הערה"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <label style={{ marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={!!form.done}
                        onChange={(e) => setForm({ ...form, done: e.target.checked })}
                        style={{ marginRight: '6px' }}
                    />
                    הוכן
                </label>
                <button type="submit" style={{ padding: '5px 10px' }}>הוסף</button>
            </form>

            {/* רשימת פריטים */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e0e0e0' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>שם</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>זמן הכנה</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>הערה</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>הוכן</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editingId === item.id ? (
                                <>
                                    <td style={{ padding: '8px' }}>
                                        <input
                                            value={editForm.name || ''}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            style={{ width: '100%', padding: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <input
                                            value={editForm.PreparationTime || ''}
                                            onChange={(e) => setEditForm({ ...editForm, PreparationTime: e.target.value })}
                                            style={{ width: '100%', padding: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        <input
                                            value={editForm.comment || ''}
                                            onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                            style={{ width: '100%', padding: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={!!editForm.done}
                                            onChange={(e) => setEditForm({ ...editForm, done: e.target.checked })}
                                        />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button onClick={() => saveEdit(item.id)} style={{ marginRight: '5px', padding: '4px 8px' }}>שמירה</button>
                                        <button onClick={cancelEdit} style={{ padding: '4px 8px' }}>ביטול</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td style={{ padding: '8px' }}>{item.name}</td>
                                    <td style={{ padding: '8px' }}>{item.PreparationTime}</td>
                                    <td style={{ padding: '8px' }}>{item.comment || '-'}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <input type="checkbox" checked={!!item.done} onChange={() => toggleDone(item.id)} />
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button onClick={() => startEdit(item)} style={{ marginRight: '5px', padding: '4px 8px' }}>עריכה</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 8px', color: 'red' }}>מחיקה</button>

                                    </td>
                                </>
                            )}
                        </tr>

                    ))}
                </tbody>
            </table>
            <button onClick={handleClearAll} style={{ marginTop: 12 }}>נקה הכל</button>
        </div>
    );
}