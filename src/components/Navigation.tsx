import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="nav-bar" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        padding: '10px',
        borderRadius: '15px',
        width: 'fit-content', // Only as wide as the buttons
      }}>
        {user ? (
          <>
            <button 
              onClick={() => navigate('/stars')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Stars
            </button>
            <button 
              onClick={() => navigate('/solar-system')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Solar System
            </button>
            <button 
              onClick={() => navigate('/habitable-planets')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Habitable Planets
            </button>
            <button 
              onClick={() => navigate('/favorites')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              My Favorites
            </button>
            <button 
              onClick={() => navigate('/news')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Space News
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Space Quiz
            </button>
            <button 
              onClick={() => navigate('/sky-map')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Night Sky Map
            </button>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button 
              onClick={() => navigate('/news')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Space News
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Space Quiz
            </button>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '8px 12px',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation; 