import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'

const title = 'Educación a Bordo - Domina tu titulación náutica'
const description =
  'Prepárate para tu examen de titulación náutica: elige tus temas, practica con simulacros cronometrados y sigue tu progreso, a tu ritmo.'

export const metadata = {
  // Absolute base so og:image and og:url resolve to the public site; WhatsApp ignores relative URLs.
  metadataBase: new URL('https://educacionabordo.com'),
  title: {
    template: '%s - Educación a Bordo',
    default: title,
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'Educación a Bordo',
    title,
    description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Educación a Bordo, tu titulación náutica a tu ritmo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  },
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="min-h-full">
        {/* The whole page sits in one shell so the mobile menu can scale it back behind the sheet; the sheet itself portals to body, outside the transform. */}
        <div id="page" className="page-shell flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
