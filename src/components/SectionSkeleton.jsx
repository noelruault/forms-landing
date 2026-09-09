import clsx from 'clsx'

// Placeholder shown while a lazily-loaded section's chunk is in flight, sized to roughly the section it replaces so the page does not jump.
export function SectionSkeleton({ dark = false, className }) {
  let bar = dark ? 'bg-white/10' : 'bg-slate-200'
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'flex min-h-[28rem] items-center justify-center py-24',
        dark ? 'bg-slate-950' : 'bg-white',
        className,
      )}
    >
      <div className="w-full max-w-3xl animate-pulse space-y-4 px-6">
        <div className={clsx('mx-auto h-3 w-24 rounded-full', bar)} />
        <div className={clsx('mx-auto h-8 w-2/3 rounded-lg', bar)} />
        <div className={clsx('mx-auto h-4 w-1/2 rounded-md', bar)} />
        <div className={clsx('mt-10 h-64 w-full rounded-2xl', bar)} />
      </div>
    </div>
  )
}
