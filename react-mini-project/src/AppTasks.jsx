import React, { useState } from 'react'
import { ShowTasksList } from './component/Preparations.jsx'
import { ShowItemsTasksList } from './component/statusTasks.jsx'
import { getStandardTasks } from './data/Preparations'

export default function AppTasks() {
  const initial = getStandardTasks().map((t, i) => ({ id: `${Date.now()}-${i}`, name: t.name, duration: t.duration, favoriteDay: t.favoriteDay, done: false }))
  const [tasks, setTasks] = useState(initial)
  const [view, setView] = useState('list')

  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const openDetails = () => setView('details')
  const backToList = () => setView('list')
  const addTask = (newTask) => setTasks(prev => [...prev, newTask])
  const updateTask = (updated) => setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, name: updated.name, duration: updated.duration, favoriteDay: updated.favoriteDay } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', marginTop: '12px' }}>
      <h3>Task Manager</h3>
      {view === 'list' && (
        <ShowTasksList tasks={tasks} onToggle={toggleDone} onOpenDetails={openDetails} />
      )}

      {view === 'details' && (
        <ShowItemsTasksList tasks={tasks} onDelete={deleteTask} onUpdate={updateTask} onAdd={addTask} onBack={backToList} />
      )}
    </div>
  )
}
