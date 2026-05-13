import { Category, CATEGORIES } from './types'
import {
  taskChoiceBg,
  taskStudy, taskStudyChoice,
  taskSocial, taskSocialChoice,
  taskEntertainment, taskEntertainmentChoice,
} from './images'

// Panel: 200×340px. Each tab: 200×68px.
// Images are 2508×627 (4:1). objectFit:cover at 200×68 — no distortion, crops the sides.

const CATEGORY_IMAGES: Record<Exclude<Category, 'Random'>, { normal: string; active: string }> = {
  Study: { normal: taskStudy, active: taskStudyChoice },
  Social: { normal: taskSocial, active: taskSocialChoice },
  Entertainment: { normal: taskEntertainment, active: taskEntertainmentChoice },
}

interface Props {
  active: Category
  onSelect: (cat: Category) => void
}

export function CategoryPanel({ active, onSelect }: Props) {
  return (
    <div
      className="flex shrink-0 flex-col gap-3 pt-4 px-0"
      style={{
        width: '220px',
        height: 'auto',
        marginRight: 20,
        padding: '92px 0 0 18px',
        backgroundImage: `url(${taskChoiceBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {CATEGORIES.filter((cat): cat is Exclude<Category, 'Random'> => cat !== 'Random').map((cat) => {
        const imgs = CATEGORY_IMAGES[cat]
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="shrink-0 active:scale-95"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: isActive ? '200px' : '180px', height: isActive ? '75px' : '68px', transition: 'width 0.3s ease, height 0.3s ease' }}
          >
            <img
              src={isActive ? imgs.active : imgs.normal}
              alt={cat}
              style={{ width: isActive ? '220px' : '200px', height: isActive ? '75px' : '68px', objectFit: 'contain', objectPosition: 'center', display: 'block', transition: 'width 0.3s ease, height 0.3s ease' }}
            />
          </button>
        )
      })}
    </div>
  )
}
