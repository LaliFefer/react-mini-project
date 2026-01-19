import Header from './component/Header';
import './app.css'
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='app'>
    
      <Header />
      <div>
        <ul>
          <li> <NavLink to="/">home</NavLink> </li>
          <li> <NavLink to="/tasks">tasks</NavLink> </li>
          <li> <NavLink to="/shopping">shopping</NavLink> </li>
        </ul>
      </div>
      <Outlet />     
    </div>
  )
}

export default App
