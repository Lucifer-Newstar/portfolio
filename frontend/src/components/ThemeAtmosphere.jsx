import { useTheme } from '../context/useTheme'

const lightShapes = [
  { type: 'orb', className: 'shape-a', label: 'Royal bloom' },
  { type: 'glass', className: 'shape-b', label: 'Glass ribbon' },
  { type: 'panel', className: 'shape-c', label: 'Paper slab' },
  { type: 'ring', className: 'shape-d', label: 'Halo ring' },
  { type: 'prism', className: 'shape-e', label: 'Warm prism' },
  { type: 'glass', className: 'shape-f', label: 'Ivory lens' },
  { type: 'ring', className: 'shape-g', label: 'Royal orbit' },
]

const darkShapes = [
  { type: 'orb', className: 'shape-a', label: 'Neon core' },
  { type: 'glass', className: 'shape-b', label: 'Signal glass' },
  { type: 'panel', className: 'shape-c', label: 'Control slab' },
  { type: 'ring', className: 'shape-d', label: 'Orbit ring' },
  { type: 'prism', className: 'shape-e', label: 'Pulse prism' },
  { type: 'glass', className: 'shape-f', label: 'Ion pane' },
  { type: 'orb', className: 'shape-g', label: 'Drift core' },
]

function ThemeAtmosphere() {
  const { theme } = useTheme()
  const shapes = theme === 'dark' ? darkShapes : lightShapes

  return (
    <div className={`theme-atmosphere ${theme === 'dark' ? 'is-dark' : 'is-light'}`} aria-hidden="true">
      {shapes.map((shape) => (
        <div key={shape.className} className={`atmo-shape ${shape.type} ${shape.className}`}>
          <div className="atmo-shape-inner">
            <span>{shape.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ThemeAtmosphere
