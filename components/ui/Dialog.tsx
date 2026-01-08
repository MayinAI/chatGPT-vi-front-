"use client"
import { ReactNode } from 'react'
import { clsx } from 'clsx'

export function Dialog({ open, onOpenChange, title, children, footer }: {
  open: boolean,
  onOpenChange: (v: boolean) => void,
  title?: string,
  children?: ReactNode,
  footer?: ReactNode,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div className={clsx('relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-neutral-900 dark:border dark:border-neutral-800')}>
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="mb-4">{children}</div>
        {footer}
      </div>
    </div>
  )
}
