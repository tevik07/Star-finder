import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import { celestialToCartesian, majorStars, constellationLines, calculatePlanetPositions } from '../services/astronomyService';

interface SkyObjectProps {
  position: THREE.Vector3;
  name: string;
  magnitude: number;
  selected: boolean;
  onClick: () => void;
}

const SkyObject: React.FC<SkyObjectProps> = ({ position, name, magnitude, selected, onClick }) => {
  const size = Math.max(0.5, (6 - magnitude) / 2);
  
  return (
    <group>
      <mesh position={position} onClick={onClick}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={selected ? '#64ffda' : 'white'} 
          emissive={selected ? '#64ffda' : 'white'}
          emissiveIntensity={0.5}
        />
      </mesh>
      {selected && (
        <ConstellationLines starName={name} />
      )}
    </group>
  );
};

const ConstellationLines: React.FC<{ starName: string }> = ({ starName }) => {
  const points = constellationLines.flatMap(constellation => 
    constellation.lines.map(line => {
      const start = celestialToCartesian(line[0][0], line[0][1]);
      const end = celestialToCartesian(line[1][0], line[1][1]);
      return [start, end];
    })
  );

  return (
    <group>
      {points.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line[0].x, line[0].y, line[0].z,
                line[1].x, line[1].y, line[1].z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </line>
      ))}
    </group>
  );
};

const Earth: React.FC = () => {
  const texture = useTexture('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Earth_Eastern_Hemisphere.jpg/1024px-Earth_Eastern_Hemisphere.jpg');

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const NightSkyMap: React.FC = () => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [planets, setPlanets] = useState(calculatePlanetPositions(new Date()));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanets(calculatePlanetPositions(new Date()));
    }, 60000); // Update planet positions every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }} style={{ background: 'black' }}>
        <ambientLight intensity={0.1} />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <OrbitControls />

        {/* Render Earth */}
        <Earth />

        {/* Render major stars */}
        {majorStars.map(star => (
          <SkyObject
            key={star.name}
            position={celestialToCartesian(star.ra, star.dec)}
            name={star.name}
            magnitude={star.magnitude}
            selected={selectedObject === star.name}
            onClick={() => setSelectedObject(star.name)}
          />
        ))}

        {/* Render planets */}
        {showPlanets && planets.map(planet => (
          <SkyObject
            key={planet.name}
            position={celestialToCartesian(planet.ra, planet.dec)}
            name={planet.name}
            magnitude={planet.magnitude}
            selected={selectedObject === planet.name}
            onClick={() => setSelectedObject(planet.name)}
          />
        ))}

        {/* Render constellation lines */}
        {showConstellations && <ConstellationLines starName={selectedObject} />}
      </Canvas>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px'
      }}>
        <button onClick={() => setShowConstellations(!showConstellations)}>
          {showConstellations ? 'Hide' : 'Show'} Constellations
        </button>
        <button onClick={() => setShowPlanets(!showPlanets)}>
          {showPlanets ? 'Hide' : 'Show'} Planets
        </button>
      </div>

      {/* Object Info */}
      {selectedObject && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>{selectedObject}</h3>
          {/* Add more object details here */}
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default NightSkyMap;