import type { ReactNode } from 'react'

import { endingBg } from '../../assets/EndingCollection'

type StatusStateViewProps = {
  title: string
  description: string
  extra?: ReactNode
}

export function StatusStateView({ title, description, extra }: StatusStateViewProps) {
  return (
    <main className="min-h-dvh w-full overflow-auto bg-[#4b2f1e] font-serif text-[#5a3218]">
      <div
        className="min-h-dvh bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${endingBg})` }}
      >
        <div className="flex min-h-dvh items-center justify-center">
          <div className="max-w-[520px] rounded-[22px] border-[3px] border-[#cfa472] bg-[#fff2d4]/90 px-10 py-7 text-center shadow-[0_12px_25px_rgba(70,35,12,0.25)]">
            <p className="text-[24px] font-bold">{title}</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#7a5030]">{description}</p>
            {extra}
          </div>
        </div>
      </div>
    </main>
  )
}
