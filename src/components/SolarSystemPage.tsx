import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SolarSystem2 from "./SolarSystem2";
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { api } from '../services/api';

interface PlanetDetails {
  description: string;
  gravity: string;
  density: string;
  orbitalSpeed: string;
  composition: string[];
  atmosphere: string;
  surfaceTemp: string;
  dayLength: string;
  funFact: string;
}

const planetInfo: Record<string, PlanetDetails> = {
  Sun: {
    description: "The star at the center of our Solar System, providing light and heat to all planets.",
    gravity: "274 m/s² (28 times Earth's gravity)",
    density: "1.41 g/cm³",
    orbitalSpeed: "0 km/s (center of the system)",
    composition: ["Hydrogen (73%)", "Helium (25%)", "Other elements (2%)"],
    atmosphere: "Multiple layers including photosphere, chromosphere, and corona",
    surfaceTemp: "5,500°C (surface), 15 million°C (core)",
    dayLength: "27 Earth days (rotation at equator)",
    funFact: "The Sun contains 99.86% of all mass in our solar system"
  },
  Mercury: {
    description: "The smallest and fastest planet in our solar system, closest to the Sun.",
    gravity: "3.7 m/s² (0.38 of Earth's gravity)",
    density: "5.43 g/cm³",
    orbitalSpeed: "47.87 km/s",
    composition: ["Iron", "Nickel", "Silicate rocks"],
    atmosphere: "Extremely thin, composed mainly of oxygen, sodium, hydrogen, helium",
    surfaceTemp: "-180°C to 430°C",
    dayLength: "176 Earth days",
    funFact: "Despite being closest to the Sun, Mercury is not the hottest planet - Venus is!"
  },
  Venus: {
    description: "Often called Earth's sister planet due to similar size, but has a toxic atmosphere.",
    gravity: "8.87 m/s² (0.90 of Earth's gravity)",
    density: "5.24 g/cm³",
    orbitalSpeed: "35.02 km/s",
    composition: ["Carbon dioxide", "Nitrogen", "Sulfuric acid clouds"],
    atmosphere: "Very thick, mainly CO2 causing extreme greenhouse effect",
    surfaceTemp: "462°C (hot enough to melt lead)",
    dayLength: "243 Earth days",
    funFact: "Venus rotates backwards compared to most other planets"
  },
  Earth: {
    description: "Our home planet, the only known planet with life in the solar system.",
    gravity: "9.81 m/s²",
    density: "5.51 g/cm³",
    orbitalSpeed: "29.78 km/s",
    composition: ["Nitrogen", "Oxygen", "Iron core", "Silicate rocks"],
    atmosphere: "78% nitrogen, 21% oxygen, 1% other gases",
    surfaceTemp: "-88°C to 58°C",
    dayLength: "24 hours",
    funFact: "Earth is the only planet not named after a god or goddess"
  },
  Mars: {
    description: "The Red Planet, featuring huge volcanoes and deep valleys.",
    gravity: "3.71 m/s² (0.38 of Earth's gravity)",
    density: "3.93 g/cm³",
    orbitalSpeed: "24.07 km/s",
    composition: ["Iron", "Nickel", "Sulfur", "Iron oxide (rust)"],
    atmosphere: "Thin, mainly CO2",
    surfaceTemp: "-140°C to 20°C",
    dayLength: "24 hours 37 minutes",
    funFact: "Mars has the largest volcano in the solar system - Olympus Mons"
  },
  Jupiter: {
    description: "The largest planet in our solar system, with a Great Red Spot storm.",
    gravity: "24.79 m/s² (2.4 times Earth's gravity)",
    density: "1.33 g/cm³",
    orbitalSpeed: "13.07 km/s",
    composition: ["Hydrogen", "Helium", "Methane", "Ammonia"],
    atmosphere: "Thick, mainly hydrogen and helium",
    surfaceTemp: "-110°C (cloud top)",
    dayLength: "10 hours",
    funFact: "The Great Red Spot has been storming for at least 400 years"
  },
  Saturn: {
    description: "Famous for its beautiful rings made of ice and rock.",
    gravity: "10.44 m/s² (1.07 times Earth's gravity)",
    density: "0.69 g/cm³",
    orbitalSpeed: "9.68 km/s",
    composition: ["Hydrogen", "Helium", "Ice", "Rocky core"],
    atmosphere: "Mainly hydrogen and helium",
    surfaceTemp: "-178°C",
    dayLength: "10.7 hours",
    funFact: "Saturn is the only planet that could float in water (if you had a big enough bathtub)"
  },
  Uranus: {
    description: "An ice giant that rotates on its side.",
    gravity: "8.69 m/s² (0.89 of Earth's gravity)",
    density: "1.27 g/cm³",
    orbitalSpeed: "6.80 km/s",
    composition: ["Hydrogen", "Helium", "Methane", "Ice"],
    atmosphere: "Hydrogen, helium, methane (gives blue color)",
    surfaceTemp: "-224°C",
    dayLength: "17 hours",
    funFact: "Uranus rotates almost perpendicular to its orbital plane"
  },
  Neptune: {
    description: "The windiest planet, with speeds up to 1,200 mph.",
    gravity: "11.15 m/s² (1.14 times Earth's gravity)",
    density: "1.64 g/cm³",
    orbitalSpeed: "5.43 km/s",
    composition: ["Hydrogen", "Helium", "Methane", "Ice"],
    atmosphere: "Hydrogen, helium, methane",
    surfaceTemp: "-214°C",
    dayLength: "16 hours",
    funFact: "Neptune has the strongest winds in the solar system"
  },
};

