import React, {useMemo} from 'react'

interface Leaf {
  id: number
  size: number
  left: number
  top: number
  color: string
  delay: number
  duration: number
}

interface SunRay {
  id: number
  left: number
  top: number
  size: number
  delay: number
}

const LEAF_COLORS = ['#81C784', '#A5D6A7', '#C8E6C9', '#F9A825', '#FFCC80']

const StarBackground: React.FC = () => {
  const leaves = useMemo<Leaf[]>(() => {
    const result: Leaf[] = []
    for (let i = 0; i < 20; i++) {
      result.push({
        id: i,
        size: Math.random() * 12 + 6,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 4
      })
    }
    return result
  }, [])

  const sunRays = useMemo<SunRay[]>(() => {
    const result: SunRay[] = []
    for (let i = 0; i < 8; i++) {
      result.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 40,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 3
      })
    }
    return result
  }, [])

  return (
    <div className="fixed inset-0" style={{zIndex: 0}}>
      {/* 田园自然渐变背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 35%, #FFFDE7 70%, #FFF8E1 100%)'
        }}
      />

      {/* 底部田野装饰线 */}
      <div
        className="absolute w-full"
        style={{
          bottom: 0,
          height: '120px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(129, 199, 132, 0.15) 100%)'
        }}
      />

      {/* 漂浮叶子 */}
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute"
          style={{
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            backgroundColor: leaf.color,
            borderRadius: '50% 0 50% 0',
            opacity: 0.35,
            animation: `float-leaf ${leaf.duration}s ease-in-out infinite`,
            animationDelay: `${leaf.delay}s`,
            transformOrigin: 'center center'
          }}
        />
      ))}

      {/* 阳光光点 */}
      {sunRays.map(ray => (
        <div
          key={`ray-${ray.id}`}
          className="absolute rounded-full"
          style={{
            width: `${ray.size}px`,
            height: `${ray.size}px`,
            left: `${ray.left}%`,
            top: `${ray.top}%`,
            backgroundColor: '#FFF176',
            opacity: 0.4,
            animation: `sway 3s ease-in-out infinite`,
            animationDelay: `${ray.delay}s`,
            boxShadow: '0 0 6px rgba(255, 241, 118, 0.5)'
          }}
        />
      ))}
    </div>
  )
}

export default StarBackground
