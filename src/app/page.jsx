import dynamic from 'next/dynamic'

import { Hero } from '@/components/Hero'
import { SectionSkeleton } from '@/components/SectionSkeleton'

// Only the hero ships in the initial bundle. Every section below the fold is its own chunk: its HTML is still pre-rendered for crawlers, but its JavaScript arrives on demand, with a skeleton while in flight.
const PrimaryFeatures = dynamic(
  () => import('@/components/PrimaryFeatures').then((m) => m.PrimaryFeatures),
  { loading: () => <SectionSkeleton dark /> },
)
const SecondaryFeatures = dynamic(
  () => import('@/components/SecondaryFeatures').then((m) => m.SecondaryFeatures),
  { loading: () => <SectionSkeleton /> },
)
const CallToAction = dynamic(
  () => import('@/components/CallToAction').then((m) => m.CallToAction),
  { loading: () => <SectionSkeleton className="min-h-[20rem] bg-blue-600" /> },
)
const Testimonials = dynamic(
  () => import('@/components/Testimonials').then((m) => m.Testimonials),
  { loading: () => <SectionSkeleton /> },
)
const Pricing = dynamic(
  () => import('@/components/Pricing').then((m) => m.Pricing),
  { loading: () => <SectionSkeleton dark className="bg-slate-900" /> },
)
const Faqs = dynamic(() => import('@/components/Faqs').then((m) => m.Faqs), {
  loading: () => <SectionSkeleton />,
})
const Footer = dynamic(() => import('@/components/Footer').then((m) => m.Footer), {
  loading: () => <SectionSkeleton dark className="bg-black" />,
})

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
