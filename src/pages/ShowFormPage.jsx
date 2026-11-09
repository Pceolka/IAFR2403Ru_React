import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useEntitiesContext } from '../context/useEntitiesContext.js';
import DataGate from '../components/DataGate.jsx';
import NotFoundMessage from '../components/NotFoundMessage.jsx';
import ShowForm from '../components/ShowForm.jsx';
import { getGenreOptions } from '../logic/showFilters.js';

// /create — новая запись, /edit/:id — редактирование
function ShowFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const { entities, getById, addEntity, updateEntity } = useEntitiesContext();
  const genreOptions = useMemo(() => getGenreOptions(entities), [entities]);
  const show = isEdit ? getById(id) : null;

  function handleSubmit(showData) {
    if (isEdit) {
      updateEntity(show.id, showData);
      navigate(`/entity/${show.id}`);
    } else {
      const created = addEntity(showData);
      navigate(`/entity/${created.id}`);
    }
  }

  function handleCancel() {
    navigate(isEdit ? `/entity/${show.id}` : '/');
  }

  return (
    <DataGate>
      {isEdit && !show ? (
        <NotFoundMessage id={id} />
      ) : (
        <section className="form-page">
          <Link to={isEdit ? `/entity/${show.id}` : '/'} className="back-link">
            ← Назад
          </Link>
          {/* key: при переходе с /edit/1 на /edit/2 форма создаётся заново с новыми данными */}
          <ShowForm
            key={isEdit ? show.id : 'create'}
            initialShow={show}
            genreOptions={genreOptions}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </section>
      )}
    </DataGate>
  );
}

export default ShowFormPage;
