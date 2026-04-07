function DepthPrism({ label = 'Depth object', tone = 'royal' }) {
  return (
    <div className={`depth-prism depth-prism-${tone}`} aria-hidden="true">
      <div className="depth-prism-face depth-prism-front">
        <span>{label}</span>
      </div>
      <div className="depth-prism-face depth-prism-back" />
      <div className="depth-prism-face depth-prism-side" />
      <div className="depth-prism-ring depth-prism-ring-1" />
      <div className="depth-prism-ring depth-prism-ring-2" />
    </div>
  )
}

export default DepthPrism
