import '../css/EmptyState.css'

/** Aviso dentro do visor quando a lista fica vazia, com a ação que resolve. */
export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && (
        <button type="button" className="empty-state__action press" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
