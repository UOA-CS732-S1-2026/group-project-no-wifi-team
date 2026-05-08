import { selectedTasksBg } from '../MonthlyTaskSelection/images'

interface Props {
  image: string
}

export function TaskArtworkPanel({ image }: Props) {
  return (
    <section
      className="relative flex h-full min-h-[400px] items-center justify-center px-8 py-10"
      style={{
        backgroundImage: `url(${selectedTasksBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <img
        src={image}
        alt=""
        className="h-full max-h-[520px] w-auto rounded-[10px] object-contain shadow-[0_10px_18px_rgba(84,56,24,0.18)]"
      />
    </section>
  )
}
