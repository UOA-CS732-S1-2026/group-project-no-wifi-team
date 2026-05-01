import { Category, CATEGORIES } from './types'

interface Props {
  active: Category
  onSelect: (cat: Category) => void
}

export function CategoryPanel({ active, onSelect }: Props) {
  return (
    <div
      className="flex w-28 shrink-0 flex-col items-stretch gap-3 p-3 sm:w-36"
      style={{ borderRight: '1px solid rgba(160,120,60,0.35)' }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={[
            'rounded border py-3 font-serif text-sm font-semibold transition-all duration-150 active:scale-95',
            active === cat
              ? 'border-desk-dark bg-desk-dark text-btn-text shadow-inner'
              : 'border-desk-light bg-binding/70 text-desk-dark hover:bg-binding',
          ].join(' ')}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
