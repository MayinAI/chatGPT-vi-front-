import { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full px-4 py-2.5 rounded-lg transition-colors',
        'bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500',
        'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600',
        'hover:border-neutral-700',
        'disabled:bg-neutral-900/50 disabled:text-neutral-600 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}