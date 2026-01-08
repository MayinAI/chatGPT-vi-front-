import './globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Providers } from '@/lib/auth/Providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mayin - ChatGPT Visibility for Brands',
  description: 'Measure and improve your brand visibility inside AI chat and AI search',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NWLEMSWNM0"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NWLEMSWNM0');
          `}
        </Script>
        {/* Rewardful affiliate tracking */}
        <Script id="rewardful-init" strategy="beforeInteractive">
          {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
        </Script>
        <Script
          id="rewardful-lib"
          strategy="beforeInteractive"
          async
          src="https://r.wdfl.co/rw.js"
          data-rewardful={process.env.NEXT_PUBLIC_REWARDFUL_KEY}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Mayin",
            "url": "https://mayin.app",
            "logo": "https://mayin.app/assets/logo.png",
            "sameAs": [
              "https://www.linkedin.com/company/mayin",
              "https://twitter.com/mayinapp",
              "https://www.facebook.com/mayin.app"
            ],
            "description": "Mayin helps brands measure and improve their visibility inside AI chat and AI search. We produce ChatGPT visibility reports, actionable improvement plans, and trend tracking for brands worldwide.",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@mayin.app",
                "url": "https://mayin.app/contact"
              }
            ],
            "foundingDate": "2024"
          }) }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
