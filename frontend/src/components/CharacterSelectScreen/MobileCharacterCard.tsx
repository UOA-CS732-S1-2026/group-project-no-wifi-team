import { motion } from 'motion/react'
import { AttributeInfoTip } from './AttributeInfoTip'
import { AttributeRow } from './AttributeRow'
import { Character } from './constants'

export function MobileCharacterCard({
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

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(character)
          }}
          variants={{
            pulse: {
              scale: [1, 1.05, 1],
              transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
            },
            hover: { scale: 1.1 },
          }}
          animate="pulse"
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          className="mt-5 block w-[250px] max-w-full cursor-pointer"
          aria-label={`Select ${character.title}`}
        >
          <img src={character.selectButton} alt="Select" className="w-full object-contain" />
        </motion.button>
      </div>
    </article>
  )
}
