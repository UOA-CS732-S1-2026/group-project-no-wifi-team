import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CountUp } from '../utils/CountUp'
import commonBackground from '../assets/CommonImage/common-background.png'
import { SettingsModal } from '../components/TitleScreen/SettingsModal'
import { useMusicContext } from '../contexts/MusicContext'
import settingImg from '../assets/CommonImage/setting.png'
import {
  quarterBg,
  quarterCalender,
  quarterArrowDown,
  quarterArrowUp,
  quarterTitle,
  nextBtn,
  statusBrain,
  statusHealth,
  statusWealth,
  viewEnding,
} from '../assets/QuarterPage'

// Explicit design dimensions requested
const DESIGN_WIDTH = 1536
const DESIGN_HEIGHT = 1024

const statusIcons = [statusBrain, statusHealth, statusWealth]

interface QuarterlySummaryProps {
  quarterName?: string // e.g. "Quarter 1" or "Orientation"
  quarterIndex?: number
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
  const { musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled } = useMusicContext()
  const [showSettingsModal, setShowSettingsModal] = useState(false)

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

  // // mockUser
  // const getUserId = () => {
  //   return 'guest_mock_123456'
  // }

  useEffect(() => {
    if (routeSummary) {
      setData(routeSummary)
      return
    }

    // fetch('/api/game/quarterly-summary', {
    //   headers: {
    //     'x-user-id': getUserId(),
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setData(json)
    //   })
    //   .catch((err) => console.error('Failed to fetch summary:', err))
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

  const duration = 0.5 // default duration for animations

  return (
    <main
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden font-serif text-[#5a3218]"
      style={{ backgroundImage: `url(${commonBackground})`, backgroundSize: '100% 100%' }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: `${DESIGN_WIDTH * scale}px`,
          height: `${DESIGN_HEIGHT * scale}px`,
        }}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
            transform: `scale(${scale})`,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: 'easeInOut', delay: 0.3, duration: duration }}
            className="absolute bg-center bg-no-repeat"
            style={{
              width: `1310px`,
              height: `714px`,
              top: '200px',
              left: '126px',
              backgroundImage: `url(${quarterBg})`,
              backgroundSize: '100% 100%',
            }}
          >
            {/* Title Banner */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeInOut', delay: duration, duration: duration }}
              className="pt-[4px] w-[840px] mx-auto"
            >
              <img src={quarterTitle} alt="Summary Title" className="w-full drop-shadow-lg" />
            </motion.div>

            {/* Summary Content Board */}
            <div className="pl-[0px]">
              <div className="flex items-center gap-4 px-10">
                {/* Left Side: Calendar Visual */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'easeInOut', delay: 2 * duration, duration: duration }}
                    style={{
                      backgroundImage: `url(${quarterCalender})`,
                      width: '460px',
                      height: '440px',
                      backgroundSize: 'auto 100%',
                    }}
                    className="relative flex items-start justify-center bg-center bg-no-repeat"
                  >
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ ease: 'easeInOut', delay: 3 * duration, duration: duration }}
                      className="mt-[48px] ml-[10px] text-[74px] font-black text-[#4b3116]"
                    >
                      {`Q${quarterIndex}`}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Side: Stats Display */}
                <div className="flex flex-1 flex-col justify-start pl-[54px] pr-[54px] min-h-[426px] min-w-[600px]">
                  <div className="w-full space-y-[12px]">
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ease: 'easeInOut', delay: 4 * duration, duration: duration }}
                      className="mt-[6px]"
                    >
                      <span className="text-4xl font-bold text-[#5c3318] leading-[54px]">
                        {quarterName}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ease: 'easeInOut', delay: 5 * duration, duration: duration }}
                    >
                      <span className="text-4xl font-bold text-[#5c3318] leading-[54px]">
                        {quartersRemaining > 0 ? (
                          <>Graduation in <span className="font-black">{quartersRemaining}</span> Quarters</>
                        ) : 'Graduation Assessment Time!'}
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ease: 'easeInOut', delay: 6 * duration, duration: duration }}
                    >
                      <span className="text-4xl font-bold text-[#5c3318] leading-[54px]">
                        Tasks completed:{' '}
                        <span className="font-black text-[#5c3318]">
                          <CountUp
                            from={0}
                            to={tasksCompleted}
                            delay={6 * duration}
                            duration={duration}
                          ></CountUp>{' '}
                          / {totalTasks}
                        </span>{' '}
                      </span>
                    </motion.div>
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between w-[400px]">
                        <motion.div
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ ease: 'easeInOut', delay: 7 * duration + index * 3 * duration, duration: duration }}
                          className="flex items-center text-3xl font-bold text-[#5c3318] pl-[8px] leading-[54px]"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1, 1.2, 1],
                            }}
                            transition={{
                              duration: duration,
                              repeat: 1,
                              ease: 'easeInOut',
                              times: [0, 0.2, 0.4, 0.6, 1],
                              delay: 7 * duration + index * 3 * duration + 0.5 * duration,
                            }}
                            className="w-[54px] h-[54px] mr-2 bg-contain bg-no-repeat bg-center"
                            style={{
                              backgroundImage: `url(${statusIcons[index]})`,
                            }}
                          ></motion.div>
                          <div>{stat.label}</div>
                        </motion.div>
                        <div className="flex items-center gap-6">
                          <motion.span
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ ease: 'easeInOut', delay: 7 * duration + index * 3 * duration, duration: duration }}
                            className="text-4xl font-black text-[#5c3318]"
                          >
                            {/* <CountUp
                              from={stat.value - stat.delta}
                              to={stat.value}
                              delay={7 * duration + index * 3 * duration + 2 * duration}
                              duration={duration}
                            /> */}
                          </motion.span>
                          <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              ease: 'easeInOut',
                              delay: 7 * duration + index * 3 * duration + 1 * duration,
                              duration: duration,
                            }}
                            className="flex min-w-[100px] items-center gap-1"
                          >
                            {stat.delta !== 0 && (
                              <motion.img
                                animate={{ y: [0, stat.delta > 0 ? -6 : 6, 0], scale: [1, 1.1, 1] }}
                                transition={{
                                  duration: 0.6 * duration,
                                  repeat: 2,
                                  ease: 'easeOut',
                                  delay: 7 * duration + index * 3 * duration + 1.5 * duration,
                                }}
                                src={stat.delta > 0 ? quarterArrowUp : quarterArrowDown}
                                alt="arrow-change"
                                className="h-10 w-10 object-contain"
                              />
                            )}
                            <span
                              className={`text-2xl font-bold ${
                                stat.delta >= 0 ? 'text-[#4a7228]' : 'text-[#a23b3b]'
                              }`}
                            >
                              {/* <CountUp
                                from={0}
                                to={Math.abs(stat.delta)}
                                delay={7 * duration + index * 3 * duration + 1 * duration}
                                duration={duration}
                              /> */}
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
              transition={{ ease: 'easeInOut', delay: 16 * duration + 0.3, duration: duration }}
              className="w-full flex items-center justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/next-quarter')}
                className="w-[540px] h-[115px] cursor-pointer"
              >
                <img src={quartersRemaining > 0 ? nextBtn : viewEnding} alt={quartersRemaining === 0 ? 'View Ending' : 'Next Quarter'} className="w-full" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowSettingsModal(true)}
        className="fixed bottom-[2vh] right-[2vw] z-30 w-[54px] transition duration-200 hover:rotate-45 hover:scale-110 active:scale-95 sm:w-[74px]"
        aria-label="Settings"
      >
        <img src={settingImg} alt="Settings" className="w-full drop-shadow-lg" />
      </button>

      {showSettingsModal && (
        <SettingsModal
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onMusicToggle={setMusicEnabled}
          onSfxToggle={setSfxEnabled}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </main>
  )
}
