import { teamMembers } from './constants'

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
      <div className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6">
        <div className="rounded-[1.5rem] border-2 border-[#c49a61] bg-[#fff7df]/80 px-5 py-5 text-center shadow-inner sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">About Us</p>
          <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b] sm:text-4xl">Team No WiFi</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#8a6446]">
            CS732 Project - International Student Simulator
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member}
              className="break-words rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3 text-sm font-bold text-[#6b4427] shadow-sm"
            >
              {member}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-6 block rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  )
}
