import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import characterBg from '../assets/character-select/character-bg.png'

import heroLeft from '../assets/character-select/hero-left.png'
import heroRight from '../assets/character-select/hero-right.png'
import heroPlane from '../assets/character-select/hero-plane.png'

import backHomeBtn from '../assets/character-select/back-home-btn.png'
import arrowLeft from '../assets/character-select/arrow-left.png'
import arrowRight from '../assets/character-select/arrow-right.png'

import iconAcademic from '../assets/character-select/icon-academic.png'
import iconRich from '../assets/character-select/icon-rich.png'
import iconFitness from '../assets/character-select/icon-fitness.png'
import iconOrdinary from '../assets/character-select/icon-ordinary.png'
import iconHeavenlyDragon from '../assets/character-select/icon-heavenly-dragon.png'

import selectGreen from '../assets/character-select/card-select-green.png'
import selectGold from '../assets/character-select/card-select-gold.png'
import selectBlue from '../assets/character-select/card-select-blue.png'
import selectRed from '../assets/character-select/card-select-red.png'
import selectBrown from '../assets/character-select/card-select-brown.png'

type AttributeLevel = 'Excellent' | 'Average' | 'Poor'

type CharacterStats = {
  intelligence: number
  health: number
  wealth: number
}

type Character = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  selectButton: string
  stats: CharacterStats
}


const characters: Character[] = [
  {
    id: 'academic-achiever',
    title: 'Academic Achiever',
    subtitle: 'STUDY-FOCUSED ROUTE',
    description:
      'A student with excellent academic ability, but poor health due to heavy pressure and long study hours.',
    icon: iconAcademic,
    selectButton: selectGreen,
    stats: {
      intelligence: 96,
      health: 30,
      wealth: 55,
    },
  },
  {
    id: 'rich-kid',
    title: 'Rich Kid',
    subtitle: 'MONEY ADVANTAGE ROUTE',
    description:
      'A student with strong financial support, but weak study habits and an unhealthy lifestyle.',
    icon: iconRich,
    selectButton: selectGold,
    stats: {
      intelligence: 30,
      health: 35,
      wealth: 90,
    },
  },
  {
    id: 'fitness-enthusiast',
    title: 'Fitness Enthusiast',
    subtitle: 'HEALTH-FOCUSED ROUTE',
    description:
      'A student with excellent energy and health, but limited savings and only average academic performance.',
    icon: iconFitness,
    selectButton: selectBlue,
    stats: {
      intelligence: 50,
      health: 95,
      wealth: 30,
    },
  },
  {
    id: 'ordinary-student',
    title: 'Ordinary Student',
    subtitle: 'BALANCED ROUTE',
    description:
      'A normal international student. Nothing is too strong or too weak at the beginning.',
    icon: iconOrdinary,
    selectButton: selectRed,
    stats: {
      intelligence: 60,
      health: 60,
      wealth: 60,
    },
  },
  {
    id: 'heavenly-dragon',
    title: 'Heavenly Dragon',
    subtitle: 'ALL-EXCELLENT ROUTE',
    description:
      'A privileged student with excellent intelligence and wealth, but very poor health from stress and pressure.',
    icon: iconHeavenlyDragon,
    selectButton: selectBrown,
    stats: {
      intelligence: 99,
      health: 25,
      wealth: 99,
    },
  },
]

const DESIGN_WIDTH = 1365
const DESIGN_HEIGHT = 1160
const MOBILE_BREAKPOINT = 768

function useResponsiveStageScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / DESIGN_WIDTH

      // 电脑端只按宽度缩放，高度不够就上下滚动
      const nextScale = Math.min(widthScale, 1)

      setScale(nextScale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    return () => {
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  return scale
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)

    return () => {
      window.removeEventListener('resize', updateIsMobile)
    }
  }, [])

  return isMobile
}
function getAttributeLevel(value: number): AttributeLevel {
  if (value < 45) {
    return 'Poor'
  }

  if (value < 85) {
    return 'Average'
  }

  return 'Excellent'
}
function getLevelClass(level: AttributeLevel) {
  if (level === 'Excellent') {
    return 'bg-[#97a06f] text-[#fff8df]'
  }

  if (level === 'Poor') {
    return 'bg-[#b66a5c] text-[#fff8df]'
  }

  return 'bg-[#f3cd77] text-[#6b3f22]'
}

