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
      <div className="flex h-[24px] items-center justify-between font-serif text-sm font-bold text-desk-mid">
        <span>{isRandomEvent ? 'Random Event' : currentTask.category}</span>
        <span>
          Task {taskIndex + 1}/{totalTasks}
        </span>
      </div>

      <h1 className="mt-3 flex min-h-[60px] items-start font-serif text-[28px] font-bold leading-[1.2] text-desk-dark">
        {currentTask.title}
      </h1>

      <p className="mt-2 flex-1 overflow-hidden font-serif text-[15px] italic leading-[1.55] text-[#5d4935]">
        {selectedOption ? selectedOption.resultText : currentTask.description}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {!isRandomEvent &&
          currentTask.options.map((option) => (
            <button
              key={option.id}
              type="button"
              data-sfx="make-choice"
              onClick={() => !selectedOption && onChoice(option)}
              className="relative h-[60px] w-full shrink-0 cursor-pointer text-left transition hover:scale-[1.01] active:scale-[0.985]"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                visibility: selectedOption ? 'hidden' : 'visible',
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
            </button>
          ))}

        <button
          type="button"
          onClick={showNext ? onNext : undefined}
          className="relative mt-1 h-[50px] w-full cursor-pointer transition hover:scale-[1.01] active:scale-[0.985]"
          style={{ background: 'none', border: 'none', padding: 0, visibility: showNext ? 'visible' : 'hidden' }}
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
        </button>
      </div>
    </section>
  )
}
