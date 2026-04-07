import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

function ScrollAnimations() {
  useEffect(() => {
    const pageNodes = gsap.utils.toArray('.page-shell')
    pageNodes.forEach((node) => {
      gsap.fromTo(node, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    })

    const revealNodes = gsap.utils.toArray('[data-reveal]')
    revealNodes.forEach((node) => {
      const variant = node.dataset.reveal || 'up'
      const fromVars = {
        opacity: 0,
        y: variant === 'up' ? 40 : 0,
        x: variant === 'left' ? -40 : variant === 'right' ? 40 : 0,
        scale: variant === 'scale' ? 0.94 : 1
      }

      gsap.fromTo(node, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: node,
          start: 'top 86%'
        }
      })
    })

    const parallaxNodes = gsap.utils.toArray('[data-parallax]')
    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.parallax || 80)
      gsap.to(node, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          scrub: true
        }
      })
    })

    const atmosphereShapes = gsap.utils.toArray('.atmo-shape')
    atmosphereShapes.forEach((shape, index) => {
      const direction = index % 2 === 0 ? 1 : -1
      gsap.to(shape, {
        y: 70 * direction,
        x: 20 * -direction,
        rotation: direction * 8,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      })
    })

    const projectTiles = gsap.utils.toArray('[data-project-tile]')
    projectTiles.forEach((tile, index) => {
      gsap.fromTo(tile, {
        opacity: 0,
        y: 60,
        rotateZ: index % 2 === 0 ? -2 : 2
      }, {
        opacity: 1,
        y: 0,
        rotateZ: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tile,
          start: 'top 85%'
        }
      })

      gsap.to(tile, {
        yPercent: index % 2 === 0 ? -6 : 6,
        scrollTrigger: {
          trigger: tile,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })

    const marqueeTracks = gsap.utils.toArray('.kinetic-marquee-track')
    marqueeTracks.forEach((track) => {
      gsap.to(track, {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })

    const storyStages = gsap.utils.toArray('.story-stage')
    storyStages.forEach((stage) => {
      gsap.fromTo(stage, {
        scale: 0.96,
        opacity: 0.5
      }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top 82%',
          end: 'bottom 45%',
          scrub: true
        }
      })
    })

    const stickyStories = gsap.utils.toArray('.sticky-story-stage')
    stickyStories.forEach((stage) => {
      const cards = stage.querySelectorAll('.sticky-story-card')
      cards.forEach((card, index) => {
        gsap.fromTo(card, {
          opacity: 0.35,
          y: 40 + index * 10,
          scale: 0.94,
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            end: 'bottom 48%',
            scrub: true,
          }
        })
      })
    })

    const zoomPanels = gsap.utils.toArray('.zoom-blur-panel')
    zoomPanels.forEach((panel, index) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const distance = Math.abs(self.progress - 0.5)
          const blur = `${Math.min(distance * 10, 5).toFixed(2)}px`
          const scale = (1 - distance * 0.08).toFixed(3)
          const shift = `${((0.5 - self.progress) * (index % 2 === 0 ? 26 : -26)).toFixed(2)}px`

          panel.classList.add('is-zooming')
          panel.style.setProperty('--panel-blur', blur)
          panel.style.setProperty('--panel-scale', scale)
          panel.style.setProperty('--panel-y', shift)
        }
      })
    })

    const orbitNodes = gsap.utils.toArray('.orbit-node')
    orbitNodes.forEach((node, index) => {
      gsap.to(node, {
        y: index % 2 === 0 ? -10 : 10,
        x: index === 1 ? 8 : -8,
        repeat: -1,
        yoyo: true,
        duration: 2.8 + index * 0.3,
        ease: 'sine.inOut'
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return null
}

export default ScrollAnimations
