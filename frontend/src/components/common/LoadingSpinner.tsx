export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <svg className="md3-spinner" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" fill="none" strokeWidth="4" />
      </svg>
    </div>
  )
}
