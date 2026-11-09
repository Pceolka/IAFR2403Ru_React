import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import DetailsPage from './pages/DetailsPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import ShowFormPage from './pages/ShowFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/entity/:id" element={<DetailsPage />} />
        <Route path="/create" element={<ShowFormPage />} />
        <Route path="/edit/:id" element={<ShowFormPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
