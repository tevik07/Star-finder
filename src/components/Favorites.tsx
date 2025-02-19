import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import Navigation from './Navigation';

interface FavoriteItem {
  id: string;
  name: string;
  description: string;
}

interface FavoritesData {
  stars: FavoriteItem[];
  planets: FavoriteItem[];
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState<FavoritesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await api.getFavorites(token);
        setFavorites(response.favorites);
      } catch (err) {
        setError('Failed to fetch favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  if (!user) {
    navigate('/');
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000000',
      color: 'white',
      padding: '20px'
    }}>
      <Navigation />
      
      <div style={{
        maxWidth: '800px',
        margin: '60px auto',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px'
      }}>
        <h1 style={{ color: '#64ffda', marginBottom: '30px' }}>My Favorites</h1>
        
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

        {favorites && (
          <>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#64ffda', marginBottom: '20px' }}>Favorite Stars</h2>
              {favorites.stars.length === 0 ? (
                <p>No favorite stars yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {favorites.stars.map(star => (
                    <div 
                      key={star.id}
                      style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(100, 255, 218, 0.2)'
                      }}
                    >
                      <h3 style={{ color: '#64ffda', marginBottom: '10px' }}>{star.name}</h3>
                      <p>{star.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 style={{ color: '#64ffda', marginBottom: '20px' }}>Favorite Planets</h2>
              {favorites.planets.length === 0 ? (
                <p>No favorite planets yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {favorites.planets.map(planet => (
                    <div 
                      key={planet.id}
                      style={{
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(100, 255, 218, 0.2)'
                      }}
                    >
                      <h3 style={{ color: '#64ffda', marginBottom: '10px' }}>{planet.name}</h3>
                      <p>{planet.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites; 