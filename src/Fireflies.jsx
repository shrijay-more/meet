// Small glowing dots that drift slowly upward across the whole screen,
// like fireflies or floating pollen. This is what makes the app feel
// "alive" rather than static.
import { useMemo } from 'react'
import './Fireflies.css'

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 3 + 2,
    duration: Math.random() * 10 + 10, // 10–20s per drift cycle
    delay: Math.random() * 15,
    color: Math.random() > 0.5 ? '#f3c6d6' : '#fdfbf7',
  }))
}

function Fireflies() {
  const particles = useMemo(() => generateParticles(24), [])

  return (
    <div className="fireflies">
      {particles.map((p) => (
        <span
          key={p.id}
          className="firefly"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 8px 2px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default Fireflies