import '../css/EmptyState.css'

/** Aviso de lista vazia, com uma ação para sair dele quando houver. */
export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && (
        <button type="button" className="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
