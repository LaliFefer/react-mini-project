import React, { useState } from 'react'
import ShabbatShopping from './ShabbatShopping'

export default function ShoppingPage() {
  const [filterKind, setFilterKind] = useState(null)

  const kindOptions = [
    { label: 'הכל', value: null },
    { label: 'בשבת בבית', value: 'בשבת בבית' },
    { label: 'סעודה ראשונה', value: 'סעודה ראשונה בבית' },
    { label: 'סעודה שניה', value: 'סעודה שניה בבית' },
    { label: 'סעודה שלישית', value: 'סעודה שלישית בבית' },
    { label: 'נוסעים לשבת', value: 'נוסעים לשבת' }
  ]

  return (
    <div>
      {/* כפתורי סינון */}
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {kindOptions.map(option => (
          <button 
            key={option.value}
            onClick={() => setFilterKind(option.value)}
            style={{ fontWeight: filterKind === option.value ? 'bold' : 'normal' }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* קומפוננטת הרשימה */}
      <ShabbatShopping filterKind={filterKind} />
    </div>
  )
}
