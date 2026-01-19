/**
 * React Router Configuration - בסגנון מתקדם עם Nested Routes
 * 
 * זה קובץ הגדרת הניווט המרכזי של האפליקציה
 * כאן מוגדרים כל הנתיבים, routing nesting, וloaders
 */

import { createBrowserRouter } from 'react-router-dom'
import App from './app'
import Home from './component/Home.jsx'
import AppTasks from './AppTasks.jsx'
import ShoppingPage from './component/ShoppingPage.jsx'

/**
 * הגדרת כל הנתיבים
 * זה הקוד הראשי שמנהל את כל הניווט בתוכנה
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tasks',
        element: <AppTasks />,
      },
      {
        path: 'shopping',
        element: <ShoppingPage />,
      },
    ],
  },
])

export default router
