import { Link } from 'react-router';

// Запись с таким ID отсутствует (неверная ссылка, удалена или была локальной до перезагрузки)
function NotFoundMessage({ id }) {
  return (
    <div className="status status--empty" role="status">
      <p className="status__text">Сериал с ID «{id}» не найден</p>
      <p className="status__hint">
        Возможно, он был удалён или добавлен локально до перезагрузки страницы.
      </p>
      <Link to="/" className="button button--secondary">
        Вернуться в каталог
      </Link>
    </div>
  );
}

export default NotFoundMessage;
