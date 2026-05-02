import { endingCardFrame, endingCardLockedFrame } from '../../assets/EndingCollection'
import type { BackendEndingItem } from './types'

type EndingCardProps = {
  ending: BackendEndingItem
}

export function EndingCard({ ending }: EndingCardProps) {
  const isUnlocked = ending.status === 'Unlocked'
  const frameImage = isUnlocked ? endingCardFrame : endingCardLockedFrame

  return (
    <article className="relative h-[305px] w-[295px] shrink-0 transition duration-200 hover:-translate-y-1 hover:scale-[1.02]">
      <img
        src={frameImage}
        alt=""
        className="absolute inset-0 h-full w-full object-fill drop-shadow-[0_8px_12px_rgba(83,45,18,0.22)]"
      />

      <div
        className={`absolute left-[19px] top-[7px] z-20 flex h-[50px] w-[36px] items-center justify-center rounded-b-[9px] border border-[#7a4b2b] text-[18px] shadow-md ${
          isUnlocked ? 'bg-[#78944a] text-[#fff5d4]' : 'bg-[#9a6b3a] text-[#fff5d4]'
        }`}
      >
        {isUnlocked ? '★' : '🔒'}
      </div>

      <div className="absolute left-[43px] top-[33px] h-[156px] w-[206px] overflow-hidden rounded-[10px] border border-[#d6b27c] bg-[#f5e2bd]">
        <div
          className={`flex h-full w-full items-center justify-center px-3 text-center text-[13px] font-bold leading-[1.3] ${
            isUnlocked ? 'bg-[#f7e8c7] text-[#8a5a32]' : 'bg-[#8b8071]/45 text-[#4f4439]'
          }`}
        >
          {isUnlocked ? 'Put Ending Image Here' : 'Locked Ending Image'}
        </div>
      </div>

      <h3 className="absolute left-[50px] top-[190px] flex h-[60px] w-[188px] items-center justify-center text-center text-[15px] font-bold leading-[1.05] text-[#5a3218]">
        {ending.title}
      </h3>

      <div
        className={`absolute bottom-[1px] left-[70px] flex h-[100px] w-[155px] items-center justify-center text-[14px] font-bold ${
          isUnlocked ? 'text-[#526b37]' : 'text-[#6b4427]'
        }`}
      >
        {ending.status}
      </div>
    </article>
  )
}
