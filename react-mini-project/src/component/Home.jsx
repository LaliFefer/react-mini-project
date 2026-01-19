import { useState, useEffect } from 'preact/hooks';
import { fetchDefaultSettings } from '../data/Home';
import AppTasks from '../AppTasks.jsx'

function Home() {
  const [shabbatTime, setShabbatTime] = useState("");
  const [location, setLocation] = useState("");
  const [numberOfMeals, setNumberOfMeals] = useState(3);
  const [meals, setMeals] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  useEffect(() => {
    fetchDefaultSettings().then((data) => {
      setShabbatTime(data.shabbatTime);
      setLocation(data.location);
      setNumberOfMeals(data.numberOfMeals);
      setMeals(data.isGuesting);
    });
  }, []);

  const handleReset = () => {
    setShabbatTime("");
    setLocation("home");
    setNumberOfMeals(3);
    setMeals(false);
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h2>הגדרות שבת</h2>

      <label>שעת כניסת שבת: </label>
      <input
        type="time"
        value={shabbatTime}
        onChange={(e) => setShabbatTime(e.target.value)}
      />

      <label>מיקום: </label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)} >
        <option value="home">בבית</option>
        <option value="travel">נוסעים</option>
      </select>


      <label>כמות הסעודות שאוכלים בבית: </label>
      <input
        type="number"
        value={numberOfMeals}
        onChange={(e) => setNumberOfMeals(Number(e.target.value))}
      />

      <label> ארוח:</label>
      <input
        type="checkbox"
        checked={meals}
        onChange={(e) => setMeals(e.target.checked)}
      />
      <div style={{ marginTop: '12px' }}>
        <button onClick={handleReset}>איפוס הגדרות</button>
        <button onClick={() => setShowTasks(s => !s)} style={{ marginLeft: '8px' }}>{showTasks ? 'הסתר משימות' : 'הצג משימות'}</button>
        <button onClick={() => setRoute('shopping')} style={{ marginLeft: '8px' }}>לרשימת קניות</button>
      </div>

      {showTasks && <AppTasks />}
    </div>
  );
}

export default Home;