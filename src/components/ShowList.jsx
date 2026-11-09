import ShowCard from './ShowCard.jsx';

function ShowList({ shows, isFavorite, onToggleFavorite, onDelete }) {
  return (
    <ul className="show-list">
      {shows.map((show) => (
        <li key={show.id} className="show-list__item">
          <ShowCard
            show={show}
            isFavorite={isFavorite(show.id)}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default ShowList;
