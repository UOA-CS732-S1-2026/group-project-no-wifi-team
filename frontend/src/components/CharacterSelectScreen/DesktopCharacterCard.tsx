import { AttributeInfoTip } from './AttributeInfoTip'
import { AttributeRow } from './AttributeRow'
import { Character } from './constants'

export function DesktopCharacterCard({
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
