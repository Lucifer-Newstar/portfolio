import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

function ScrollAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initSharedAnimations = ({ compactMotion = false }) => {
      const revealDistance = compactMotion ? 24 : 40
      const revealDuration = compactMotion ? 0.72 : 0.9
      const pageNodes = gsap.utils.toArray('.page-shell')
      pageNodes.forEach((node) => {
        gsap.fromTo(node, { opacity: 0, y: compactMotion ? 18 : 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      })

      const revealNodes = gsap.utils.toArray('[data-reveal]')
      revealNodes.forEach((node) => {
        const variant = node.dataset.reveal || 'up'
        const fromVars = {
          opacity: 0,
          y: variant === 'up' ? revealDistance : 0,
          x: variant === 'left' ? -revealDistance : variant === 'right' ? revealDistance : 0,
          scale: variant === 'scale' ? (compactMotion ? 0.98 : 0.94) : 1
        }

        gsap.fromTo(node, fromVars, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: revealDuration,
          ease: compactMotion ? 'power2.out' : 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: compactMotion ? 'top 90%' : 'top 86%'
          }
        })
      })

      const storySections = gsap.utils.toArray('.page-shell .page-hero, .page-shell .page-section')
      storySections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: compactMotion ? 'top 80%' : 'top 72%',
          end: compactMotion ? 'bottom 30%' : 'bottom 38%',
          toggleClass: {
            targets: section,
            className: 'is-story-active'
          }
        })
      })

      const marqueeTracks = gsap.utils.toArray('.kinetic-marquee-track')
      marqueeTracks.forEach((track) => {
        gsap.to(track, {
          xPercent: compactMotion ? -4 : -8,
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
          scale: compactMotion ? 0.985 : 0.96,
          opacity: compactMotion ? 0.82 : 0.5
        }, {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: compactMotion ? 'top 88%' : 'top 82%',
            end: compactMotion ? 'bottom 52%' : 'bottom 45%',
            scrub: true
          }
        })
      })

      const stickyStories = gsap.utils.toArray('.sticky-story-stage')
      stickyStories.forEach((stage) => {
        const cards = stage.querySelectorAll('.sticky-story-card')
        cards.forEach((card, index) => {
          gsap.fromTo(card, {
            opacity: compactMotion ? 0.7 : 0.35,
            y: (compactMotion ? 18 : 40) + index * (compactMotion ? 6 : 10),
            scale: compactMotion ? 0.985 : 0.94,
          }, {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: {
              trigger: card,
              start: compactMotion ? 'top 90%' : 'top 82%',
              end: compactMotion ? 'bottom 58%' : 'bottom 48%',
              scrub: true,
            }
          })
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
    }

    if (!reduceMotion) {
      mm.add('(min-width: 981px)', () => {
        initSharedAnimations({ compactMotion: false })

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
      })
    }

    mm.add('(max-width: 980px)', () => {
      initSharedAnimations({ compactMotion: true })

      const groupedSelectors = [
        '.hero-bento',
        '.feature-grid',
        '.homepage-graph-zone',
        '.story-stepper',
        '.text-visual-column'
      ]

      groupedSelectors.forEach((selector) => {
        gsap.utils.toArray(selector).forEach((group) => {
          const children = Array.from(group.children)
          if (!children.length) return

          gsap.fromTo(children, {
            opacity: 0,
            y: 18
          }, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 88%'
            }
          })
        })
      })
    })

    return () => {
      mm.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return null
}

export default ScrollAnimations
