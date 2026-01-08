import Link from 'next/link'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function Logo({ href = '/', size = 'md', showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const content = (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      )}
      <span className={`${sizeClasses[size]} font-semibold tracking-tight`}>
        Mayin
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
