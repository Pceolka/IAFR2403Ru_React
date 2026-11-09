import ShowCard from './ShowCard.jsx';

function ShowList({ shows, favoriteIds, onToggleFavorite, onOpenDetails }) {
  return (
    <ul className="show-list">
      {shows.map((show) => (
        <li key={show.id} className="show-list__item">
          <ShowCard
            show={show}
            isFavorite={favoriteIds.includes(show.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetails={onOpenDetails}
          />
        </li>
      ))}
    </ul>
  );
}

export default ShowList;
