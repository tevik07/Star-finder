import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackgroundScene from './BackgroundScene';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      setShowLogin(false);
      navigate('/stars');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(signupData.username, signupData.email, signupData.password);
      setShowSignup(false);
      navigate('/stars');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <BackgroundScene />

      {/* Main content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '4em',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #64ffda, #88ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(100, 255, 218, 0.3)'
        }}>
          Star Finder
        </h1>
        
        <p style={{
          fontSize: '1.5em',
          marginBottom: '40px',
          color: '#8892b0'
        }}>
          Explore the cosmos in an interactive 3D environment
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: '12px 24px',
              fontSize: '1.1em',
              background: 'rgba(100, 255, 218, 0.1)',
              border: '2px solid #64ffda',
              color: '#64ffda',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(100, 255, 218, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(100, 255, 218, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Login
          </button>

          <button
            onClick={() => setShowSignup(true)}
            style={{
              padding: '12px 24px',
              fontSize: '1.1em',
              background: '#64ffda',
              border: 'none',
              color: '#0a192f',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={() => navigate('/stars')}
          style={{
            padding: '12px 24px',
            fontSize: '1.1em',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ccd6f6',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Continue as Guest
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                required
              />
              <div className="button-group">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={e => setSignupData({...signupData, username: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={e => setSignupData({...signupData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={e => setSignupData({...signupData, password: e.target.value})}
                required
              />
              <div className="button-group">
                <button type="submit">Sign Up</button>
                <button type="button" onClick={() => setShowSignup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 