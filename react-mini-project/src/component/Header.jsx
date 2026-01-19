// Header Component - כותרת עם צבע
function Header({ color = '#3b82f6' }) {
  return (
    <header style={{ backgroundColor: color, padding: '10px', color: 'white', textAlign: 'center' }}>
      <h1>הכנות לשבת</h1>
    </header>
  )
}

export default Header
