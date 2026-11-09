function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      type="button"
      className={`button ${isFavorite ? 'button--favorite-active' : 'button--favorite'}`}
      aria-pressed={isFavorite}
      onClick={onToggle}
    >
      {isFavorite ? '★ Убрать из избранного' : '☆ В избранное'}
    </button>
  );
}

export default FavoriteButton;
