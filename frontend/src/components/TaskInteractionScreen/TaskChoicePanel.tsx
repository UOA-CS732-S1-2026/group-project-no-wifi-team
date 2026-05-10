import { motion, AnimatePresence } from 'motion/react'
import { availableTasks, taskChoiceBg } from '../MonthlyTaskSelection/images'
import type { ChoiceOption, TaskInteractionContent } from './types'

interface Props {
  currentTask: TaskInteractionContent
  taskIndex: number
  totalTasks: number
  selectedOption: ChoiceOption | null
  isLastTask: boolean
  onChoice: (option: ChoiceOption) => void
  onNext: () => void
}

export function TaskChoicePanel({
  currentTask,
  taskIndex,
  totalTasks,
  selectedOption,
  isLastTask,
  onChoice,
  onNext,
}: Props) {
  const isRandomEvent = !!currentTask.isRandomEvent
  const isLivingExpenses = currentTask.taskId === 'living-expenses'
  const showNext = isRandomEvent || selectedOption !== null

  return (
    <section
      className="relative flex h-[680px] flex-col px-10 pb-9 pt-14"
      style={{
        backgroundImage: `url(${taskChoiceBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex h-[24px] items-center justify-between font-serif text-sm font-bold text-desk-mid"
      >
        <span>
          {isLivingExpenses
            ? 'Living Allowance'
            : isRandomEvent
              ? 'Random Event'
              : currentTask.category}
        </span>
        <span>
          Task {taskIndex + 1}/{totalTasks}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-3 flex min-h-[60px] items-start font-serif text-[28px] font-bold leading-[1.2] text-desk-dark"
      >
        {currentTask.title}
      </motion.h1>

      {isLivingExpenses ? (() => {
        const [allowanceText, quoteRaw] = currentTask.description.split('\n\n')
        const lastDash = quoteRaw?.lastIndexOf(' — ') ?? -1
        const quoteLine = lastDash >= 0 ? quoteRaw.slice(0, lastDash) : quoteRaw
        const quoteAuthor = lastDash >= 0 ? quoteRaw.slice(lastDash + 3) : ''
        return (
          <div className="mt-2 flex flex-1 flex-col">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="font-serif text-[15px] italic leading-[1.55] text-[#5d4935]"
            >
              {allowanceText}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1.1, duration: 1.8, ease: 'easeOut' }}
              className="my-auto flex flex-col items-center gap-2 text-center"
            >
              <p className="font-serif text-[17px] italic leading-[1.7] text-[#6b4226]">
                {quoteLine}
              </p>
              <p className="font-serif text-[14px] italic text-[#6b4226]">
                — {quoteAuthor}
              </p>
            </motion.div>
          </div>
        )
      })() : (
        <div className="mt-10 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedOption ? (
              <motion.p
                key="description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="font-serif text-[15px] italic leading-[1.55] text-[#5d4935]"
              >
                {currentTask.description}
              </motion.p>
            ) : (
              <motion.p
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-[15px] italic leading-[1.55] text-[#5d4935]"
              >
                {selectedOption.resultText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {!isRandomEvent && !selectedOption &&
            currentTask.options.map((option, idx) => (
              <motion.button
                key={option.id}
                layout
                type="button"
                data-sfx="make-choice"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: -20,
                  transition: { delay: idx * 0.03, duration: 0.2 } 
                }}
                transition={{ 
                  opacity: { delay: 1.6 + idx * 0.1, duration: 0.3 },
                  x: { delay: 1.6 + idx * 0.1, duration: 0.3 },
                  scale: { duration: 0.2 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChoice(option)}
                className="relative h-[60px] w-full shrink-0 cursor-pointer text-left"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                <img
                  src={availableTasks}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  style={{ objectFit: 'fill' }}
                />
                <span className="relative flex h-full items-center px-7 font-serif text-[17px] font-bold leading-snug text-desk-dark">
                  {option.text}
                </span>
              </motion.button>
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {showNext && (
            <motion.button
              key="next-button"
              layout
              type="button"
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ 
                opacity: { delay: isRandomEvent ? 1.6 : 0.8, duration: 0.4 },
                y: { delay: isRandomEvent ? 1.6 : 0.8, duration: 0.4 },
                scale: { delay: isRandomEvent ? 1.6 : 0.8, duration: 0.4, ease: 'backOut' },
              }}
              whileHover={{ scale: 1.05, transition: { delay: 0 } }}
              whileTap={{ scale: 0.95, transition: { delay: 0 } }}
              onClick={onNext}
              className="relative mt-1 h-[50px] w-full cursor-pointer"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <img
                src={availableTasks}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full brightness-[0.9] saturate-[1.15]"
                style={{ objectFit: 'fill' }}
              />
              <span className="relative flex h-full items-center justify-center font-serif text-lg font-bold text-desk-dark">
                {isLastTask ? 'View Summary' : 'Next Task'}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
