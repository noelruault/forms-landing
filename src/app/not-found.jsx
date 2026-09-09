import Link from 'next/link'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'

export default function NotFound() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Inicio">
          <Logo className="flex h-10 items-center gap-2" />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Página no encontrada
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        No hemos encontrado la página que buscas.
      </p>
      <Button href="/" className="mt-10">
        Volver al inicio
      </Button>
    </SlimLayout>
  )
}
