import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CountUp } from '../utils/CountUp'

interface MonthlySummaryProps {
  monthName?: string
  monthIndex?: number
  stats?: {
    label: string
    value: number
    delta: number
  }[]
  totalScore?: number
  monthsToGraduation?: number
  tasksCompleted?: number
  totalTasks?: number
}

export function MonthlySummary({
  ...initialProps
}: MonthlySummaryProps) {
  const navigate = useNavigate()
  const [data, setData] = useState<MonthlySummaryProps | null>(null)
  const [loading, setLoading] = useState(true)

  // const getUserId = () => {
  //   let id = localStorage.getItem('game_guest_id')
  //   if (!id) {
  //     id = 'guest_' + Math.random().toString(36).substring(2, 9)
  //     localStorage.setItem('game_guest_id', id)
  //   }
  //   return id
  // }

  // mockUser
  const getUserId = () => {
    return 'guest_mock_123456'; 
  }

  useEffect(() => {
    fetch('/api/game/monthly-summary', {
      headers: {
        'x-user-id': getUserId()
      }
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => console.error('Failed to fetch summary:', err))
  }, [])

  if (loading) {
    return <div className="flex h-dvh items-center justify-center bg-paper text-desk-dark">Loading Summary...</div>
  }

  const {
    monthName = 'Unknown',
    monthIndex = 0,
    stats = [],
    tasksCompleted = 0,
    totalTasks = 0,
    monthsToGraduation = 12 - monthIndex,
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
    <div
      className="flex h-dvh w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/monthly-bg.jpg")' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-lg bg-transparent p-8 shadow-2xl backdrop-blur-sm sm:mx-4"
        style={{ perspective: 1000 }}
      >
        {/* Month Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="font-serif text-4xl font-bold text-desk-dark">{monthName}</h2>
          <p className="text-sm font-medium tracking-widest uppercase text-gray-500">
            Monthly Summary
          </p>
        </motion.div>

        {/* Calendar Icon/Visual */}
        <motion.div
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 100,
            delay: 0.3,
          }}
          className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-desk-dark bg-paper shadow-inner"
        >
          <span className="font-serif text-3xl font-bold text-desk-dark">{monthIndex}</span>
        </motion.div>

        {/* Graduation Countdown & Tasks */}
        <motion.div variants={itemVariants} className="text-center space-y-1">
          <p className="text-desk-dark font-medium">
            Months until graduation: <span className="text-lg font-bold">{monthsToGraduation}</span>{' '}
            {monthsToGraduation > 1 ? 'Months' : 'Month'}
          </p>
          <p className="text-gray-600 text-sm">
            Tasks completed this month:{' '}
            <span className="font-bold text-green-600">
              {tasksCompleted}/{totalTasks}
            </span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="w-full space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center justify-between border-b border-gray-200 pb-2"
            >
              <span className="font-serif text-lg text-desk-dark">{stat.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">
                  <CountUp 
                    from={stat.value - stat.delta} 
                    to={stat.value} 
                    delay={1.0 + index * 0.1} 
                  />
                </span>
                <span
                  className={`text-sm font-bold ${stat.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  <CountUp 
                    from={0} 
                    to={stat.delta} 
                    delay={0.6 + index * 0.1} 
                    showSign 
                  />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/next-month')}
          className="mt-4 w-full rounded-full bg-desk-dark py-3 font-bold text-white shadow-lg transition-colors hover:bg-desk-black"
        >
          Next Month
        </motion.button>
      </motion.div>
    </div>
  )
}
