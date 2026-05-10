import { aboutUs as aboutUsImg, signIn as signInImg, startGame as startGameImg } from '../../assets/gamebegin'

export function MainButtons({
  onStart,
  onAbout,
  onSignIn,
}: {
  onStart: () => void
  onAbout: () => void
  onSignIn: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={onStart}
        className="w-[240px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[340px] lg:w-[390px] cursor-pointer"
        aria-label="Start Game"
      >
        <img
          src={startGameImg}
          alt="Start Game"
          className="w-full drop-shadow-[0_10px_12px_rgba(72,41,17,0.32)]"
        />
      </button>

      <div className="mt-4 flex items-center justify-center gap-10 sm:mt-5">
        <button
          type="button"
          onClick={onAbout}
          className="w-[118px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[160px] cursor-pointer"
          aria-label="About Us"
        >
          <img src={aboutUsImg} alt="About Us" className="w-full scale-125 drop-shadow-md sm:scale-140" />
        </button>

        <button
          type="button"
          onClick={onSignIn}
          className="w-[118px] transition duration-200 hover:scale-105 active:scale-95 sm:w-[160px] cursor-pointer"
          aria-label="Sign In"
        >
          <img src={signInImg} alt="Sign In" className="w-full scale-125 drop-shadow-md sm:scale-140" />
        </button>
      </div>
    </div>
  )
}
