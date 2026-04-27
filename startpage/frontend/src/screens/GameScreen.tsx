import backgroundImg from '../assets/background.jpg'

export function GameScreen() {
  return (
    <div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      {/* Content — vertically centered, responsive spacing */}
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-10 sm:gap-7 sm:px-10 sm:py-12">
        <h1 className="font-serif text-2xl font-bold text-desk-dark sm:text-3xl">
          Game Content
        </h1>
        <p className="font-serif text-sm text-desk-dark sm:text-base">
          更多游戏内容即将推出...
        </p>
      </div>
    </div>
  )
}
