import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import ShoppingPage from './component/ShoppingPage'
import './app.css'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import Home from './component/Home.jsx'
import AppTasks from './AppTasks.jsx'


export function App() {
  const [route, setRoute] = useState('home')

  return (
    <div>
      <header style={{ padding: '8px', borderBottom: '1px solid #ddd', display: 'flex', gap: '8px' }}>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('tasks')}>Tasks</button>
        <button onClick={() => setRoute('shopping')}>Shopping</button>
      </header>

      <main style={{ padding: '12px' }}>
        {route === 'home' && <Home setRoute={setRoute} />}
        {route === 'tasks' && <AppTasks />}
        {route === 'shopping' && <ShoppingPage />}
      </main>
    </div>
  )
}
