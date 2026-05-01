export function SettingsModal({
  musicVolume,
  sfxVolume,
  onMusicChange,
  onSfxChange,
  onClose,
}: {
  musicVolume: number
  sfxVolume: number
  onMusicChange: (value: number) => void
  onSfxChange: (value: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">Settings</p>
          <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b]">Game Settings</h2>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3">
            <span className="font-bold text-[#6b4427]">Music</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onMusicChange(Math.max(0, musicVolume - 10))}
                className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-bold">{musicVolume}%</span>
              <button
                type="button"
                onClick={() => onMusicChange(Math.min(100, musicVolume + 10))}
                className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border-2 border-[#c49a61]/70 bg-[#fff7df]/75 px-4 py-3">
            <span className="font-bold text-[#6b4427]">Sound Effects</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSfxChange(Math.max(0, sfxVolume - 10))}
                className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-bold">{sfxVolume}%</span>
              <button
                type="button"
                onClick={() => onSfxChange(Math.min(100, sfxVolume + 10))}
                className="h-8 w-8 rounded-full border border-[#6b3f25] bg-[#d9bd87] font-bold"
              >
                +
              </button>
            </div>
          </div>
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
