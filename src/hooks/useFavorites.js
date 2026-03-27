import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('awaremove_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('awaremove_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (courseId, categoryId, title) => {
    setFavorites(prev => {
      const isFav = prev.find(f => f.id === courseId);
      if (isFav) {
        return prev.filter(f => f.id !== courseId);
      } else {
        return [...prev, { id: courseId, categoryId, title }];
      }
    });
  };

  const isFavorite = (courseId) => {
    return favorites.some(f => f.id === courseId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
