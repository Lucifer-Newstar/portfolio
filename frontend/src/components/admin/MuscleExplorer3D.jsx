import { useEffect, useMemo, useState } from 'react'
import { EXERCISE_GROUPS, EXERCISE_LIBRARY, MUSCLE_LOOKUP, getExercisesByMuscle } from '../../data/luciferExerciseData'

const VIEW_MODES = [
  { id: 'front', label: 'Front', hint: 'Pressing chain, abs, quads' },
  { id: 'back', label: 'Back', hint: 'Posterior chain, lats, glutes' },
  { id: 'split', label: 'Dual', hint: 'Front and back together' },
]

const SURFACE_META = {
  front: { label: 'Anterior view', shortLabel: 'Front' },
  back: { label: 'Posterior view', shortLabel: 'Back' },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const SURFACE_LOOKUP = {
  'pec-major-clavicular': 'front',
  'pec-major-sternal': 'front',
  'pec-minor': 'front',
  'anterior-deltoid': 'front',
  'lateral-deltoid': 'front',
  'posterior-deltoid': 'back',
  'rotator-cuff': 'back',
  lats: 'back',
  traps: 'back',
  rhomboids: 'back',
  'erector-spinae': 'back',
  'teres-major': 'back',
  'serratus-anterior': 'front',
  'biceps-brachii': 'front',
  brachialis: 'front',
  brachioradialis: 'front',
  'triceps-long': 'back',
  'triceps-lateral': 'back',
  'triceps-medial': 'back',
  'forearm-flexors': 'front',
  'forearm-extensors': 'back',
  'rectus-femoris': 'front',
  'vastus-lateralis': 'front',
  'vastus-medialis': 'front',
  'vastus-intermedius': 'front',
  'biceps-femoris': 'back',
  semitendinosus: 'back',
  semimembranosus: 'back',
  'glute-maximus': 'back',
  'glute-medius': 'back',
  'glute-minimus': 'back',
  gastrocnemius: 'back',
  soleus: 'back',
  'hip-adductors': 'front',
  tfl: 'front',
  'rectus-abdominis': 'front',
  'external-obliques': 'front',
  'internal-obliques': 'front',
  'transverse-abdominis': 'front',
  'quadratus-lumborum': 'back',
  multifidus: 'back',
  scm: 'front',
  'levator-scapulae': 'back',
}

const MUSCLE_COLOR_LOOKUP = {
  chest: '#ff6b1b',
  shoulders: '#e53b12',
  back: '#ff8a22',
  biceps: '#ffd426',
  triceps: '#ffd426',
  forearms: '#63c91f',
  quadriceps: '#2d44b5',
  hamstrings: '#7a19c9',
  glutes: '#0d7aa6',
  calves: '#a300af',
  hips: '#0b8d7f',
  core: '#0f8b7a',
  neck: '#cc1515',
}

const SHAPE_LOOKUP = {
  'pec-major-clavicular': { type: 'path', d: 'M118 143 C129 125 144 116 160 116 C151 132 145 147 143 162 C133 160 124 154 118 143 Z' },
  'pec-major-sternal': { type: 'path', d: 'M120 161 C132 152 146 149 160 149 C160 181 155 205 143 228 C129 215 120 193 118 171 Z' },
  'pec-minor': { type: 'path', d: 'M144 169 C149 161 154 158 160 158 C157 177 153 189 147 198 C143 190 141 180 144 169 Z' },
  'anterior-deltoid': { type: 'path', d: 'M90 147 C98 133 110 128 122 131 C124 153 120 176 108 194 C95 184 87 169 86 155 Z' },
  'lateral-deltoid': { type: 'path', d: 'M84 149 C96 137 110 133 123 136 C126 158 121 181 109 198 C96 189 87 173 84 149 Z' },
  'posterior-deltoid': { type: 'path', d: 'M89 150 C98 136 111 131 122 134 C124 156 119 177 107 193 C95 184 88 169 89 150 Z' },
  'rotator-cuff': { type: 'path', d: 'M108 163 C114 154 121 150 129 151 C127 165 123 177 117 188 C110 181 107 172 108 163 Z' },
  lats: { type: 'path', d: 'M119 207 C98 214 85 233 81 259 C84 302 98 333 123 366 C136 329 143 286 143 240 C137 224 130 214 119 207 Z' },
  traps: { type: 'path', d: 'M126 110 C140 100 150 97 160 97 C170 97 180 100 194 110 C192 138 181 163 160 185 C139 163 128 138 126 110 Z' },
  rhomboids: { type: 'path', d: 'M138 180 C147 169 154 164 160 163 C166 164 173 169 182 180 C176 205 169 226 160 243 C151 226 144 205 138 180 Z' },
  'erector-spinae': { type: 'path', d: 'M150 236 C154 232 157 231 160 231 C163 231 166 232 170 236 C171 284 170 328 166 373 C164 405 162 433 160 459 C158 433 156 405 154 373 C150 328 149 284 150 236 Z' },
  'teres-major': { type: 'path', d: 'M114 194 C121 187 128 184 135 185 C133 197 129 210 122 221 C116 215 113 205 114 194 Z' },
  'serratus-anterior': { type: 'parts', items: [
    { type: 'path', d: 'M116 205 C125 201 132 204 136 210 C132 219 128 227 122 233 C117 228 114 220 116 205 Z' },
    { type: 'path', d: 'M114 223 C123 219 130 223 134 229 C130 238 126 246 120 252 C115 247 112 239 114 223 Z' },
    { type: 'path', d: 'M112 242 C121 238 128 242 132 248 C128 257 124 265 118 271 C113 266 110 258 112 242 Z' },
  ]},
  'biceps-brachii': { type: 'path', d: 'M69 210 C84 212 95 224 98 241 C98 274 92 299 80 321 C67 314 60 298 58 276 C59 244 62 223 69 210 Z' },
  brachialis: { type: 'path', d: 'M79 225 C88 228 94 238 95 250 C93 276 88 295 80 309 C72 301 67 289 67 273 C69 251 72 235 79 225 Z' },
  brachioradialis: { type: 'path', d: 'M62 319 C73 322 81 334 83 348 C82 380 77 406 66 429 C55 424 49 411 48 394 C50 363 54 338 62 319 Z' },
  'triceps-long': { type: 'path', d: 'M64 210 C79 213 91 226 96 244 C94 275 88 301 77 321 C64 315 57 300 54 279 C54 245 57 223 64 210 Z' },
  'triceps-lateral': { type: 'path', d: 'M53 220 C61 222 68 229 71 241 C70 266 66 286 58 303 C50 297 46 287 45 273 C46 252 49 233 53 220 Z' },
  'triceps-medial': { type: 'path', d: 'M73 223 C81 225 87 233 90 245 C89 268 85 287 78 302 C71 297 67 288 66 275 C67 256 70 237 73 223 Z' },
  'forearm-flexors': { type: 'path', d: 'M52 331 C66 332 78 343 81 358 C80 400 73 437 60 469 C47 460 40 445 38 422 C39 384 43 350 52 331 Z' },
  'forearm-extensors': { type: 'path', d: 'M51 329 C66 331 77 342 81 358 C80 400 73 437 60 469 C47 462 40 447 38 424 C39 384 43 350 51 329 Z' },
  'rectus-femoris': { type: 'path', d: 'M145 412 C156 418 163 431 164 448 C163 523 155 590 143 652 C133 644 127 631 125 614 C126 544 133 477 145 412 Z' },
  'vastus-lateralis': { type: 'path', d: 'M121 407 C137 412 149 427 151 446 C148 530 138 607 121 678 C105 668 95 651 91 625 C93 548 104 474 121 407 Z' },
  'vastus-medialis': { type: 'path', d: 'M154 452 C164 458 170 470 171 486 C168 537 161 583 149 626 C139 617 134 605 133 590 C135 542 142 495 154 452 Z' },
  'vastus-intermedius': { type: 'path', d: 'M137 418 C147 424 153 437 154 453 C151 518 145 578 135 635 C126 626 121 613 120 597 C121 535 127 475 137 418 Z' },
  'biceps-femoris': { type: 'path', d: 'M119 408 C136 414 148 429 151 448 C149 530 140 604 123 673 C108 663 98 647 94 622 C95 547 104 473 119 408 Z' },
  semitendinosus: { type: 'path', d: 'M139 414 C149 420 155 432 157 448 C155 517 148 580 138 640 C129 630 123 618 122 602 C123 536 129 474 139 414 Z' },
  semimembranosus: { type: 'path', d: 'M152 420 C161 427 166 439 167 455 C165 512 159 564 149 612 C141 603 136 592 135 578 C136 524 142 472 152 420 Z' },
  'glute-maximus': { type: 'path', d: 'M124 349 C137 341 149 337 160 338 C160 370 153 395 139 416 C126 407 118 391 116 371 C117 362 119 355 124 349 Z' },
  'glute-medius': { type: 'path', d: 'M117 337 C126 331 135 329 143 331 C141 345 137 356 130 365 C122 360 117 351 116 340 Z' },
  'glute-minimus': { type: 'path', d: 'M123 347 C129 342 135 340 140 341 C138 351 135 360 130 366 C125 362 122 355 123 347 Z' },
  gastrocnemius: { type: 'parts', items: [
    { type: 'path', d: 'M124 640 C136 646 144 659 145 675 C143 721 135 763 123 802 C111 791 103 774 100 752 C102 711 110 671 124 640 Z' },
    { type: 'path', d: 'M141 646 C151 652 157 665 158 680 C157 720 151 757 142 792 C133 785 128 773 127 758 C128 720 132 682 141 646 Z' },
  ]},
  soleus: { type: 'path', d: 'M135 690 C143 696 148 707 149 721 C147 757 142 789 134 819 C126 811 121 800 120 786 C121 752 126 719 135 690 Z' },
  'hip-adductors': { type: 'path', d: 'M155 415 C164 422 168 433 168 447 C166 505 160 557 149 605 C140 597 135 585 134 570 C136 512 143 459 155 415 Z' },
  tfl: { type: 'path', d: 'M120 386 C127 381 133 379 139 380 C139 392 136 402 131 411 C124 407 120 399 120 386 Z' },
  'rectus-abdominis': { type: 'parts', items: [
    { type: 'path', d: 'M146 202 C151 197 156 195 160 195 C159 211 157 225 152 237 C147 232 145 220 146 202 Z' },
    { type: 'path', d: 'M145 239 C150 234 155 232 160 232 C159 248 157 262 152 274 C147 269 145 257 145 239 Z' },
    { type: 'path', d: 'M144 276 C149 271 154 269 160 269 C159 286 157 300 152 313 C146 308 144 295 144 276 Z' },
    { type: 'path', d: 'M143 315 C148 310 153 308 160 308 C159 329 156 347 150 362 C145 356 143 342 143 315 Z' },
  ]},
  'external-obliques': { type: 'path', d: 'M113 218 C126 211 137 214 144 223 C141 260 135 292 127 321 C114 312 106 296 103 273 C104 251 107 232 113 218 Z' },
  'internal-obliques': { type: 'path', d: 'M123 238 C133 232 141 235 147 243 C145 274 140 301 133 325 C123 318 117 306 114 289 C115 269 118 250 123 238 Z' },
  'transverse-abdominis': { type: 'path', d: 'M129 309 C139 302 149 299 160 299 C157 326 152 347 145 364 C135 357 129 345 127 330 C127 321 128 315 129 309 Z' },
  'quadratus-lumborum': { type: 'path', d: 'M132 302 C139 297 145 296 151 298 C149 321 145 342 139 362 C132 356 128 347 127 335 C128 322 130 311 132 302 Z' },
  multifidus: { type: 'path', d: 'M154 222 C157 218 159 217 160 217 C161 217 163 218 166 222 C166 270 164 316 160 360 C156 316 154 270 154 222 Z' },
  scm: { type: 'path', d: 'M147 96 C151 92 155 90 160 90 C158 109 154 125 148 138 C144 130 143 118 147 96 Z' },
  'levator-scapulae': { type: 'path', d: 'M142 114 C147 108 153 105 160 105 C157 126 152 145 144 162 C139 154 137 143 138 129 Z' },
}

function getMuscleSurface(muscle) {
  return SURFACE_LOOKUP[muscle.baseId] || 'front'
}

function FigureBlueprint({ surface }) {
  const viewLabel = SURFACE_META[surface].label

  return (
    <svg className="muscle-figure-blueprint" viewBox="0 0 320 840" role="img" aria-label={`${viewLabel} interactive muscle atlas`}>
      <g className="muscle-figure-blueprint__shadow" aria-hidden="true">
        <ellipse cx="160" cy="802" rx="74" ry="22" />
      </g>

      <g className="muscle-figure-blueprint__body" aria-hidden="true">
        <path d="M140 27 C150 18 170 18 180 27 C188 34 191 46 191 62 C191 86 185 103 174 116 C167 123 153 123 146 116 C135 103 129 86 129 62 C129 46 132 34 140 27 Z" className="body-part body-part--head" />
        <path d="M128 63 C122 63 118 68 117 75 C116 87 118 97 124 104 C129 99 132 91 133 81 C133 72 132 66 128 63 Z" className="body-part body-part--ear" />
        <path d="M192 63 C198 63 202 68 203 75 C204 87 202 97 196 104 C191 99 188 91 187 81 C187 72 188 66 192 63 Z" className="body-part body-part--ear" />
        <path d="M146 116 C151 112 156 110 160 110 C164 110 169 112 174 116 L177 140 C171 146 166 150 160 150 C154 150 149 146 143 140 Z" className="body-part body-part--neck" />
        <path d="M101 143 C118 124 138 116 160 116 C182 116 202 124 219 143 C226 165 230 190 231 218 C228 268 220 311 206 349 C203 363 201 382 200 405 C197 442 193 482 188 524 L186 708 C185 735 179 758 170 778 L164 782 L160 744 L156 782 L150 778 C141 758 135 735 134 708 L132 524 C127 482 123 442 120 405 C119 382 117 363 114 349 C100 311 92 268 89 218 C90 190 94 165 101 143 Z" className={`body-part body-part--torso body-part--${surface}`} />
        <path d="M87 148 C75 161 67 181 64 206 C63 239 66 272 73 303 C77 327 83 349 92 370 L96 417 C95 432 92 446 87 458 L76 454 C71 441 68 424 67 404 L60 346 C54 309 51 272 52 234 C53 197 61 171 76 152 Z" className="body-part body-part--arm-shell" />
        <path d="M233 148 C245 161 253 181 256 206 C257 239 254 272 247 303 C243 327 237 349 228 370 L224 417 C225 432 228 446 233 458 L244 454 C249 441 252 424 253 404 L260 346 C266 309 269 272 268 234 C267 197 259 171 244 152 Z" className="body-part body-part--arm-shell" />
        <path d="M76 454 C72 482 70 512 69 543 C69 574 72 604 78 631 C83 649 83 667 78 687 L70 715 L75 731 L87 706 C95 675 101 642 103 607 C103 567 100 525 94 480 Z" className="body-part body-part--hand-shell" />
        <path d="M244 454 C248 482 250 512 251 543 C251 574 248 604 242 631 C237 649 237 667 242 687 L250 715 L245 731 L233 706 C225 675 219 642 217 607 C217 567 220 525 226 480 Z" className="body-part body-part--hand-shell" />
        <path d="M132 524 C121 573 115 620 112 665 C111 716 109 756 105 785 L93 812 L102 821 L120 799 C129 768 136 728 140 686 C145 633 148 581 149 529 Z" className="body-part body-part--leg-shell" />
        <path d="M188 524 C199 573 205 620 208 665 C209 716 211 756 215 785 L227 812 L218 821 L200 799 C191 768 184 728 180 686 C175 633 172 581 171 529 Z" className="body-part body-part--leg-shell" />
        <path d="M93 812 C85 818 79 829 76 840 C77 845 84 846 96 844 C110 842 121 835 128 824 C123 816 112 812 93 812 Z" className="body-part body-part--foot" />
        <path d="M227 812 C235 818 241 829 244 840 C243 845 236 846 224 844 C210 842 199 835 192 824 C197 816 208 812 227 812 Z" className="body-part body-part--foot" />
      </g>

      <g className="muscle-figure-blueprint__guides" aria-hidden="true">
        <path d="M160 115 L160 782" />
        <path d="M120 170 Q160 188 200 170" />
        <path d="M126 258 Q160 274 194 258" />
        <path d="M132 360 Q160 374 188 360" />
        <path d="M132 506 Q160 492 188 506" />
        <path d="M126 650 Q160 636 194 650" />
        <path d="M122 760 Q160 748 198 760" />
      </g>
    </svg>
  )
}

function renderPrimitive(shape, side, key) {
  const mirror = side === 'right' ? 'scale(-1, 1)' : ''
  const baseTransform = side === 'right' ? 'translate(-320 0)' : ''
  const rotate = shape.rotate ? ` rotate(${side === 'right' ? -shape.rotate : shape.rotate} ${shape.cx} ${shape.cy})` : ''
  const transform = `${baseTransform} ${mirror}${rotate}`.trim()

  if (shape.type === 'ellipse') {
    return <ellipse key={key} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} transform={transform || undefined} />
  }

  return <path key={key} d={shape.d} transform={transform || undefined} />
}

