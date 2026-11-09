import { Link, NavLink } from 'react-router';
import { useEntitiesContext } from '../context/useEntitiesContext.js';

const navClass = ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`;

function Header() {
  const { favoriteIds, entities } = useEntitiesContext();

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <span className="header__logo" aria-hidden="true">▶</span>
        <div>
          <span className="header__title">Каталог сериалов</span>
          <p className="header__subtitle">Источник данных: TVmaze · в списке: {entities.length}</p>
        </div>
      </Link>

      <nav className="nav" aria-label="Основная навигация">
        <NavLink to="/" end className={navClass}>
          Каталог
        </NavLink>
        <NavLink to="/favorites" className={navClass}>
          <span aria-hidden="true">★</span> Избранное
          <span className="nav__count" aria-label={`отмечено: ${favoriteIds.length}`}>
            {favoriteIds.length}
          </span>
        </NavLink>
        <NavLink to="/create" className="button button--primary nav__create">
          + Добавить сериал
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