function AttributeRow({
  label,
  value,
  mobile = false,
}: {
  label: string
  value: number
  mobile?: boolean
}) {
  const level = getAttributeLevel(value)

  return (
    <div
      className={`flex items-center justify-between border-b border-[#e7c99c] last:border-b-0 ${
        mobile ? 'h-[40px] px-[12px]' : 'h-[45px] px-[15px]'
      }`}
    >
      <span
        className={`text-left font-bold tracking-[0.08em] text-[#7a4a27] ${
          mobile ? 'w-[125px] text-[11px]' : 'w-[135px] text-[13px]'
        }`}
      >
        {label}
      </span>

      <span
        className={`flex items-center justify-center rounded-full border border-[#cfa15d] px-[10px] font-bold shadow-inner ${getLevelClass(
          level,
        )} ${mobile ? 'h-[27px] w-[88px] text-[11px]' : 'h-[29px] w-[96px] text-[12px]'}`}
      >
        {level}
      </span>
    </div>
  )
}
function AttributeInfoTip({ mobile = false }: { mobile?: boolean }) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="absolute right-[14px] top-[14px] z-30">
      <button
        type="button"
        onClick={() => {
          if (mobile) setShowTip((current) => !current)
        }}
        onMouseEnter={() => {
          if (!mobile) setShowTip(true)
        }}
        onMouseLeave={() => {
          if (!mobile) setShowTip(false)
        }}
        className={`flex items-center justify-center rounded-full border border-[#d3a86e] bg-[#fff7e5] font-bold text-[#8a5a2f] shadow-[0_3px_8px_rgba(83,50,24,0.18)] transition duration-200 hover:scale-110 hover:bg-[#fff0c7] ${
          mobile ? 'h-[28px] w-[28px] text-[15px]' : 'h-[30px] w-[30px] text-[16px]'
        }`}
        aria-label="Show attribute range information"
      >
        i
      </button>

      {showTip && (
        <div
          className={`absolute right-0 top-[38px] rounded-[14px] border border-[#d8af7a] bg-[#fff9ec] px-[13px] py-[10px] text-left font-bold leading-[1.45] text-[#68401f] shadow-[0_8px_18px_rgba(83,50,24,0.20)] ${
            mobile ? 'w-[215px] text-[10px]' : 'w-[235px] text-[11px]'
          }`}
        >
          <p className="mb-[5px] text-[#5a3218]">Attribute Levels</p>

          <div className="space-y-[3px]">
            <p>
              <span className="text-[#b66a5c]">Poor</span>: 0–44
            </p>
            <p>
              <span className="text-[#9b6540]">Average</span>: 45–84
            </p>
            <p>
              <span className="text-[#6f7b4d]">Excellent</span>: 85–100
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
function DesktopCharacterCard({
  character,
  onSelect,
}: {
  character: Character
  onSelect: (character: Character) => void
}) {
  return (
    <article className="relative h-[540px] w-[300px] shrink-0 rounded-[24px] border-[2px] border-[#d7ae7b] bg-[#fff8ea]/95 p-[14px] shadow-[0_8px_16px_rgba(83,50,24,0.10)]">
      <AttributeInfoTip />
      <div className="absolute inset-[10px] rounded-[18px] border border-[#ecd3ac]" />

      <div className="relative z-10 grid h-full grid-rows-[82px_60px_34px_96px_120px_100px] items-center text-center">
        <div className="flex items-center justify-center">
          <img
            src={character.icon}
            alt={character.title}
            className="h-[90px] w-[90px] object-contain"
          />
        </div>

        <h2 className="flex h-full -translate-y-[5px] items-center justify-center text-[23px] font-bold leading-[1.08] text-[#5a3218]">
          {character.title}
        </h2>

        <p className="flex h-full -translate-y-[20px] items-center justify-center text-[11px] font-bold leading-[1.25] tracking-[0.13em] text-[#9b6540]">
          {character.subtitle}
        </p>

        <div className="flex h-full -translate-y-[20px] items-center justify-center rounded-[14px] bg-[#f4e4c8]/90 px-4 shadow-inner">
          <p className="text-[12px] leading-[1.45] text-[#714729]">{character.description}</p>
        </div>

        <div className="w-full -translate-y-[5px] overflow-hidden rounded-[15px] border-[2px] border-[#ddb786] bg-[#fffaf0]">
          <AttributeRow label="INTELLIGENCE" value={character.stats.intelligence} />
          <AttributeRow label="HEALTH" value={character.stats.health} />
          <AttributeRow label="WEALTH" value={character.stats.wealth} />
        </div>

        <button
          type="button"
          onClick={() => onSelect(character)}
          className="mx-auto block w-[240px] transition duration-200 hover:scale-105 active:scale-95"
          aria-label={`Select ${character.title}`}
        >
          <img src={character.selectButton} alt="Select" className="w-full object-contain" />
        </button>
      </div>
    </article>
  )
}

function MobileCharacterCard({
  character,
  onSelect,
}: {
  character: Character
  onSelect: (character: Character) => void
}) {
  return (
    <article className="relative mx-auto w-full max-w-[340px] rounded-[24px] border-[2px] border-[#d7ae7b] bg-[#fff8ea]/95 p-[14px] shadow-[0_8px_16px_rgba(83,50,24,0.12)]">
      <AttributeInfoTip mobile />
      <div className="pointer-events-none absolute inset-[9px] rounded-[18px] border border-[#ecd3ac]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img
          src={character.icon}
          alt={character.title}
          className="h-[92px] w-[92px] object-contain"
        />

        <h2 className="mt-2 text-[25px] font-bold leading-[1.08] text-[#5a3218]">
          {character.title}
        </h2>

        <p className="mt-2 text-[11px] font-bold leading-[1.3] tracking-[0.13em] text-[#9b6540]">
          {character.subtitle}
        </p>

        <div className="mt-4 flex min-h-[88px] w-full items-center justify-center rounded-[14px] bg-[#f4e4c8]/90 px-4 py-3 shadow-inner">
          <p className="text-[13px] leading-[1.45] text-[#714729]">{character.description}</p>
        </div>

        <div className="mt-4 w-full overflow-hidden rounded-[15px] border-[2px] border-[#ddb786] bg-[#fffaf0]">
          <AttributeRow label="INTELLIGENCE" value={character.stats.intelligence} mobile />
          <AttributeRow label="HEALTH" value={character.stats.health} mobile />
          <AttributeRow label="WEALTH" value={character.stats.wealth} mobile />
        </div>

        <button
          type="button"
          onClick={() => onSelect(character)}
          className="mt-5 block w-[250px] max-w-full transition duration-200 active:scale-95"
          aria-label={`Select ${character.title}`}
        >
          <img src={character.selectButton} alt="Select" className="w-full object-contain" />
        </button>
      </div>
    </article>
  )
}

export function CharacterSelectScreen() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const stageScale = useResponsiveStageScale()
  const isMobile = useIsMobile()

  function scrollLeftHandler() {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: 'smooth',
    })
  }

  function scrollRightHandler() {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: 'smooth',
    })
  }

  function chooseCharacter(character: Character) {
    localStorage.setItem('selectedCharacter', JSON.stringify(character))
    navigate('/game')
  }

  if (isMobile) {
    return (
      <main
        className="min-h-screen w-full overflow-y-auto bg-cover bg-center px-4 py-5 font-serif text-[#5a3218]"
        style={{ backgroundImage: `url(${characterBg})` }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-5 w-[165px] transition duration-200 active:scale-95"
          aria-label="Back to Home"
        >
          <img src={backHomeBtn} alt="Back to Home" className="w-full" />
        </button>

        <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[#cfa472] bg-[#fff2d9]/90 px-4 py-6 text-center shadow-[0_10px_18px_rgba(83,50,24,0.12)]">
          <div className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-[#e7c89d]" />

          <img src={heroPlane} alt="" className="absolute left-3 top-2 w-[115px] opacity-85" />

          <img src={heroLeft} alt="" className="absolute bottom-1 left-1 w-[105px] opacity-90" />

          <img src={heroRight} alt="" className="absolute bottom-1 right-1 w-[120px] opacity-90" />

          <div className="relative z-10 mx-auto max-w-[320px]">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#9a6840]">
              INTERNATIONAL STUDENT SIMULATOR
            </p>

            <h1 className="mt-3 text-[36px] font-bold leading-[0.95] text-[#5c3318]">
              Choose Your Character
            </h1>

            <div className="my-3 text-[17px] text-[#9d6b41]">── ✦ 🎓 ✦ ──</div>

            <p className="text-[14px] leading-[1.55] text-[#7a5030]">
              Each character begins with different strengths and weaknesses. Your starting
              attributes will affect your student life and possible endings.
            </p>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[30px] leading-none text-[#b5804e]">▌</span>

            <h2 className="text-[20px] font-bold tracking-[0.13em] text-[#724624]">
              CHARACTER LIST
            </h2>
          </div>

          <div className="flex flex-col gap-5 pb-8">
            {characters.map((character) => (
              <MobileCharacterCard
                key={character.id}
                character={character}
                onSelect={chooseCharacter}
              />
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-auto bg-cover bg-center font-serif"
      style={{ backgroundImage: `url(${characterBg})` }}
    >
      <div
        className="relative mx-auto"
        style={{
          width: `${DESIGN_WIDTH * stageScale}px`,
          height: `${DESIGN_HEIGHT * stageScale}px`,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
            transform: `scale(${stageScale})`,
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute left-[82px] top-[48px] z-30 w-[215px] transition duration-200 hover:scale-105 active:scale-95"
            aria-label="Back to Home"
          >
            <img src={backHomeBtn} alt="Back to Home" className="w-full" />
          </button>

          <section className="absolute left-[120px] top-[120px] z-20 h-[275px] w-[1125px] rounded-[28px] border-[3px] border-[#cfa472] bg-[#fff2d9]/88 shadow-[0_10px_18px_rgba(83,50,24,0.12)]">
            <div className="absolute inset-[12px] rounded-[22px] border border-[#e7c89d]" />

            <img src={heroLeft} alt="" className="absolute bottom-[-20px] left-[30px] w-[255px]" />

            <img
              src={heroRight}
              alt=""
              className="absolute bottom-[-35px] right-[34px] w-[265px]"
            />

            <img src={heroPlane} alt="" className="absolute left-[60px] top-[10px] w-[550px]" />

            <div className="relative z-40 flex h-full flex-col items-center justify-center px-[100px] text-center">
              <p className="mb-[15px] text-[20px] font-bold tracking-[0.30em] text-[#9a6840]">
                INTERNATIONAL STUDENT SIMULATOR
              </p>

              <h1 className="text-[60px] font-bold leading-[1] text-[#5c3318]">
                Choose Your Character
              </h1>

              <div className="my-[10px] text-[21px] text-[#9d6b41]">─── ✦ 🎓 ✦ ───</div>

              <p className="text-[18px] leading-[1.6] text-[#7a5030]">
                Each character starts with different attribute levels.
                <br />
                Scroll horizontally to view all character options.
              </p>
            </div>
          </section>

          <section className="absolute left-[105px] top-[440px] z-20 flex w-[1070px] items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[36px] leading-none text-[#b5804e]">▌</span>

              <h2 className="text-[24px] font-bold tracking-[0.16em] text-[#724624]">
                CHARACTER LIST
              </h2>
            </div>
          </section>

          <section className="absolute left-[95px] top-[485px] z-20 w-[1185px]">
            <div className="relative rounded-[28px] border-[2px] border-[#ddb788]/70 bg-[#fff3dd]/28 px-[18px] py-[20px]">
              <button
                type="button"
                onClick={scrollLeftHandler}
                className="absolute left-[-65px] top-[235px] z-30 w-[100px] transition duration-200 hover:scale-110 active:scale-95"
                aria-label="Scroll left"
              >
                <img src={arrowLeft} alt="left" className="w-full" />
              </button>

              <button
                type="button"
                onClick={scrollRightHandler}
                className="absolute right-[-65px] top-[235px] z-30 w-[100px] transition duration-200 hover:scale-110 active:scale-95"
                aria-label="Scroll right"
              >
                <img src={arrowRight} alt="right" className="w-full" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-[14px] overflow-x-auto overflow-y-hidden scroll-smooth pb-[6px]"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {characters.map((character) => (
                  <DesktopCharacterCard
                    key={character.id}
                    character={character}
                    onSelect={chooseCharacter}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
