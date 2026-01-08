import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx(
      'bg-white rounded-lg border border-neutral-200 shadow-sm',
      className
    )}>
      {children}
    </div>
  )
}