import { Link, useLocation } from 'react-router';

function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="status status--empty not-found" role="status">
      <p className="not-found__code">404</p>
      <p className="status__text">Страница не найдена</p>
      <p className="status__hint">
        Адреса <code>{pathname}</code> в приложении нет.
      </p>
      <Link to="/" className="button button--secondary">
        На главную
      </Link>
    </div>
  );
}

export default NotFoundPage;
