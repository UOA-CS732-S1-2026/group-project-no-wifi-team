import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import taskBackground from '../assets/task-bg-final.jpg'
import taskCharacter from '../assets/task-character- sport.png'
import taskNote from '../assets/task-note-final.png'
import { get, post } from '../utils/request'

type AttributeLevel = 'bad' | 'average' | 'good' | 'excellent'

interface AttributeItem {
  key: string
  label: string
  icon: string
  level: AttributeLevel
}

interface ChoiceOption {
  id: string
  text: string
}

interface TaskInteractionContent {
  taskId?: string
  title: string
  description: string
  attributes: AttributeItem[]
  options: [ChoiceOption, ChoiceOption]
}

interface TaskInteractionScreenProps {
  content?: TaskInteractionContent
}

interface TaskChoiceResponse {
  message: string
  nextState: TaskInteractionContent
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <path
        d="M9.3 4.2a3.4 3.4 0 0 1 5.4 1.1 3 3 0 0 1 3.5 2.8 3 3 0 0 1-.4 1.5 3.4 3.4 0 0 1 1.3 2.7 3.4 3.4 0 0 1-2.8 3.3 3.1 3.1 0 0 1-3 3h-.7a3.4 3.4 0 0 1-6-.7 3 3 0 0 1-2.8-3 3 3 0 0 1 .7-2 3.4 3.4 0 0 1-.3-4.6 3.4 3.4 0 0 1 2.9-1.1A3.4 3.4 0 0 1 9.3 4.2Z"
        fill="#f1a3b8"
        stroke="#92505d"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.2c-1.2.6-1.9 1.5-1.9 2.8M11.8 6.3c.7.6 1.1 1.3 1.1 2.4m1 1.5c1 .4 1.6 1.1 1.7 2.2m-4.7 1.3c-.8.5-1.2 1.3-1.2 2.2"
        fill="none"
        stroke="#92505d"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <path
        d="M12 20.4 4.9 13.5A4.4 4.4 0 0 1 11 7.2l1 1 1-1a4.4 4.4 0 0 1 6.1 6.3L12 20.4Z"
        fill="#d87670"
        stroke="#7f3934"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 8.7c1.2.3 2 1.1 2.5 2.2"
        fill="none"
        stroke="#f7c5be"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="11.5" rx="2" fill="#9eb268" stroke="#60703a" strokeWidth="1.1" />
      <rect x="5.7" y="8.1" width="12.6" height="7.1" rx="1.2" fill="#cedc95" stroke="#6f8042" strokeWidth="0.9" />
      <circle cx="12" cy="11.6" r="1.85" fill="#90a55a" stroke="#64753e" strokeWidth="0.8" />
      <path d="M7.4 9.4h1.1M15.5 13.9h1.1" stroke="#64753e" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#bddb67_0%,#88a22d_58%,#6d841d_100%)] text-[#fff7de] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_2px_5px_rgba(66,46,22,0.14)]">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
        <path
          d="m6.5 12.4 3.1 3.2 7.9-8.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function StatusIcon({ kind }: { kind: string }) {
  if (kind === 'intelligence') return <BrainIcon />
  if (kind === 'health') return <HeartIcon />
  return <MoneyIcon />
}

const defaultContent: TaskInteractionContent = {
  taskId: 'gym-training-001',
  title: '任务进行中',
  description:
    '你在健身房挥洒汗水，减压的同时\n也让体质和耐力都变得更强了几分。',
  attributes: [
    { key: 'intelligence', label: 'Intelligence', icon: 'I', level: 'average' },
    { key: 'health', label: 'Health', icon: 'H', level: 'average' },
    { key: 'money', label: 'Money', icon: 'M', level: 'average' },
  ],
  options: [
    { id: 'leave', text: '直接回家' },
    { id: 'train', text: '继续锻炼' },
  ],
}

const levelLabel: Record<string, string> = {
  bad: '糟糕',
  average: '一般',
  good: '良好',
  excellent: '优秀',
}

