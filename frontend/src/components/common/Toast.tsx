import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ToastEvent {
  message: string
}

let toastId = 0
const listeners = new Set<(e: ToastEvent & { id: number }) => void>()

export function showToast(message: string) {
  const id = ++toastId
  listeners.forEach((fn) => fn({ message, id }))
}

export function ToastContainer() {
  const [toast, setToast] = useState<(ToastEvent & { id: number }) | null>(null)

  const handleToast = useCallback((e: ToastEvent & { id: number }) => {
    setToast(e)
  }, [])

  useEffect(() => {
    listeners.add(handleToast)
    return () => { listeners.delete(handleToast) }
  }, [handleToast])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] rounded-lg bg-desk-dark px-6 py-3 shadow-xl"
        >
          <p className="font-serif text-sm font-bold text-btn-text">
            {toast.message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
