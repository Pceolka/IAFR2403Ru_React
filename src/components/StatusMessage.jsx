// Сообщение о состоянии: загрузка, ошибка, пустой результат
function StatusMessage({ type, text, actionLabel, onAction }) {
  return (
    <div
      className={`status status--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {type === 'loading' && <span className="status__spinner" aria-hidden="true" />}
      <p className="status__text">{text}</p>
      {actionLabel && onAction && (
        <button type="button" className="button button--secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StatusMessage;
