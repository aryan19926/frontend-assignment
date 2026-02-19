import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import './NewAnimation.css'

gsap.registerPlugin(ScrollTrigger)

const NewAnimation = ({ onBack }) => {
  const canvasRef = useRef(null)
  const lenisRef = useRef(null)

  useEffect(() => {
    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // ── Three.js setup ──
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.035)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0a1a)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    // ── Lights ──
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xf76cfe, 2, 50)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x4fc3f7, 2, 50)
    pointLight2.position.set(-5, -3, 3)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0xc1ff12, 0, 50)
    pointLight3.position.set(0, 0, 0)
    scene.add(pointLight3)

    // ── Central sphere (morphing nucleus) ──
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 5)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
      emissive: 0xf76cfe,
      emissiveIntensity: 0.05,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // Store original positions for morphing
    const originalPositions = sphereGeo.attributes.position.array.slice()

    // ── Wireframe overlay ──
    const wireGeo = new THREE.IcosahedronGeometry(1.25, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf76cfe,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wireframe = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireframe)

    // ── Orbit ring ──
    const ringGeo = new THREE.TorusGeometry(2.5, 0.01, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf76cfe,
      transparent: true,
      opacity: 0.4,
    })
    const ring1 = new THREE.Mesh(ringGeo, ringMat)
    ring1.rotation.x = Math.PI / 3
    scene.add(ring1)

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone())
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 6
    scene.add(ring2)

    // ── Particles (cosmic dust) ──
    const particleCount = 4000
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particleColors = new Float32Array(particleCount * 3)

    const colorPink = new THREE.Color(0xf76cfe)
    const colorBlue = new THREE.Color(0x4fc3f7)
    const colorGreen = new THREE.Color(0xc1ff12)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 3 + Math.random() * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i3 + 2] = radius * Math.cos(phi)

      particleSizes[i] = Math.random() * 3 + 0.5

      const mixColor = Math.random()
      const color = mixColor < 0.4 ? colorPink : mixColor < 0.7 ? colorBlue : colorGreen
      particleColors[i3] = color.r
      particleColors[i3 + 1] = color.g
      particleColors[i3 + 2] = color.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Connection lines (neural network) ──
    const lineCount = 60
    const lineMeshes = []
    for (let i = 0; i < lineCount; i++) {
      const points = []
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      )
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      )
      points.push(start, end)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xf76cfe,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      scene.add(line)
      lineMeshes.push(line)
    }

    // ── Floating orbit nodes ──
    const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16)
    const nodes = []
    for (let i = 0; i < 20; i++) {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xf76cfe : 0xc1ff12,
        transparent: true,
        opacity: 0.8,
      })
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.userData = {
        angle: Math.random() * Math.PI * 2,
        radius: 2 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.5,
        yOffset: (Math.random() - 0.5) * 3,
        axis: Math.random() > 0.5 ? 'xz' : 'yz',
      }
      scene.add(node)
      nodes.push(node)
    }

    // ── State for scroll-driven changes ──
    const state = {
      phase: 0,
      morphStrength: 0,
      explode: 0,
      cameraZ: 5,
      cameraY: 0,
      cameraRotZ: 0,
      sphereScale: 1,
      ringOpacity: 0.4,
      linesOpacity: 0,
      bloomIntensity: 0,
      bgR: 10 / 255,
      bgG: 10 / 255,
      bgB: 26 / 255,
    }

    // ── GSAP scroll-driven animations ──
    const scrollContainer = document.querySelector('.na-scroll-container')

    // Phase 1: Approach (0-20%) — camera zooms in, rings spin up
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: '20% top',
      scrub: 1,
      onUpdate: (self) => {
        state.cameraZ = gsap.utils.interpolate(5, 3, self.progress)
        state.sphereScale = gsap.utils.interpolate(1, 1.1, self.progress)
      },
    })

    // Phase 2: Awakening (20-40%) — sphere morphs, lines appear, colors shift
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: '20% top',
      end: '40% top',
      scrub: 1,
      onUpdate: (self) => {
        state.morphStrength = self.progress * 0.3
        state.linesOpacity = self.progress * 0.15
        state.cameraZ = gsap.utils.interpolate(3, 2.5, self.progress)
        pointLight3.intensity = self.progress * 3
      },
    })

    // Phase 3: Expansion (40-60%) — explosion, particles pull in, camera orbits
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: '40% top',
      end: '60% top',
      scrub: 1,
      onUpdate: (self) => {
        state.explode = self.progress
        state.cameraY = gsap.utils.interpolate(0, 2, self.progress)
        state.cameraRotZ = gsap.utils.interpolate(0, 0.3, self.progress)
        state.sphereScale = gsap.utils.interpolate(1.1, 1.5, self.progress)
        sphereMat.emissiveIntensity = gsap.utils.interpolate(0.05, 0.4, self.progress)
      },
    })

    // Phase 4: Convergence (60-80%) — everything contracts, colors invert
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: '60% top',
      end: '80% top',
      scrub: 1,
      onUpdate: (self) => {
        state.explode = gsap.utils.interpolate(1, 0, self.progress)
        state.cameraZ = gsap.utils.interpolate(2.5, 4, self.progress)
        state.cameraY = gsap.utils.interpolate(2, 0, self.progress)
        state.morphStrength = gsap.utils.interpolate(0.3, 0.6, self.progress)
        state.bgR = gsap.utils.interpolate(10 / 255, 5 / 255, self.progress)
        state.bgG = gsap.utils.interpolate(10 / 255, 2 / 255, self.progress)
        state.bgB = gsap.utils.interpolate(26 / 255, 15 / 255, self.progress)
        pointLight1.color.setHSL(gsap.utils.interpolate(0.83, 0.45, self.progress), 1, 0.6)
      },
    })

    // Phase 5: Transcendence (80-100%) — final bloom, everything lifts, fade to light
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: '80% top',
      end: '100% top',
      scrub: 1,
      onUpdate: (self) => {
        state.cameraZ = gsap.utils.interpolate(4, 7, self.progress)
        state.sphereScale = gsap.utils.interpolate(1.5, 0.5, self.progress)
        state.morphStrength = gsap.utils.interpolate(0.6, 0, self.progress)
        sphereMat.emissiveIntensity = gsap.utils.interpolate(0.4, 1.5, self.progress)
        wireMat.opacity = gsap.utils.interpolate(0.15, 0.6, self.progress)
        renderer.toneMappingExposure = gsap.utils.interpolate(1, 2.5, self.progress)
      },
    })

    // ── DOM text animations ──
    const phases = document.querySelectorAll('.na-phase')
    phases.forEach((phase, i) => {
      const startPct = i * 20
      const fadeInEnd = startPct + 8
      const fadeOutStart = startPct + 14
      const fadeOutEnd = startPct + 20

      gsap.fromTo(phase, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0,
        scrollTrigger: {
          trigger: scrollContainer,
          start: `${startPct}% top`,
          end: `${fadeInEnd}% top`,
          scrub: 1,
        },
      })

      if (i < 4) {
        gsap.fromTo(phase, { opacity: 1 }, {
          opacity: 0, y: -30,
          immediateRender: false,
          scrollTrigger: {
            trigger: scrollContainer,
            start: `${fadeOutStart}% top`,
            end: `${fadeOutEnd}% top`,
            scrub: 1,
          },
        })
      }
    })

    // ── Mouse tracking ──
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // ── Render loop ──
    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Camera
      camera.position.z = state.cameraZ + mouse.y * 0.3
      camera.position.y = state.cameraY + mouse.y * 0.5
      camera.position.x = mouse.x * 0.8
      camera.rotation.z = state.cameraRotZ
      camera.lookAt(0, 0, 0)

      // Sphere morph
      const positions = sphereGeo.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i]
        const oy = originalPositions[i + 1]
        const oz = originalPositions[i + 2]
        const noise = Math.sin(ox * 3 + elapsed * 1.5) *
                      Math.cos(oy * 3 + elapsed * 1.2) *
                      Math.sin(oz * 3 + elapsed * 0.8)
        const morph = 1 + noise * state.morphStrength
        positions[i] = ox * morph
        positions[i + 1] = oy * morph
        positions[i + 2] = oz * morph
      }
      sphereGeo.attributes.position.needsUpdate = true

      // Sphere scale and rotation
      sphere.scale.setScalar(state.sphereScale)
      sphere.rotation.y = elapsed * 0.15
      sphere.rotation.x = elapsed * 0.08

      // Wireframe
      wireframe.rotation.y = -elapsed * 0.1
      wireframe.rotation.x = elapsed * 0.05
      wireframe.scale.setScalar(state.sphereScale * 1.04)

      // Rings
      ring1.rotation.z = elapsed * 0.3
      ring1.scale.setScalar(state.sphereScale * (1 + state.explode * 0.5))
      ring2.rotation.z = -elapsed * 0.2
      ring2.scale.setScalar(state.sphereScale * (1 + state.explode * 0.3))

      // Particles rotation
      particles.rotation.y = elapsed * 0.02
      particles.rotation.x = elapsed * 0.01

      // Connection lines
      lineMeshes.forEach((line) => {
        line.material.opacity = state.linesOpacity
      })

      // Orbit nodes
      nodes.forEach((node) => {
        const d = node.userData
        d.angle += d.speed * 0.01
        const r = d.radius * (1 + state.explode * 0.8)
        if (d.axis === 'xz') {
          node.position.x = Math.cos(d.angle) * r
          node.position.z = Math.sin(d.angle) * r
          node.position.y = d.yOffset + Math.sin(elapsed + d.angle) * 0.3
        } else {
          node.position.y = Math.cos(d.angle) * r
          node.position.z = Math.sin(d.angle) * r
          node.position.x = d.yOffset + Math.sin(elapsed + d.angle) * 0.3
        }
      })

      // Background color
      renderer.setClearColor(new THREE.Color(state.bgR, state.bgG, state.bgB))

      // Lights pulse
      pointLight1.intensity = 2 + Math.sin(elapsed * 2) * 0.5
      pointLight2.intensity = 2 + Math.cos(elapsed * 1.5) * 0.5

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ──
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div className="na-root">
      <canvas ref={canvasRef} className="na-canvas" />

      <div className="na-scroll-container">
        <div className="na-spacer" />
      </div>

      <div className="na-ui-overlay">
        <div className="na-phase na-phase-1">
          <span className="na-phase-tag">01</span>
          <h2>Aryan</h2>
          <p>Full Stack Dev</p>
        </div>

        <div className="na-phase na-phase-2">
          <span className="na-phase-tag">02</span>
          <h2>Aryan</h2>
          <p>Full Stack Dev</p>
        </div>

        <div className="na-phase na-phase-3">
          <span className="na-phase-tag">03</span>
          <h2>Aryan</h2>
          <p>Full Stack Dev</p>
        </div>

        <div className="na-phase na-phase-4">
          <span className="na-phase-tag">04</span>
          <h2>Aryan</h2>
          <p>Full Stack Dev</p>
        </div>

        <div className="na-phase na-phase-5">
          <span className="na-phase-tag">05</span>
          <h2>Aryan</h2>
          <p>Full Stack Dev</p>
        </div>
      </div>

      <nav className="na-nav">
        <button className="na-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <span className="na-scroll-hint">Scroll to explore</span>
      </nav>
    </div>
  )
}

export default NewAnimation