export function TaskInteractionScreen({ content = defaultContent }: TaskInteractionScreenProps) {
  const navigate = useNavigate()
  const [taskContent, setTaskContent] = useState(content)
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<string>(content.options?.[1]?.id ?? 'train')

  useEffect(() => {
    let active = true

    get<TaskInteractionContent>('/game/task/current')
      .then((data) => {
        if (!active) return

        const nextContent = {
          ...data,
          title: '任务进行中',
          description:
            '你在健身房挥洒汗水，减压的同时\n也让体质和耐力都变得更强了几分。',
          options: [
            { id: data.options[0]?.id ?? 'leave', text: '直接回家' },
            { id: data.options[1]?.id ?? 'train', text: '继续锻炼' },
          ] as [ChoiceOption, ChoiceOption],
        }

        setTaskContent(nextContent)
        setSelectedOptionId(nextContent.options[1]?.id ?? 'train')
      })
      .catch(() => {
        if (!active) return
        setStatusMessage(null)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleChoice = async (optionId: string) => {
    setSelectedOptionId(optionId)
    setSubmittingId(optionId)
    setStatusMessage(null)

    try {
      const result = await post<TaskChoiceResponse>('/game/task/choice', {
        taskId: taskContent.taskId,
        choiceId: optionId,
      })

      setTaskContent((current) => ({
        ...result.nextState,
        title: current.title,
        description: current.description,
        options: current.options,
      }))
      setStatusMessage(result.message)
    } catch {
      setStatusMessage('暂时无法保存选择。')
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#7a5739] px-3 py-4 sm:px-4">
      <section
        className="relative w-full max-w-[1540px] overflow-hidden rounded-[22px] bg-[#5e4129] shadow-[0_24px_60px_rgba(27,14,5,0.4)]"
        style={{
          backgroundImage: `url(${taskBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(79,51,29,0.10),rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(67,42,22,0.10))]" />

        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[96px] bg-[rgba(50,30,14,0.45)] backdrop-blur-sm border-b border-[rgba(255,220,160,0.10)]">
          <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-0 rounded-full border border-[rgba(255,210,140,0.14)] bg-[rgba(55,33,14,0.52)] shadow-[0_4px_16px_rgba(20,10,3,0.18)] backdrop-blur-md">

              {/* 状态指标 */}
              <div className="flex items-center gap-x-6 px-6 py-2.5 sm:gap-x-9 sm:px-8">
                {taskContent.attributes.map((attribute) => (
                  <div key={attribute.key} className="flex items-center gap-2 whitespace-nowrap">
                    <StatusIcon kind={attribute.key} />
                    <span className="text-[13px] font-medium tracking-[0.06em] text-[#f0ddb8] sm:text-[15px]">
                      {levelLabel[attribute.level] ?? '一般'}
                    </span>
                  </div>
                ))}
              </div>

              {/* 分隔线 */}
              <div className="h-6 w-px bg-[rgba(255,210,140,0.18)]" />

              {/* 操作按钮 */}
              <div className="flex items-center gap-1 px-3 py-2.5">
                {([
                  { symbol: '↺', label: '重置', onClick: () => { setLoading(true); setStatusMessage(null) } },
                  { symbol: '+', label: '添加', onClick: () => {} },
                  { symbol: '×', label: '退出', onClick: () => navigate('/') },
                ] as const).map(({ symbol, label, onClick }) => (
                  <button
                    key={symbol}
                    type="button"
                    aria-label={label}
                    onClick={onClick}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] leading-none text-[#e8c98a] transition hover:bg-[rgba(255,210,140,0.12)] active:scale-95"
                  >
                    {symbol}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </header>

        <div className="relative z-10 grid min-h-[760px] grid-cols-1 items-stretch gap-4 px-6 pb-8 pt-8 sm:px-10 md:grid-cols-[56%_44%] md:px-14 md:pt-10">
          <div className="flex flex-col justify-start pt-[50px] pl-[260px] sm:pt-[58px] sm:pl-[280px] md:pt-[70px] md:pl-[296px] lg:pt-[80px] lg:pl-[312px] xl:pt-[88px] xl:pl-[328px]">
            <div className="max-w-[610px]">
              <h1 className="text-[clamp(42px,3.5vw,70px)] font-bold tracking-[0.01em] text-[#674732] [text-shadow:0_1px_0_rgba(255,255,255,0.20)]">
                {taskContent.title}
              </h1>
              <div className="mt-3 h-[2px] w-[182px] rounded-full bg-[linear-gradient(to_right,#7b5a43_0%,rgba(123,90,67,0.38)_62%,transparent_100%)]" />
            </div>

            <div className="mt-10 max-w-[620px]">
              <p className="whitespace-pre-line text-[clamp(16px,1.2vw,24px)] leading-[1.78] tracking-[0.005em] text-[#5c493b]">
                {loading ? 'Loading task...' : taskContent.description}
              </p>
            </div>

            {statusMessage ? (
              <p className="mt-4 ml-2 text-sm font-medium text-[#6c5037]">{statusMessage}</p>
            ) : null}

            <div className="mt-6 flex w-[350px] flex-col gap-1 sm:w-[366px]">
              {taskContent.options.map((option) => {
                const isSelected = option.id === selectedOptionId

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleChoice(option.id)}
                    disabled={loading || submittingId !== null}
                    className={`
                      group relative h-[98px] w-full text-left transition duration-200 ease-out
                      ${isSelected ? '-translate-y-[2px]' : ''}
                      disabled:cursor-not-allowed disabled:opacity-75
                    `}
                  >
                    <img
                      src={taskNote}
                      alt=""
                      aria-hidden="true"
                      className={`
                        absolute inset-0 h-full w-full object-fill transition duration-200
                        ${
                          isSelected
                            ? 'brightness-[1.16] saturate-[1.08] drop-shadow-[0_0_18px_rgba(247,216,106,0.42)]'
                            : 'brightness-[0.90] saturate-[0.84]'
                        }
                      `}
                    />

                    <span className="relative z-10 flex h-full items-center gap-3 px-5 py-4 text-[#493424]">
                      <span className="-ml-1 mt-[2px]">
                        <CheckIcon />
                      </span>
                      <span className="text-[clamp(24px,1.7vw,34px)] font-bold tracking-[0.01em]">
                        {submittingId === option.id ? '保存中...' : option.text}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-end">
            <div className="pointer-events-none absolute bottom-[11%] right-[15%] h-24 w-48 rounded-full bg-[radial-gradient(circle,rgba(111,82,49,0.10)_0%,rgba(111,82,49,0.02)_58%,transparent_84%)] blur-2xl" />
            <div className="pointer-events-none absolute right-[26%] top-[28%] text-[18px] text-[#76563a]/44">✦</div>
            <div className="pointer-events-none absolute right-[15%] top-[39%] text-[24px] text-[#76563a]/40">✦</div>
            <div className="pointer-events-none absolute right-[28%] top-[47%] text-[16px] text-[#76563a]/34">✦</div>

            <div className="relative flex h-full w-full items-center justify-end pr-[70px] sm:pr-[82px] md:pr-[96px] lg:pr-[110px]">
              <img
                src={taskCharacter}
                alt="Task character"
                className="
                  relative z-10 h-[430px] w-auto max-w-[92%] object-contain object-right-center
                  opacity-[0.97] mix-blend-multiply
                  drop-shadow-[0_10px_16px_rgba(78,54,31,0.08)]
                  md:h-[610px] lg:h-[720px]
                "
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}