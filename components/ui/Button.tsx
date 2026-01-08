import { ReactNode, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg',
        {
          'px-4 py-2.5 text-sm': size === 'md',
          'px-3 py-2 text-sm': size === 'sm',
          'px-6 py-3.5 text-base': size === 'lg',
        },
        {
          'bg-white text-black hover:bg-neutral-200 focus:ring-white shadow-lg hover:shadow-xl': variant === 'primary',
          'bg-neutral-800 text-white hover:bg-neutral-700 focus:ring-neutral-600 border border-neutral-700': variant === 'secondary',
          'bg-transparent text-white hover:bg-white/10 focus:ring-white/20 border border-neutral-700 hover:border-neutral-600': variant === 'outline',
          'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 focus:ring-white/10': variant === 'ghost',
        },
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}