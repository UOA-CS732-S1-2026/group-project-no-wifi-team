import { useState } from 'react'

export function AttributeInfoTip({ mobile = false }: { mobile?: boolean }) {
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