function renderShape(shape, side) {
  if (shape.type === 'parts') {
    return shape.items.map((item, index) => renderPrimitive(item, side, `${side}-${index}`))
  }

  return renderPrimitive(shape, side, `${side}-single`)
}

function MuscleNode({ muscle, panelSurface, active, selected, muted, onHover, onSelect }) {
  const shape = SHAPE_LOOKUP[muscle.baseId]
  if (!shape) return null
  const fillColor = MUSCLE_COLOR_LOOKUP[muscle.groupId] || '#ff8a22'

  return (
    <g
      className={[
        'muscle-node',
        active ? 'is-active' : '',
        selected ? 'is-selected' : '',
        muted ? 'is-muted' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--muscle-fill': fillColor }}
      role="button"
      tabIndex={0}
      aria-label={`${muscle.label} on ${panelSurface} model`}
      onMouseEnter={() => onHover(muscle)}
      onFocus={() => onHover(muscle)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(muscle)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(muscle)
        }
      }}
    >
      <g className="muscle-node-glow">{renderShape(shape, muscle.side)}</g>
      <g className="muscle-node-core">{renderShape(shape, muscle.side)}</g>
      <g className="muscle-node-lines">{renderShape(shape, muscle.side)}</g>
    </g>
  )
}

function MuscleFigure({
  surface,
  muscles,
  activeMuscleIds,
  selectedMuscleId,
  hoveredMuscle,
  zoomLevel,
  onHoverMuscle,
  onSelectMuscle,
}) {
  return (
    <article className="muscle-figure-panel">
      <header className="muscle-figure-panel__header">
        <div>
          <span className="eyebrow">Surface</span>
          <strong>{SURFACE_META[surface].label}</strong>
        </div>
        <span className="muscle-figure-panel__chip">
          {hoveredMuscle && getMuscleSurface(hoveredMuscle) !== 'both' && getMuscleSurface(hoveredMuscle) !== surface
            ? 'Cross-view muscle'
            : `${muscles.length} mapped regions`}
        </span>
      </header>

      <div className="muscle-figure-stage" style={{ '--muscle-viewer-zoom': zoomLevel }}>
        <FigureBlueprint surface={surface} />
        <svg className="muscle-figure-muscles" viewBox="0 0 320 840" aria-hidden="true">
          {muscles.map((muscle) => {
            const isActive = activeMuscleIds.has(muscle.baseId)
            const isSelected = selectedMuscleId === muscle.baseId
            const isMuted = activeMuscleIds.size > 0 && !isActive

            return (
              <MuscleNode
                key={muscle.id}
                muscle={muscle}
                panelSurface={surface}
                active={isActive}
                selected={isSelected}
                muted={isMuted}
                onHover={onHoverMuscle}
                onSelect={(nextMuscle) => onSelectMuscle(nextMuscle?.baseId === selectedMuscleId ? '' : nextMuscle?.baseId || '')}
              />
            )
          })}
        </svg>
      </div>
    </article>
  )
}

