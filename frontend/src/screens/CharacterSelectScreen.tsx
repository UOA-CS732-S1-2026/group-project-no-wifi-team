import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

import { arrowLeft, arrowRight, backHomeBtn, characterBg, heroLeft, heroPlane, heroRight } from '../assets/CharacterSelect'
import { characters, DESIGN_HEIGHT, DESIGN_WIDTH, Character } from '../components/CharacterSelectScreen/constants'
import { DesktopCharacterCard } from '../components/CharacterSelectScreen/DesktopCharacterCard'
import { useIsMobile, useResponsiveStageScale } from '../components/CharacterSelectScreen/hooks'
import { MobileCharacterCard } from '../components/CharacterSelectScreen/MobileCharacterCard'
import { selectCharacter } from '../slices/gameSlice'
import type { AppDispatch } from '../store'

export function CharacterSelectScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const stageScale = useResponsiveStageScale()
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    // 如果当前点击的角色已经是选中状态，则执行确认跳转
    if (selectedId === character.id) {
      localStorage.setItem('selectedCharacter', JSON.stringify(character))
      dispatch(selectCharacter(character))
      navigate('/monthly-task-selection')
    } else {
      // 否则仅将其设为选中（高亮）
      setSelectedId(character.id)
    }
  }

  // 定义列表容器的动画变体，用于交错显示子元素
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 1.2 },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  if (isMobile) {
    return (
      <main
        className="min-h-screen w-full overflow-y-auto bg-cover bg-center px-4 py-5 font-serif text-[#5a3218]"
        style={{ backgroundImage: `url(${characterBg})` }}
      >
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate('/')}
          className="mb-5 w-[165px] transition duration-200 active:scale-95 cursor-pointer"
          aria-label="Back to Home"
        >
          <img src={backHomeBtn} alt="Back to Home" className="w-full" />
        </motion.button>

        <motion.section
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[24px] border-[3px] border-[#cfa472] bg-[#fff2d9]/90 px-4 py-6 text-center shadow-[0_10px_18px_rgba(83,50,24,0.12)]"
        >
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
        </motion.section>

        <section className="mt-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="text-[30px] leading-none text-[#b5804e]">▌</span>

            <h2 className="text-[20px] font-bold tracking-[0.13em] text-[#724624]">
              CHARACTER LIST
            </h2>
          </motion.div>

          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 pb-12 px-2 py-4" // 增加内边距防止移动端裁剪
          >
            {characters.map((character) => (
            <motion.div
              key={character.id}
              variants={listItemVariants}
              onClick={() => setSelectedId(character.id)}
              className="cursor-pointer"
              whileHover={!selectedId ? { scale: 1.02, x: 5 } : {}}
              whileTap={!selectedId ? { scale: 0.98 } : {}}
              animate={
                selectedId === character.id
                  ? { scale: 1.05, filter: 'brightness(1.1)', opacity: 1, x: 0 }
                  : undefined
              }
            >
                <MobileCharacterCard
                  character={character}
                  onSelect={chooseCharacter}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    )
  }

  return (
    <main
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center font-serif"
      style={{ backgroundImage: `url(${characterBg})` }}
    >
      <div
        className="relative"
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
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => navigate('/')}
            className="absolute left-[82px] top-[48px] z-30 w-[215px] transition duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Back to Home"
          >
            <img src={backHomeBtn} alt="Back to Home" className="w-full" />
          </motion.button>

          <motion.section
            initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute left-[120px] top-[120px] z-20 h-[275px] w-[1125px] rounded-[28px] border-[3px] border-[#cfa472] bg-[#fff2d9]/88 shadow-[0_10px_18px_rgba(83,50,24,0.12)]"
          >
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
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute left-[105px] top-[440px] z-20 flex w-[1070px] items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-[36px] leading-none text-[#b5804e]">▌</span>

              <h2 className="text-[24px] font-bold tracking-[0.16em] text-[#724624]">
                CHARACTER LIST
              </h2>
            </div>
          </motion.section>

          <section className="absolute left-[95px] top-[485px] z-20 w-[1150px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="relative rounded-[28px] border-[2px] border-[#ddb788]/70 bg-[#fff3dd]/28 px-[18px] py-[20px]"
            >
              <button
                type="button"
                onClick={scrollLeftHandler}
                className="absolute left-[-65px] top-[235px] z-30 w-[100px] transition duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <img src={arrowLeft} alt="left" className="w-full" />
              </button>

              <button
                type="button"
                onClick={scrollRightHandler}
                className="absolute right-[-65px] top-[235px] z-30 w-[100px] transition duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <img src={arrowRight} alt="right" className="w-full" />
              </button>

              <motion.div
                ref={scrollRef}
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex gap-6 overflow-x-auto scroll-smooth py-12 px-4 -my-8" 
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {characters.map((character) => (
                  <motion.div
                    key={character.id}
                    variants={listItemVariants}
                    className="shrink-0 cursor-pointer"
                    whileHover={!selectedId ? { scale: 1.05, y: -10 } : {}}
                    whileTap={!selectedId ? { scale: 0.95 } : {}}
                    onClick={() => setSelectedId(character.id)}
                    animate={
                      selectedId === character.id
                        ? {
                            scale: 1.1,
                            filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(255,223,128,0.4))',
                            zIndex: 50,
                            opacity: 1,
                            x: 0,
                          }
                        : undefined
                    }
                  >
                    <DesktopCharacterCard
                      character={character}
                      onSelect={chooseCharacter}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  )
}
