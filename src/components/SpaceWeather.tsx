import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpaceWeather } from '../services/spaceWeatherService';

const SpaceWeather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const data = await getSpaceWeather();
      setWeatherData(data);
    } catch (err) {
      setError('Failed to load space weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading space weather data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      padding: '20px'
    }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <h1>Space Weather</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Solar Activity Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2>Solar Activity</h2>
            <p>Current Activity: {weatherData.solarFlare.activity}</p>
            <p>Flare Intensity: {weatherData.solarFlare.intensity}</p>
            <p>Last Updated: {new Date(weatherData.solarFlare.lastUpdate).toLocaleString()}</p>
          </div>

          {/* Geomagnetic Storm Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2>Geomagnetic Storm</h2>
            <p>Kp Index: {weatherData.geomagneticStorm.kpIndex}</p>
            <p>Storm Strength: {weatherData.geomagneticStorm.strength}</p>
            <p>Storm Probability: {weatherData.geomagneticStorm.probability}</p>
          </div>

          {/* Aurora Forecast Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h2>Aurora Forecast</h2>
            <p>Visibility: {weatherData.auroraForecast.visibility}</p>
            <p>Best Viewing Latitudes: {weatherData.auroraForecast.latitudes}</p>
            <p>Best Viewing Time: {weatherData.auroraForecast.bestTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceWeather; 