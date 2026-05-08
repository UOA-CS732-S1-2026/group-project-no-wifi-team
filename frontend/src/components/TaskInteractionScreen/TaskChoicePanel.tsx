import { availableTasks, taskChoiceBg } from '../MonthlyTaskSelection/images'
import { attributeLabels } from './constants'
import type { AttributeKey, ChoiceOption, TaskInteractionContent } from './types'
import { effectClass, formatEffect } from './utils'

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
  return (
    <section
      className="relative flex h-full min-h-[520px] flex-col px-10 pb-9 pt-14"
      style={{
        backgroundImage: `url(${taskChoiceBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex h-[24px] items-center justify-between font-serif text-sm font-bold text-desk-mid">
        <span>{currentTask.category}</span>
        <span>
          Task {taskIndex + 1}/{totalTasks}
        </span>
      </div>

      <h1 className="mt-3 flex h-[88px] items-start font-serif text-[32px] font-bold leading-[1.12] text-desk-dark">
        {currentTask.title}
      </h1>

      <p className="mt-2 flex-1 overflow-hidden font-serif text-[15px] italic leading-[1.55] text-[#5d4935]">
        {selectedOption ? selectedOption.resultText : currentTask.description}
      </p>

      {selectedOption ? (
        <div className="mt-2 grid h-[70px] grid-cols-1 content-start gap-1">
          {(Object.keys(selectedOption.effects) as AttributeKey[]).map((key) => (
            <div
              key={key}
              className={`font-serif text-sm font-bold ${effectClass(selectedOption.effects[key])}`}
            >
              {attributeLabels[key]} {formatEffect(selectedOption.effects[key])}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 h-[70px]" />
      )}

      <div className="mt-2 flex flex-col gap-2">
        {currentTask.options.map((option) => {
          const isSelected = option.id === selectedOption?.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChoice(option)}
              disabled={selectedOption !== null}
              className={[
                'relative h-[60px] w-full shrink-0 cursor-pointer text-left transition active:scale-[0.985]',
                selectedOption && !isSelected ? 'opacity-55' : 'hover:scale-[1.01]',
              ].join(' ')}
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
            </button>
          )
        })}

        {selectedOption ? (
          <button
            type="button"
            onClick={onNext}
            className="relative mt-1 h-[50px] w-full cursor-pointer transition hover:scale-[1.01] active:scale-[0.985]"
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
              className="absolute inset-0 h-full w-full brightness-[0.9] saturate-[1.15]"
              style={{ objectFit: 'fill' }}
            />
            <span className="relative flex h-full items-center justify-center font-serif text-lg font-bold text-desk-dark">
              {isLastTask ? 'View Summary' : 'Next Task'}
            </span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
