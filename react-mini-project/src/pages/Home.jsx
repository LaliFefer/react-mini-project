import React from 'react'

export default function Home() {
  return (
    <div style={{padding:20, direction:'rtl'}}>
      <h1>הגדרות שבת</h1>

      <form>
        <div style={{marginBottom:10}}>
          <label>שעת כניסת שבת: </label>
          <input type="time" name="shabbatTime" />
        </div>

        <div style={{marginBottom:10}}>
          <label>מיקום: </label>
          <select name="location">
            <option value="home">בבית</option>
            <option value="travel">נוסעים</option>
          </select>
        </div>

        <div style={{marginBottom:10}}>
          <label>כמות סעודות בבית: </label>
          <input type="number" name="meals" min="0" defaultValue="1" />
        </div>

        <div>
          <button type="button">אפס הגדרות</button>
        </div>
      </form>
    </div>
  )
}
