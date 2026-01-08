import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Props = HTMLAttributes<HTMLDivElement> & { color?: string }

export function Badge({ className, color = '#000', ...props }: Props) {
  return (
    <div
      className={clsx('inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white', className)}
      style={{ backgroundColor: color }}
      {...props}
    />
  )
}

