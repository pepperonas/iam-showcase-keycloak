import type { ReactNode } from 'react'

interface Props {
  title: string
  /** Erklaerung in Alltagssprache: Was zeigt diese Seite? */
  children: ReactNode
  /** Konkrete Dinge, die man hier ausprobieren kann */
  tryIt?: ReactNode[]
  /** Bedienelemente rechts neben der Ueberschrift */
  actions?: ReactNode
}

export function PageIntro({ title, children, tryIt, actions }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-headline-sm text-on-surface">{title}</h2>
        {actions}
      </div>
      <div className="card-outlined p-5 bg-surface-container-low">
        <div className="text-label-md text-primary-600 mb-1">Was sehe ich hier?</div>
        <div className="text-body-md text-on-surface space-y-2 max-w-3xl">{children}</div>
        {tryIt && tryIt.length > 0 && (
          <div className="mt-4 pt-4 border-t border-outline-variant max-w-3xl">
            <div className="text-label-md text-primary-600 mb-1">Zum Ausprobieren</div>
            <ul className="list-disc pl-5 space-y-1 text-body-md text-on-surface-variant">
              {tryIt.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
