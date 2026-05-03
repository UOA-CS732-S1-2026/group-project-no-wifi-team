import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, stagger } from 'motion/react'
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.6,
        delayChildren: stagger(1.2),
      },
    },
  }

  const itemVariants = {
    visible: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 1, delayChildren: stagger(0.07, { startDelay: 0.2 }) },
    },
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
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', delay: 1, duration: 1 }}
            className="pt-[86px] w-[710px] mx-auto"
          >
            <img src={quarterTitle} alt="Summary Title" className="w-full drop-shadow-lg" />
          </motion.div>

          {/* Summary Content Board */}
          <div className="pl-[72px]">
            <div className="flex items-center gap-4 px-10 py-2">
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
                    marginLeft: '60px',
                  }}
                  className="relative flex items-start justify-center"
                >
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 3, duration: 1 }}
                    className="mt-[64px] ml-[50px] text-[84px] font-black text-[#4b3116]"
                  >
                    {quarterIndex}
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Side: Stats Display */}
              <div className="flex flex-1 flex-col justify-start pl-[54px] pr-[54px] min-h-[426px] min-w-[600px]">
                <div className="w-full space-y-[12px]">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 4, duration: 1 }}
                    className="mt-[54px]"
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
                  <div style={{ marginTop: '30px' }}></div>
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between mt-[24px]">
                      <motion.span
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ ease: 'easeInOut', delay: 7 + index * 3, duration: 1 }}
                        className="text-2xl font-bold text-[#5c3318] pl-[72px]"
                      >
                        {stat.label}
                      </motion.span>
                      <div className="flex items-center gap-6">
                        <motion.span
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ ease: 'easeInOut', delay: 7 + index * 3, duration: 1 }}
                          className="text-4xl font-black text-[#5c3318]"
                        >
                          <CountUp
                            from={stat.value - stat.delta}
                            to={stat.value}
                            delay={7 + index * 3 + 2}
                            duration={1}
                          />
                        </motion.span>
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ ease: 'easeInOut', delay: 7 + index * 3 + 1, duration: 1 }}
                          className="flex min-w-[100px] items-center gap-1"
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
            className="w-full flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/next-quarter')}
              className="w-[360px] h-[70px] cursor-pointer mt-[12px]"
            >
              <img src={nextBtn} alt="Next Quarter" className="w-full" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
