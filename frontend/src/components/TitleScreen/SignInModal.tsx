export function SignInModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e]">Sign In</p>
        <h2 className="mt-2 text-3xl font-bold text-[#7a4b2b]">Coming Soon</h2>
        <p className="mt-3 text-sm text-[#8a6446]">
          Account login will be connected to MongoDB later.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#7a4b2b] active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  )
}
