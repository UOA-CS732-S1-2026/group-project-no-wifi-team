import { useEffect } from 'react'

export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const img = new Image()
    img.src = url
  })
}

export function usePreloadImages(urls: string[]) {
  useEffect(() => {
    preloadImages(urls)
  }, [])
}
