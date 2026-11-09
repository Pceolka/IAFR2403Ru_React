function Header({ favoritesCount, totalCount, canCreate, onCreate }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">▶</span>
        <div>
          <h1 className="header__title">Каталог сериалов</h1>
          <p className="header__subtitle">Источник данных: TVmaze · в списке: {totalCount}</p>
        </div>
      </div>

      <div className="header__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={onCreate}
          disabled={!canCreate}
        >
          + Добавить сериал
        </button>
        <div className="header__favorites" aria-live="polite">
          <span aria-hidden="true">★</span> Избранное: <strong>{favoritesCount}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
