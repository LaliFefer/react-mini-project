import { h } from 'preact'

// variant: 'success' | 'warning' | 'info'
export default function StatusCard({ title, value, hint, variant = 'info', onClick }) {
  const colorClass = variant === 'success' ? 'border-success' : variant === 'warning' ? 'border-warning' : 'border-0'
  const icon = variant === 'success' ? 'bi-check-circle-fill' : variant === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle'

  return (
    <div class={`card text-center status-card-hover ${colorClass}`} role="button" onClick={onClick}>
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
          <i class={`bi ${icon} fs-4 text-${variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : 'primary'}`}></i>
          <h5 class="card-title mb-0">{title}</h5>
        </div>
        <p class="display-6 mb-1">{value}</p>
        {hint && <p class="text-muted small">{hint}</p>}
      </div>
    </div>
  )
}
