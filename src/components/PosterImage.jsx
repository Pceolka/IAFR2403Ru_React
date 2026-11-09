import { useState } from 'react';

// Постер сериала; если картинки нет или она не загрузилась — нейтральный placeholder
function PosterImage({ src, alt, className = '' }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`poster poster--placeholder ${className}`} role="img" aria-label={alt}>
        Нет постера
      </div>
    );
  }

  return (
    <img
      className={`poster ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

export default PosterImage;
