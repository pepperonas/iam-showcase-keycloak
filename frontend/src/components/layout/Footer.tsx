import { GitHubLink } from '../common/GitHubLink'

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant px-6 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-body-sm text-on-surface-variant">
      <span>
        (c) 2026 Martin Pfeffer |{' '}
        <a href="https://celox.io" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
          celox.io
        </a>
      </span>
      <GitHubLink className="text-primary-500 hover:underline" />
    </footer>
  )
}
