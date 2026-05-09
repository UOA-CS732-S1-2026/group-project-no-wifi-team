import { createContext, useContext, useEffect, useRef, useState } from 'react'
import bgm from '../assets/sound/bgm.mp3'
import clickSfx from '../assets/sound/click.wav'
import taskSelectedSfx from '../assets/sound/task_seleted.wav'
import makeChoiceSfx from '../assets/sound/make_choice.wav'
import coinSfx from '../assets/sound/coin_sound.mp3'

const SFX_MAP: Record<string, string> = {
  'task-select': taskSelectedSfx,
  'make-choice': makeChoiceSfx,
  'coin': coinSfx,
}

export { coinSfx }

interface MusicContextValue {
  musicEnabled: boolean
  setMusicEnabled: (enabled: boolean) => void
  sfxEnabled: boolean
  setSfxEnabled: (enabled: boolean) => void
}

const MusicContext = createContext<MusicContextValue>({
  musicEnabled: true,
  setMusicEnabled: () => {},
  sfxEnabled: true,
  setSfxEnabled: () => {},
})

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasInteracted = useRef(false)
  const musicEnabledRef = useRef(musicEnabled)
  const sfxEnabledRef = useRef(sfxEnabled)

  useEffect(() => {
    musicEnabledRef.current = musicEnabled
  }, [musicEnabled])

  useEffect(() => {
    sfxEnabledRef.current = sfxEnabled
  }, [sfxEnabled])

  // BGM setup — starts after first user interaction (browser autoplay policy)
  useEffect(() => {
    const audio = new Audio(bgm)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    const startOnInteraction = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true
        if (musicEnabledRef.current) {
          audio.play().catch(() => {})
        }
      }
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
    }

    document.addEventListener('click', startOnInteraction)
    document.addEventListener('keydown', startOnInteraction)

    return () => {
      audio.pause()
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
    }
  }, [])

  // BGM play/pause when toggle changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasInteracted.current) return
    if (musicEnabled) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [musicEnabled])

  // Global click SFX — event delegation on document captures all buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!sfxEnabledRef.current) return
      const target = e.target as HTMLElement
      const btn = target.closest('button')
      if (!btn) return
      const sfxKey = btn.dataset.sfx
      const src = sfxKey ? (SFX_MAP[sfxKey] ?? clickSfx) : clickSfx
      const sfx = new Audio(src)
      sfx.volume = 0.6
      sfx.play().catch(() => {})
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <MusicContext.Provider value={{ musicEnabled, setMusicEnabled, sfxEnabled, setSfxEnabled }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusicContext() {
  return useContext(MusicContext)
}