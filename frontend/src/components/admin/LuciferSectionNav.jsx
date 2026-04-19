import { NavLink } from 'react-router-dom'

function LuciferSectionNav({ items = [] }) {
  if (!items.length) return null

  return (
    <nav className="lucifer-section-nav" aria-label="Lucifer page sections">
      {items.map((item) => (
        <NavLink
          key={item.id}
          className={({ isActive }) => `lucifer-section-chip ${isActive || item.isActive ? 'is-active' : ''}`.trim()}
          to={item.href || `#${item.id}`}
          end
        >
          <strong>{item.label}</strong>
          <span>{item.detail}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default LuciferSectionNav
