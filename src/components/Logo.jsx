import Image from 'next/image'

import logo from '@/images/logo.webp'
import logoNav from '@/images/logo-nav.webp'

// variant="nav" swaps in the white monoline mark for dark backgrounds; the default is the full-colour illustration.
export function Logo({ variant, ...props }) {
  let mark = variant === 'nav' ? logoNav : logo
  return (
    <div {...props}>
      {/* Decorative: the wordmark span carries the name for assistive tech. */}
      {/* The nav mark is above the fold on every load, so it skips lazy-loading. */}
      <Image
        src={mark}
        alt=""
        unoptimized
        priority={variant === 'nav'}
        className="h-10 w-auto flex-none"
      />
      <span className="font-display text-xl font-medium tracking-tight">
        Educación a Bordo
      </span>
    </div>
  )
}
