import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const routeSummary = location.state as QuarterlySummaryProps | null
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

  // mockUser
  const getUserId = () => {
    return 'guest_mock_123456'
  }

  useEffect(() => {
    if (routeSummary) {
      setData(routeSummary)
      return
    }

    fetch('/api/game/quarterly-summary', {
      headers: {
        'x-user-id': getUserId(),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
      })
      .catch((err) => console.error('Failed to fetch summary:', err))
  }, [routeSummary])

  // if (loading) {
  //   return (
  //     <div className="flex h-dvh items-center justify-center bg-[#4b2f1e] font-serif text-[#f2dfb5]">
  //       Loading Summary...
  //     </div>
  //   )
  // }

  const {
    quarterName = 'First Quarter',
    quarterIndex = 1,
    stats = [],
    tasksCompleted = 0,
    totalTasks = 0,
    quartersRemaining = 4 - quarterIndex,
  } = { ...initialProps, ...data }

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
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', delay: 1, duration: 1 }}
            className="mx-auto w-[710px] pt-[54px]"
          >
            <img src={quarterTitle} alt="Summary Title" className="w-full drop-shadow-lg" />
          </motion.div>

          {/* Summary Content Board */}
          <div className="pl-[48px]">
            <div className="flex items-start gap-4 px-10 py-0">
              {/* Left Side: Calendar Visual */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ease: 'easeInOut', delay: 2, duration: 1 }}
                  style={{
                    backgroundImage: `url(${quarterCalender})`,
                    width: '318px',
                    height: '426px',
                    backgroundSize: '100% 100%',
                    marginLeft: '32px',
                  }}
                  className="relative flex items-start justify-center"
                />
              </div>

              {/* Right Side: Stats Display */}
              <div className="flex min-h-[426px] min-w-[600px] flex-1 flex-col justify-start pl-[24px] pr-[54px]">
                <div className="w-full space-y-[12px]">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 4, duration: 1 }}
                    className="mt-[26px]"
                  >
                    <span className="text-3xl font-bold text-[#5c3318]">{quarterName}</span>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 5, duration: 1 }}
                  >
                    <span className="text-3xl font-bold text-[#5c3318] leading-[54px]">
                      Graduation in <span className="font-black">{quartersRemaining}</span> Quarters
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 6, duration: 1 }}
                  >
                    <span className="text-3xl font-bold text-[#5c3318]">
                      Tasks completed:{' '}
                      <span className="font-black text-[#5c3318]">
                        <CountUp from={0} to={tasksCompleted} delay={6.3} duration={0.5}></CountUp>{' '}
                        / {totalTasks}
                      </span>{' '}
                    </span>
                  </motion.div>
                  <div style={{ marginTop: '28px' }}></div>
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="mt-[20px] grid w-[510px] grid-cols-[220px_86px_120px] items-center"
                    >
                      <motion.span
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ ease: 'easeInOut', delay: 7 + index * 3, duration: 1 }}
                        className="text-left text-2xl font-bold text-[#5c3318]"
                      >
                        {stat.label}
                      </motion.span>
                      <motion.span
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ ease: 'easeInOut', delay: 7 + index * 3, duration: 1 }}
                        className="text-right text-4xl font-black text-[#5c3318]"
                      >
                        <CountUp
                          from={stat.value - stat.delta}
                          to={stat.value}
                          delay={7 + index * 3 + 2}
                          duration={1}
                        />
                      </motion.span>
                      <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ ease: 'easeInOut', delay: 7 + index * 3 + 1, duration: 1 }}
                        className="ml-6 flex min-w-[100px] items-center gap-2"
                      >
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
                          <CountUp
                            from={0}
                            to={Math.abs(stat.delta)}
                            delay={7 + index * 3 + 1}
                            duration={1}
                          />
                        </span>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Quarter Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', delay: 16, duration: 1 }}
            className="flex w-full items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/next-quarter')}
              className="mt-[-16px] h-[70px] w-[360px] cursor-pointer"
            >
              <img src={nextBtn} alt="Next Quarter" className="w-full" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