interface FavoritePopupProps {
  planetName: string;
  planetData: PlanetDetails;
  onClose: () => void;
  onAddToFavorites: () => void;
}

const FavoritePopup: React.FC<FavoritePopupProps> = ({ 
  planetName, 
  planetData, 
  onClose, 
  onAddToFavorites 
}) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    border: '1px solid rgba(100, 255, 218, 0.3)',
    color: 'white',
    zIndex: 1000,
    width: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 0 20px rgba(100, 255, 218, 0.2)'
  }}>
    <h2 style={{ color: '#64ffda', marginBottom: '15px' }}>{planetName}</h2>
    
    <div style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>{planetData.description}</p>
      
      <h3 style={{ color: '#64ffda', marginBottom: '10px', marginTop: '20px' }}>Physical Characteristics</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '8px' }}><strong>Gravity:</strong> {planetData.gravity}</li>
        <li style={{ marginBottom: '8px' }}><strong>Density:</strong> {planetData.density}</li>
        <li style={{ marginBottom: '8px' }}><strong>Orbital Speed:</strong> {planetData.orbitalSpeed}</li>
        <li style={{ marginBottom: '8px' }}><strong>Day Length:</strong> {planetData.dayLength}</li>
      </ul>

      <h3 style={{ color: '#64ffda', marginBottom: '10px', marginTop: '20px' }}>Composition</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {planetData.composition.map((element, index) => (
          <li key={index} style={{ marginBottom: '4px' }}>• {element}</li>
        ))}
      </ul>

      <h3 style={{ color: '#64ffda', marginBottom: '10px', marginTop: '20px' }}>Environment</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '8px' }}><strong>Atmosphere:</strong> {planetData.atmosphere}</li>
        <li style={{ marginBottom: '8px' }}><strong>Surface Temperature:</strong> {planetData.surfaceTemp}</li>
      </ul>

      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(100, 255, 218, 0.1)', borderRadius: '8px' }}>
        <strong style={{ color: '#64ffda' }}>Fun Fact:</strong> {planetData.funFact}
      </div>
    </div>

    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        style={{
          padding: '8px 15px',
          background: 'transparent',
          border: '1px solid #64ffda',
          color: '#64ffda',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
      <button
        onClick={onAddToFavorites}
        style={{
          padding: '8px 15px',
          background: '#64ffda',
          border: 'none',
          color: '#0a192f',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add to Favorites
      </button>
    </div>
  </div>
);

// Update the SunPopup component
const SunPopup: React.FC<{ 
  planetData: PlanetDetails;
  onClose: () => void;
  onAddToFavorites: () => void;
}> = ({ planetData, onClose, onAddToFavorites }) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    color: 'white',
    zIndex: 1000,
    width: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 0 20px rgba(255, 165, 0, 0.2)'
  }}>
    <h2 style={{ color: '#FDB813', marginBottom: '15px' }}>The Sun</h2>
    
    <div style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>{planetData.description}</p>
      
      <h3 style={{ color: '#FDB813', marginBottom: '10px', marginTop: '20px' }}>Physical Characteristics</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '8px' }}><strong>Gravity:</strong> {planetData.gravity}</li>
        <li style={{ marginBottom: '8px' }}><strong>Density:</strong> {planetData.density}</li>
        <li style={{ marginBottom: '8px' }}><strong>Surface Temperature:</strong> {planetData.surfaceTemp}</li>
        <li style={{ marginBottom: '8px' }}><strong>Rotation Period:</strong> {planetData.dayLength}</li>
      </ul>

      <h3 style={{ color: '#FDB813', marginBottom: '10px', marginTop: '20px' }}>Composition</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {planetData.composition.map((element, index) => (
          <li key={index} style={{ marginBottom: '4px' }}>• {element}</li>
        ))}
      </ul>

      <h3 style={{ color: '#FDB813', marginBottom: '10px', marginTop: '20px' }}>Atmosphere</h3>
      <p>{planetData.atmosphere}</p>

      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px' }}>
        <strong style={{ color: '#FDB813' }}>Fun Fact:</strong> {planetData.funFact}
      </div>
    </div>

    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        style={{
          padding: '8px 15px',
          background: 'transparent',
          border: '1px solid #FDB813',
          color: '#FDB813',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
      <button
        onClick={onAddToFavorites}
        style={{
          padding: '8px 15px',
          background: '#FDB813',
          border: 'none',
          color: '#000000',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add to Favorites
      </button>
    </div>
  </div>
);

const SolarSystemPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const { user, token } = useAuth();

  const handleAddToFavorites = async () => {
    if (!selectedPlanet || !user || !token) {
      alert('Please login to add favorites');
      return;
    }

    try {
      await api.addToFavorites(token, 'planet', {
        id: selectedPlanet.toLowerCase(),
        name: selectedPlanet,
        description: planetInfo[selectedPlanet].description
      });
      alert(`${selectedPlanet} added to favorites!`);
      setShowFavoritePopup(false);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  const handlePlanetClick = (planetName: string) => {
    setSelectedPlanet(planetName);
    setShowFavoritePopup(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", position: "relative" }}>
      <Navigation />

      {/* Back Button */}
      <button
        onClick={() => navigate("/stars")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 15px",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        ⬅ Back to Stars
      </button>

      {/* 3D Solar System */}
      <Canvas camera={{ position: [0, 15, 100], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={5} distance={300} />
        <Stars radius={200} depth={50} count={5000} factor={4} />
        <SolarSystem2 setSelectedPlanet={handlePlanetClick} />
      </Canvas>

      {/* Favorite Popup for Planets */}
      {showFavoritePopup && selectedPlanet && selectedPlanet !== "Sun" && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999
          }} onClick={() => setShowFavoritePopup(false)} />
          <FavoritePopup
            planetName={selectedPlanet}
            planetData={planetInfo[selectedPlanet]}
            onClose={() => setShowFavoritePopup(false)}
            onAddToFavorites={handleAddToFavorites}
          />
        </>
      )}

      {/* Sun Info Popup */}
      {showFavoritePopup && selectedPlanet === "Sun" && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999
          }} onClick={() => setShowFavoritePopup(false)} />
          <SunPopup
            planetData={planetInfo.Sun}
            onClose={() => setShowFavoritePopup(false)}
            onAddToFavorites={handleAddToFavorites}
          />
        </>
      )}
    </div>
  );
};

export default SolarSystemPage;
