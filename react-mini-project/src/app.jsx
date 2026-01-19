import { Header } from './component/Header';
import './app.css'
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

// קומפוננטה מוגדרת כפונקציה
function App() {
  // החלק הראשון של הפונקציה מוקדש ללוגיקה - הקוד של הקומפוננטה

  // יצירה של משתנה סטייט
  const [color, setColor] = useState('#fe12ea');
  const [showTasks, setShowTasks] = useState(false);

  const showTasksClicked = () => {
    setShowTasks(!showTasks);
  }

  // הפונקציה מחזירה את החלק הוויזואלי של הקומפוננטה
  return (
    <div className='app'>
    
      <Header color={color} />
      
      <div>
        <ul>
          <li> <NavLink to="/">home</NavLink> </li>
          <li> <NavLink to="/tasks">tasks</NavLink> </li>
          <li> <NavLink to="/shopping">shopping</NavLink> </li>
        </ul>
      </div>

      <Outlet />

      <input type='color' value={color} onChange={event => setColor(event.target.value)}/>

      <button onClick={showTasksClicked} > { showTasks ? 'hide' : 'show' } tasks </button>

      { showTasks ? <div>Tasks Status</div> : ''}
     
    </div>
  )
}

export default App