function MuscleExplorer3D({
  theme = 'light',
  activeExerciseId = '',
  selectedExerciseId = '',
  selectedMuscleId = '',
  onSelectMuscle,
  onPreviewExercise,
  onSelectExercise,
}) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [viewMode, setViewMode] = useState('split')

  const activeExercise = useMemo(
    () => EXERCISE_LIBRARY.find((entry) => entry.id === activeExerciseId) || null,
    [activeExerciseId]
  )

  const selectedExercise = useMemo(
    () => EXERCISE_LIBRARY.find((entry) => entry.id === selectedExerciseId) || null,
    [selectedExerciseId]
  )

  const activeMuscleIds = useMemo(() => {
    if (activeExerciseId) {
      const exercise = EXERCISE_LIBRARY.find((entry) => entry.id === activeExerciseId)
      return new Set(exercise?.muscles || [])
    }
    if (selectedMuscleId) {
      return new Set([selectedMuscleId])
    }
    return new Set()
  }, [activeExerciseId, selectedMuscleId])

  const selectedExercises = useMemo(
    () => (selectedMuscleId ? getExercisesByMuscle(selectedMuscleId) : []),
    [selectedMuscleId]
  )

  const visiblePanels = viewMode === 'split' ? ['front', 'back'] : [viewMode]

  const musclesBySurface = useMemo(() => ({
    front: MUSCLE_LOOKUP.filter((muscle) => {
      const surface = getMuscleSurface(muscle)
      return surface === 'front' || surface === 'both'
    }),
    back: MUSCLE_LOOKUP.filter((muscle) => {
      const surface = getMuscleSurface(muscle)
      return surface === 'back' || surface === 'both'
    }),
  }), [])

  const focusedMuscle = hoveredMuscle || MUSCLE_LOOKUP.find((muscle) => muscle.baseId === selectedMuscleId) || null

  useEffect(() => {
    if (!selectedMuscleId && !activeExerciseId) {
      setZoomLevel(1)
    }
  }, [activeExerciseId, selectedMuscleId])

  const changeZoom = (nextZoom) => {
    setZoomLevel(clamp(nextZoom, 0.82, 1.55))
  }

  const handleViewerWheel = (event) => {
    event.preventDefault()
    const nextZoom = zoomLevel - (event.deltaY * 0.001)
    changeZoom(nextZoom)
  }

  const activationSummary = focusedMuscle?.label
    || activeExercise?.name
    || 'Hover an exercise or click a muscle region to inspect the anatomy mapping.'

  const surfaceSummary = activeExercise
    ? `${activeExercise.muscles.length} mapped muscles for ${activeExercise.name}`
    : selectedMuscleId
      ? `${selectedExercises.length} linked exercises for the selected region`
      : 'Transparent body map with visible muscle lines'

  return (
    <div className={`muscle-explorer muscle-explorer--${theme}`}>
      <div className="muscle-explorer-stage" onWheel={handleViewerWheel}>
        <div className="muscle-explorer-stage-chrome" aria-hidden="true">
          <span className="muscle-stage-dot" />
          <span className="muscle-stage-dot" />
          <span className="muscle-stage-dot" />
        </div>

        <div className="muscle-explorer-stage-hud">
          <div className="muscle-stage-badge">
            <span className="eyebrow">Lucifer anatomy lab</span>
            <strong>Transparent muscle explorer</strong>
          </div>
          <div className="muscle-stage-badge muscle-stage-badge--ghost">
            <span>{surfaceSummary}</span>
            <strong>Front, back, and dual body views</strong>
          </div>
        </div>

        <div className="muscle-explorer-canvas">
          <div className="muscle-explorer-viewer-shell">
            <div className="muscle-explorer-controls" aria-label="Anatomy view controls">
              <div className="muscle-explorer-control-group muscle-explorer-control-group--views">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={`muscle-explorer-control muscle-explorer-control--view ${viewMode === mode.id ? 'is-active' : ''}`}
                    onClick={() => setViewMode(mode.id)}
                    title={mode.hint}
                  >
                    <strong>{mode.label}</strong>
                    <span>{mode.hint}</span>
                  </button>
                ))}
              </div>

              <div className="muscle-explorer-control-group muscle-explorer-control-group--zoom">
                <button type="button" className="muscle-explorer-icon-button" onClick={() => changeZoom(zoomLevel - 0.08)} aria-label="Zoom out">
                  -
                </button>
                <label className="muscle-explorer-zoom-slider">
                  <span>Zoom</span>
                  <input
                    type="range"
                    min="0.82"
                    max="1.55"
                    step="0.01"
                    value={zoomLevel}
                    onChange={(event) => changeZoom(Number(event.target.value))}
                  />
                </label>
                <span className="muscle-explorer-zoom-readout">{Math.round(zoomLevel * 100)}%</span>
                <button type="button" className="muscle-explorer-icon-button" onClick={() => changeZoom(zoomLevel + 0.08)} aria-label="Zoom in">
                  +
                </button>
                <button type="button" className="muscle-explorer-reset" onClick={() => { setViewMode('split'); setZoomLevel(1) }}>
                  Reset view
                </button>
              </div>
            </div>

            <div className={`muscle-explorer-viewer muscle-explorer-viewer--${viewMode}`}>
              {visiblePanels.map((surface) => (
                <MuscleFigure
                  key={surface}
                  surface={surface}
                  muscles={musclesBySurface[surface]}
                  activeMuscleIds={activeMuscleIds}
                  selectedMuscleId={selectedMuscleId}
                  hoveredMuscle={hoveredMuscle}
                  zoomLevel={zoomLevel}
                  onHoverMuscle={setHoveredMuscle}
                  onSelectMuscle={onSelectMuscle}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="muscle-explorer-stage-overlay">
          <span className="eyebrow">Anatomy focus</span>
          <strong>{activationSummary}</strong>
          <div className="muscle-explorer-stage-overlay__legend">
            <span><i className="legend-dot legend-dot--passive" /> mapped region</span>
            <span><i className="legend-dot legend-dot--active" /> active from exercise</span>
            <span><i className="legend-dot legend-dot--selected" /> selected muscle</span>
          </div>
        </div>
      </div>

      <div className="muscle-explorer-sidebar">
        <section className="private-card lucifer-section-panel">
          <span className="eyebrow">Exercise groups</span>
          <div className="exercise-library-groups">
            {EXERCISE_GROUPS.map((group) => (
              <div key={group.id} className="exercise-group-card">
                <div className="exercise-group-header">
                  <strong>{group.label}</strong>
                  <span>{group.muscles.length} muscles</span>
                </div>
                <div className="exercise-tag-row">
                  {group.exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      className={`exercise-tag ${(activeExerciseId || selectedExerciseId) === exercise.id ? 'is-active' : ''}`}
                      onMouseEnter={() => onPreviewExercise(exercise.id)}
                      onFocus={() => onPreviewExercise(exercise.id)}
                      onMouseLeave={() => onPreviewExercise('')}
                      onBlur={() => onPreviewExercise('')}
                      onClick={() => onSelectExercise(exercise.id)}
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="private-card lucifer-section-panel">
          <span className="eyebrow">Linked exercises</span>
          <h3>{selectedMuscleId ? MUSCLE_LOOKUP.find((muscle) => muscle.baseId === selectedMuscleId)?.label || 'Selected muscle' : 'Select a muscle'}</h3>
          <div className="detail-list">
            {selectedExercises.length ? selectedExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                className={`exercise-link-card ${selectedExerciseId === exercise.id ? 'is-active' : ''}`}
                onMouseEnter={() => onPreviewExercise(exercise.id)}
                onMouseLeave={() => onPreviewExercise('')}
                onFocus={() => onPreviewExercise(exercise.id)}
                onBlur={() => onPreviewExercise('')}
                onClick={() => onSelectExercise(exercise.id)}
              >
                <strong>{exercise.name}</strong>
                <span>{exercise.type} | PR focus: {exercise.prFocus}</span>
              </button>
            )) : <p>Click a visible muscle region to see the exercises connected to it.</p>}
          </div>
        </section>

        <section className="private-card lucifer-section-panel muscle-explorer-insight-panel">
          <span className="eyebrow">Explorer status</span>
          <div className="muscle-explorer-insight-grid">
            <div className="muscle-explorer-insight-card">
              <strong>{focusedMuscle?.groupLabel || 'Whole body'}</strong>
              <span>{focusedMuscle ? focusedMuscle.label : 'All major mapped muscle groups are visible by default.'}</span>
            </div>
            <div className="muscle-explorer-insight-card">
              <strong>{activeExercise?.name || selectedExercise?.name || 'No movement pinned'}</strong>
              <span>{activeExercise ? `${activeExercise.muscles.length} muscles reacting to the current movement.` : 'Preview an exercise tag to see the mapped activation chain.'}</span>
            </div>
            <div className="muscle-explorer-insight-card">
              <strong>{visiblePanels.length === 2 ? 'Dual surface view' : SURFACE_META[visiblePanels[0]].shortLabel}</strong>
              <span>{viewMode === 'split' ? 'Use this when you want front/back coverage at the same time.' : 'Switch surfaces anytime from the roomy control bar above.'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MuscleExplorer3D
