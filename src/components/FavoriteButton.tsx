import React from 'react';
import { api } from '../services/api';

interface FavoriteButtonProps {
  userId: string;
  itemType: 'star' | 'planet';
  itemId: string;
  onFavorite?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ userId, itemType, itemId, onFavorite }) => {
  const handleClick = async () => {
    try {
      await api.addToFavorites(userId, itemType, itemId);
      if (onFavorite) {
        onFavorite();
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        padding: '5px 10px',
        background: '#64ffda',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Add to Favorites
    </button>
  );
};

export default FavoriteButton; 