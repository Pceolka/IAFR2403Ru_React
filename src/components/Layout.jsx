import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header.jsx';

// Общая шапка с навигацией + содержимое текущей страницы
function Layout() {
  const { pathname } = useLocation();

  // при переходе на другую страницу — прокрутка в начало
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
