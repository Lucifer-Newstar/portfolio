import { useEffect, useRef } from 'react'
import { useTheme } from '../context/useTheme'

function ParticleBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = window.innerWidth
    let height = window.innerHeight
    let animationFrame
    let pointerX = width * 0.5
    let pointerY = height * 0.35

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    const handlePointerMove = (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
    }

    const createDarkNodes = () => Array.from({ length: 132 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.4 + 0.8,
      glow: Math.random() * 0.6 + 0.4
    }))

    const createLightShapes = () => Array.from({ length: 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 120 + 50,
      alpha: Math.random() * 0.12 + 0.05,
      hue: [18, 42, 188, 320][Math.floor(Math.random() * 4)]
    }))

    const createSparkles = () => Array.from({ length: 72 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.2
    }))

    const createBands = () => Array.from({ length: 5 }, (_, index) => ({
      offset: index * 0.17 + Math.random() * 0.08,
      amplitude: 24 + index * 16,
      speed: 0.35 + index * 0.08
    }))

    const createDust = () => Array.from({ length: 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 24 + 10,
      driftX: (Math.random() - 0.5) * 0.18,
      driftY: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.08 + 0.02
    }))

    const createParallaxBlobs = () => Array.from({ length: 5 }, (_, index) => ({
      x: width * (0.14 + index * 0.18),
      y: height * (0.16 + (index % 3) * 0.22),
      radius: 120 + index * 32,
      drift: 0.18 + index * 0.05,
      hue: [28, 210, 330, 190, 46][index % 5]
    }))

    const darkNodes = createDarkNodes()
    const lightShapes = createLightShapes()
    const sparkles = createSparkles()
    const bands = createBands()
    const dust = createDust()
    const blobs = createParallaxBlobs()
    let tick = 0

    resize()

    const drawDarkScene = () => {
      context.clearRect(0, 0, width, height)

      const radial = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, width * 0.55)
      radial.addColorStop(0, 'rgba(20, 196, 255, 0.18)')
      radial.addColorStop(0.3, 'rgba(168, 85, 247, 0.12)')
      radial.addColorStop(1, 'rgba(5, 8, 20, 0)')
      context.fillStyle = radial
      context.fillRect(0, 0, width, height)

      context.save()
      blobs.forEach((blob, index) => {
        const driftX = (pointerX - width * 0.5) * (0.012 + index * 0.002)
        const driftY = (pointerY - height * 0.5) * (0.012 + index * 0.002)
        const x = blob.x + Math.sin(tick * (blob.drift + 0.18) + index) * 36 + driftX
        const y = blob.y + Math.cos(tick * (blob.drift + 0.12) + index) * 28 + driftY
        const haze = context.createRadialGradient(x, y, 0, x, y, blob.radius)
        haze.addColorStop(0, `hsla(${blob.hue} 90% 62% / 0.08)`)
        haze.addColorStop(0.58, `hsla(${blob.hue} 88% 58% / 0.03)`)
        haze.addColorStop(1, 'rgba(5, 8, 20, 0)')
        context.fillStyle = haze
        context.beginPath()
        context.arc(x, y, blob.radius, 0, Math.PI * 2)
        context.fill()
      })
      context.strokeStyle = 'rgba(98, 163, 255, 0.08)'
      context.lineWidth = 1
      for (let index = 0; index < 10; index++) {
        const y = ((height / 9) * index + tick * 6) % (height + 140) - 70
        context.beginPath()
        context.moveTo(-40, y)
        context.bezierCurveTo(width * 0.25, y + 35, width * 0.6, y - 45, width + 40, y + 10)
        context.stroke()
      }
      context.restore()

      context.save()
      bands.forEach((band, index) => {
        context.strokeStyle = `rgba(105, 226, 255, ${0.055 - index * 0.008})`
        context.lineWidth = 1
        context.beginPath()
        for (let x = -40; x <= width + 40; x += 12) {
          const y = height * band.offset + Math.sin(tick * 5 * band.speed + x * 0.01) * band.amplitude + Math.cos(x * 0.008 + tick * 4) * 6
          if (x === -40) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.stroke()
      })
      context.restore()

      dust.forEach((cloud, index) => {
        cloud.x += cloud.driftX + Math.sin(tick * 2 + index) * 0.04
        cloud.y += cloud.driftY + Math.cos(tick * 2 + index) * 0.04
        if (cloud.x < -80) cloud.x = width + 80
        if (cloud.x > width + 80) cloud.x = -80
        if (cloud.y < -80) cloud.y = height + 80
        if (cloud.y > height + 80) cloud.y = -80

        const haze = context.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius * 3)
        haze.addColorStop(0, `rgba(93, 176, 255, ${cloud.alpha})`)
        haze.addColorStop(1, 'rgba(93, 176, 255, 0)')
        context.fillStyle = haze
        context.beginPath()
        context.arc(cloud.x, cloud.y, cloud.radius * 3, 0, Math.PI * 2)
        context.fill()
      })

      darkNodes.forEach((node, index) => {
        if (!prefersReducedMotion) {
          node.x += node.vx + Math.sin(tick + index) * 0.03
          node.y += node.vy + Math.cos(tick + index * 0.4) * 0.03
        }

        if (node.x < -40) node.x = width + 40
        if (node.x > width + 40) node.x = -40
        if (node.y < -40) node.y = height + 40
        if (node.y > height + 40) node.y = -40

        for (let peer = index + 1; peer < darkNodes.length; peer++) {
          const other = darkNodes[peer]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 160) {
            context.strokeStyle = `rgba(67, 190, 255, ${0.12 - distance / 1800})`
            context.lineWidth = 1
            context.beginPath()
            context.moveTo(node.x, node.y)
            context.lineTo(other.x, other.y)
            context.stroke()
          }
        }

        const gradient = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 10)
        gradient.addColorStop(0, `rgba(97, 224, 255, ${node.glow})`)
        gradient.addColorStop(0.45, 'rgba(168, 85, 247, 0.12)')
        gradient.addColorStop(1, 'rgba(97, 224, 255, 0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(node.x, node.y, node.radius * 10, 0, Math.PI * 2)
        context.fill()

        context.fillStyle = 'rgba(214, 248, 255, 0.95)'
        context.beginPath()
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        context.fill()
      })

      for (let ring = 0; ring < 3; ring++) {
        context.strokeStyle = `rgba(67, 190, 255, ${0.05 - ring * 0.01})`
        context.lineWidth = 1
        context.beginPath()
        context.arc(pointerX, pointerY, 120 + ring * 70 + Math.sin(tick * 2 + ring) * 8, 0, Math.PI * 2)
        context.stroke()
      }

      sparkles.forEach((sparkle, index) => {
        sparkle.y += sparkle.drift
        if (sparkle.y > height + 10) sparkle.y = -10
        if (sparkle.y < -10) sparkle.y = height + 10
        context.fillStyle = `rgba(132, 226, 255, ${sparkle.alpha * (0.7 + Math.sin(tick * 4 + index) * 0.2)})`
        context.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size)
      })
    }

    const drawLightScene = () => {
      context.clearRect(0, 0, width, height)

      const ambient = context.createLinearGradient(0, 0, width, height)
      ambient.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
      ambient.addColorStop(0.35, 'rgba(255, 214, 171, 0.08)')
      ambient.addColorStop(0.7, 'rgba(171, 218, 255, 0.08)')
      ambient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      context.fillStyle = ambient
      context.fillRect(0, 0, width, height)

      lightShapes.forEach((shape, index) => {
        if (!prefersReducedMotion) {
          shape.x += shape.vx + Math.sin(tick * 0.8 + index) * 0.08
          shape.y += shape.vy + Math.cos(tick * 0.8 + index) * 0.08
        }

        if (shape.x < -160) shape.x = width + 160
        if (shape.x > width + 160) shape.x = -160
        if (shape.y < -160) shape.y = height + 160
        if (shape.y > height + 160) shape.y = -160

        const gradient = context.createRadialGradient(shape.x, shape.y, 0, shape.x, shape.y, shape.radius)
        gradient.addColorStop(0, `hsla(${shape.hue} 88% 70% / ${shape.alpha})`)
        gradient.addColorStop(0.45, `hsla(${shape.hue} 82% 78% / ${shape.alpha * 0.55})`)
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
        context.fill()
      })

      context.save()
      blobs.forEach((blob, index) => {
        const driftX = (pointerX - width * 0.5) * (0.014 + index * 0.002)
        const driftY = (pointerY - height * 0.5) * (0.008 + index * 0.0015)
        const x = blob.x + Math.sin(tick * (blob.drift + 0.1) + index) * 40 + driftX
        const y = blob.y + Math.cos(tick * (blob.drift + 0.06) + index) * 26 + driftY
        const glow = context.createRadialGradient(x, y, 0, x, y, blob.radius)
        glow.addColorStop(0, index % 2 === 0 ? 'rgba(255, 148, 107, 0.12)' : 'rgba(78, 124, 255, 0.1)')
        glow.addColorStop(0.52, index % 2 === 0 ? 'rgba(255, 219, 192, 0.05)' : 'rgba(160, 202, 255, 0.04)')
        glow.addColorStop(1, 'rgba(255,255,255,0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(x, y, blob.radius, 0, Math.PI * 2)
        context.fill()
      })
      context.strokeStyle = 'rgba(184, 127, 67, 0.12)'
      context.lineWidth = 1
      for (let index = 0; index < 6; index++) {
        context.beginPath()
        context.ellipse(
          width * 0.5,
          height * 0.5,
          width * (0.16 + index * 0.09),
          height * (0.1 + index * 0.05),
          Math.sin(tick * 0.5) * 0.2,
          0,
          Math.PI * 2
        )
        context.stroke()
      }
      context.restore()

      context.save()
      bands.forEach((band, index) => {
        context.strokeStyle = index % 2 === 0
          ? `rgba(189, 107, 54, ${0.07 - index * 0.008})`
          : `rgba(52, 86, 209, ${0.05 - index * 0.006})`
        context.lineWidth = 1.1
        context.beginPath()
        for (let x = -20; x <= width + 20; x += 14) {
          const y = height * (0.18 + index * 0.12) + Math.sin(tick * 4 * band.speed + x * 0.012) * (band.amplitude * 0.55)
          if (x === -20) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.stroke()
      })
      context.restore()

      dust.forEach((cloud, index) => {
        cloud.x += cloud.driftX * 0.7 + Math.sin(tick * 1.4 + index) * 0.05
        cloud.y += cloud.driftY * 0.7 + Math.cos(tick * 1.4 + index) * 0.05
        if (cloud.x < -80) cloud.x = width + 80
        if (cloud.x > width + 80) cloud.x = -80
        if (cloud.y < -80) cloud.y = height + 80
        if (cloud.y > height + 80) cloud.y = -80

        const haze = context.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius * 3)
        haze.addColorStop(0, index % 2 === 0 ? `rgba(255, 148, 107, ${cloud.alpha})` : `rgba(78, 124, 255, ${cloud.alpha})`)
        haze.addColorStop(1, 'rgba(255,255,255,0)')
        context.fillStyle = haze
        context.beginPath()
        context.arc(cloud.x, cloud.y, cloud.radius * 3, 0, Math.PI * 2)
        context.fill()
      })

      for (let index = 0; index < 14; index++) {
        const x = (index / 13) * width
        const y = height * 0.15 + Math.sin(tick + index * 0.7) * 16
        context.fillStyle = index % 2 === 0 ? 'rgba(255, 138, 91, 0.12)' : 'rgba(71, 145, 255, 0.12)'
        context.fillRect(x, y, 2, height * 0.12)
      }

      const pointerGradient = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, width * 0.25)
      pointerGradient.addColorStop(0, 'rgba(255, 180, 120, 0.1)')
      pointerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      context.fillStyle = pointerGradient
      context.fillRect(0, 0, width, height)

      sparkles.forEach((sparkle, index) => {
        sparkle.y += sparkle.drift * 0.6
        if (sparkle.y > height + 8) sparkle.y = -8
        if (sparkle.y < -8) sparkle.y = height + 8
        context.beginPath()
        context.fillStyle = index % 2 === 0
          ? `rgba(189, 107, 54, ${sparkle.alpha * 0.45})`
          : `rgba(52, 86, 209, ${sparkle.alpha * 0.3})`
        context.arc(sparkle.x, sparkle.y, sparkle.size * 0.7, 0, Math.PI * 2)
        context.fill()
      })
    }

    const render = () => {
      tick += prefersReducedMotion ? 0.002 : 0.006
      if (isDark) {
        drawDarkScene()
      } else {
        drawLightScene()
      }
      animationFrame = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />
}

export default ParticleBackground
