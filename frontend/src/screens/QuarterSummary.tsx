import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CountUp } from '../utils/CountUp'
import {
  quarterBg,
  quarterCalender, // Used as the main board
  quarterArrowDown,
  quarterArrowUp,
  quarterTitle,
  nextBtn,
} from '../assets/QuarterPage'

// Explicit design dimensions requested
const DESIGN_WIDTH = 1182
const DESIGN_HEIGHT = 886

interface QuarterlySummaryProps {
  quarterName?: string // 例如 "Quarter 1" 或 "Orientation"
  quarterIndex?: number // 1, 2, 3, 4
  stats?: {
    label: string
    value: number
    delta: number
  }[]
  totalScore?: number
  quartersRemaining?: number
  tasksCompleted?: number
  totalTasks?: number
}

export function QuarterlySummary({ ...initialProps }: QuarterlySummaryProps) {
  const navigate = useNavigate()
  const [scale, setScale] = useState(1)

  // Handle responsive scaling for the 1182x886 design stage
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT)
      setScale(s)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [data, setData] = useState<QuarterlySummaryProps | null>(null)
  const [loading, setLoading] = useState(true)

  // mockUser
  const getUserId = () => {
    return 'guest_mock_123456'
  }

  useEffect(() => {
    fetch('/api/game/quarterly-summary', {
      headers: {
        'x-user-id': getUserId(),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => console.error('Failed to fetch summary:', err))
  }, [])

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#4b2f1e] font-serif text-[#f2dfb5]">
        Loading Summary...
      </div>
    )
  }

  const {
    quarterName = 'First Quarter',
    quarterIndex = 1,
    stats = [],
    tasksCompleted = 0,
    totalTasks = 0,
    quartersRemaining = 4 - quarterIndex,
  } = { ...initialProps, ...data }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#4b2f1e] font-serif text-[#5a3218]">
      <div
        className="relative shadow-2xl overflow-hidden"
        style={{
          width: `${DESIGN_WIDTH * scale}px`,
          height: `${DESIGN_HEIGHT * scale}px`,
        }}
      >
        <div
          className="relative origin-top-left bg-cover bg-center bg-no-repeat"
          style={{
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
            backgroundImage: `url(${quarterBg})`,
            transform: `scale(${scale})`,
          }}
        >
          {/* Title Banner */}
          <motion.div variants={itemVariants} className="pt-[86px] w-[710px] mx-auto">
            <img src={quarterTitle} alt="Summary Title" className="w-full drop-shadow-lg" />
          </motion.div>

          {/* Summary Content Board */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col w-full flex-1 items-start justify-center pl-[72px]"
          >
            <div className="flex items-center gap-4 px-10 py-2">
              {/* Left Side: Calendar Visual */}
              <div className="flex flex-col items-center">
                <div
                  style={{
                    backgroundImage: `url(${quarterCalender})`,
                    width: '318px',
                    height: '426px',
                    backgroundSize: '100% 100%',
                    marginLeft: '60px',
                  }}
                  className="relative flex items-start justify-center"
                >
                  <div className="mt-[64px] ml-[50px] text-[84px] font-black text-[#4b3116]">
                    {quarterIndex}
                  </div>
                </div>
              </div>

              {/* Right Side: Stats Display */}
              <div className="flex flex-1 flex-col justify-start pl-[54px] pr-[54px] border-l-2 border-[#d9b16f]/30 min-h-[426px] min-w-[600px]">
                <div className="w-full space-y-[12px]">
                  <motion.div
                    variants={itemVariants}
                    className="mt-[54px]"
                  >
                    <span className="text-3xl font-bold text-[#5c3318]">{quarterName}</span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                  >
                    <span className="text-3xl font-bold text-[#5c3318] leading-[54px]">
                      Graduation in <span className="font-black">{quartersRemaining}</span> Quarters
                    </span>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                  >
                    <span className="text-3xl font-bold text-[#5c3318]">
                      Tasks completed:{' '}
                      <span className="font-black text-[#5c3318]">
                        {tasksCompleted} / {totalTasks}
                      </span>{' '}
                    </span>
                  </motion.div>
                  <div style={{ marginTop: '30px' }}></div>
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-center justify-between border-b-2 border-[#d9b16f]/20 mt-[24px]"
                    >
                      <span className="text-2xl font-bold text-[#5c3318] pl-[72px]">
                        {stat.label}
                      </span>
                      <div className="flex items-center gap-6">
                        <span className="text-4xl font-black text-[#5c3318]">
                          <CountUp
                            from={stat.value - stat.delta}
                            to={stat.value}
                            delay={0.5 + index * 0.1}
                          />
                        </span>
                        <div className="flex min-w-[100px] items-center gap-1">
                          {stat.delta !== 0 && (
                            <img
                              src={stat.delta > 0 ? quarterArrowUp : quarterArrowDown}
                              alt=""
                              className="h-10 w-10 object-contain"
                            />
                          )}
                          <span
                            className={`text-2xl font-bold ${
                              stat.delta >= 0 ? 'text-[#4a7228]' : 'text-[#a23b3b]'
                            }`}
                          >
                            <CountUp from={0} to={Math.abs(stat.delta)} delay={0.3 + index * 0.1} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Quarter Button */}
          <div className="w-full flex items-center justify-center">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/next-quarter')}
              className="w-[360px] h-[70px] cursor-pointer mt-[12px]"
            >
              <img src={nextBtn} alt="Next Quarter" className="w-full" />
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  )
}
