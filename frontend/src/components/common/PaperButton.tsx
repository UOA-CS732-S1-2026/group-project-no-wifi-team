import type { ButtonHTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface PaperButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant
  size?: Size
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'border border-desk-dark bg-btn text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.25)]',
  secondary:
    'border border-desk-dark bg-paper text-desk-dark shadow-[0_2px_6px_rgba(0,0,0,0.18)]',
  ghost:
    'border border-transparent bg-transparent text-desk-dark hover:bg-binding/40',
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'px-5 py-1.5 text-xs sm:text-sm',
  md: 'px-7 py-2.5 text-sm sm:text-base',
  lg: 'px-10 py-3 text-base sm:text-lg',
}

/**
 * Reusable button matching the notebook/paper aesthetic. Wraps motion.button
 * so callers get hover/tap micro-animations for free.
 */
export function PaperButton({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...rest
}: PaperButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      disabled={disabled}
      className={`
        rounded-full font-serif tracking-wide transition-[filter] duration-150
        hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANT_CLASS[variant]}
        ${SIZE_CLASS[size]}
        ${className}
      `}
      {...rest}
    />
  )
}
