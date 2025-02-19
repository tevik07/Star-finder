import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { api } from '../services/api';

interface HabitablePlanetData {
  name: string;
  radius: number;
  distance: number;
  color: string;
  description: string;
  temperature: string;
  atmosphere: string;
  water: boolean;
  rotationSpeed: number;
  surfaceColor: string;  // Base surface color
  highlightColor: string;  // For highlights/patterns
}

const habitablePlanets: HabitablePlanetData[] = [
  {
    name: "Kepler-442b",
    radius: 8,
    distance: 50,
    color: "#4287f5",
    surfaceColor: "#3066BE",  // Deep ocean blue
    highlightColor: "#7CCCF5", // Light blue for clouds/ice
    description: "A super-Earth with vast oceans and a thick atmosphere. Scientists believe it could harbor deep-sea life forms.",
    temperature: "Moderate (15°C)",
    atmosphere: "Dense, Earth-like composition",
    water: true,
    rotationSpeed: 0.002,
  },
  {
    name: "Proxima Centauri b",
    radius: 6,
    distance: 85,
    color: "#e07a52",
    surfaceColor: "#CD4631",  // Mars-like red
    highlightColor: "#E8B059", // Sandy highlights
    description: "The closest potentially habitable planet to Earth, with rocky terrain and possible liquid water under the surface.",
    temperature: "Cool (5°C)",
    atmosphere: "Thin, Mars-like",
    water: true,
    rotationSpeed: 0.003,
  },
  {
    name: "TRAPPIST-1e",
    radius: 7,
    distance: 120,
    color: "#2e7d32",
    surfaceColor: "#1B4332",  // Deep forest green
    highlightColor: "#52B788", // Bright vegetation
    description: "Part of the TRAPPIST system, this planet has conditions remarkably similar to Earth, with potential for diverse ecosystems.",
    temperature: "Warm (20°C)",
    atmosphere: "Dense, rich in oxygen",
    water: true,
    rotationSpeed: 0.004,
  },
  {
    name: "TOI-700 d",
    radius: 9,
    distance: 155,
    color: "#1a237e",
    surfaceColor: "#14213D",  // Deep ocean blue
    highlightColor: "#4361EE", // Bright water highlights
    description: "A water world with global oceans and floating continents. Could host unique aquatic life forms.",
    temperature: "Moderate (18°C)",
    atmosphere: "Humid, water-rich",
    water: true,
    rotationSpeed: 0.0025,
  },
  {
    name: "Teegarden's Star b",
    radius: 7.5,
    distance: 190,
    color: "#388e3c",
    surfaceColor: "#2D6A4F",  // Rich jungle green
    highlightColor: "#74C69D", // Bright vegetation
    description: "A lush world covered in vegetation, with conditions perfect for complex life forms.",
    temperature: "Warm (25°C)",
    atmosphere: "Rich in oxygen, similar to Earth's Carboniferous period",
    water: true,
    rotationSpeed: 0.003,
  },
  {
    name: "K2-18b",
    radius: 10,
    distance: 225,
    color: "#0277bd",
    surfaceColor: "#023E8A",  // Deep ocean blue
    highlightColor: "#48CAE4", // Bright water/cloud highlights
    description: "A massive planet with floating islands above a global ocean, protected by a strong magnetic field.",
    temperature: "Moderate (12°C)",
    atmosphere: "Thick, protective layer",
    water: true,
    rotationSpeed: 0.002,
  }
];

const Planet: React.FC<{ planet: HabitablePlanetData; index: number; onClick: () => void }> = ({ 
  planet, 
  index,
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate position
  const position = useMemo(() => [
    Math.cos(index * ((2 * Math.PI) / habitablePlanets.length)) * planet.distance,
    0,
    Math.sin(index * ((2 * Math.PI) / habitablePlanets.length)) * planet.distance
  ] as [number, number, number], [index, planet.distance]);

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * delta;
    }
  });

  return (
    <group position={position}>
      {/* Planet Core */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[planet.radius, 128, 128]} />
        <meshPhysicalMaterial
          color={planet.surfaceColor}
          roughness={0.4}
          metalness={0.5}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          emissive={planet.color}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Inner Atmosphere - Brighter */}
      <mesh scale={1.02}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshPhongMaterial
          color={planet.highlightColor}
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Middle Atmosphere - More visible */}
      <mesh scale={1.1}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshBasicMaterial
          color={planet.color}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Atmosphere - Extended */}
      <mesh scale={1.2}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshBasicMaterial
          color={planet.highlightColor}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Distant Glow - Enhanced */}
      <mesh scale={1.5}>
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Additional Outer Glow Layer */}
      <mesh scale={2.0}>
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshBasicMaterial
          color={planet.highlightColor}
          transparent={true}
          opacity={0.02}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Surface Details with enhanced glow */}
      <mesh scale={1.001}>
        <sphereGeometry args={[planet.radius, 128, 128]} />
        <meshPhongMaterial
          color={planet.highlightColor}
          transparent={true}
          opacity={0.2}
          blending={THREE.MultiplyBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const HabitablePlanets: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = React.useState<HabitablePlanetData | null>(null);
  const { user, token } = useAuth();

  const handleAddToFavorites = async (planetData: { id: string; name: string; description: string }) => {
    if (!user || !token) {
      alert('Please login to add favorites');
      return;
    }

    try {
      await api.addToFavorites(token, 'planet', planetData);
      alert(`${planetData.name} added to favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      background: "#000000",
      position: "relative",
      overflow: "hidden"
    }}>
      <Navigation />
      {/* Info Panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "400px",
          height: "100%",
          background: "rgba(0, 0, 0, 0.85)",
          color: "white",
          padding: "30px",
          transform: selectedPlanet ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.5)",
          overflowY: "auto",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        {/* Close button */}
        {selectedPlanet && (
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "5px",
              zIndex: 1001,
            }}
          >
            ×
          </button>
        )}
        
        {/* Rest of the info panel content */}
        {selectedPlanet && (
          <>
            <h2 style={{ 
              color: selectedPlanet.color,
              fontSize: "2.5em",
              marginBottom: "20px",
              textShadow: `0 0 10px ${selectedPlanet.color}`,
            }}>
              {selectedPlanet.name}
            </h2>
            <p style={{ 
              fontSize: "1.2em", 
              lineHeight: "1.6",
              marginBottom: "30px",
              color: "#e0e0e0" 
            }}>
              {selectedPlanet.description}
            </p>
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ 
                color: selectedPlanet.highlightColor,
                fontSize: "1.8em",
                marginBottom: "20px" 
              }}>
                Characteristics
              </h3>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "15px"
              }}>
                <p style={{ fontSize: "1.1em", marginBottom: "15px" }}>
                  <span style={{ color: selectedPlanet.highlightColor }}>Temperature: </span>
                  {selectedPlanet.temperature}
                </p>
                <p style={{ fontSize: "1.1em", marginBottom: "15px" }}>
                  <span style={{ color: selectedPlanet.highlightColor }}>Atmosphere: </span>
                  {selectedPlanet.atmosphere}
                </p>
                <p style={{ fontSize: "1.1em" }}>
                  <span style={{ color: selectedPlanet.highlightColor }}>Water: </span>
                  {selectedPlanet.water ? "Potentially present" : "Unknown"}
                </p>
              </div>
              
              {/* Additional Stats */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "15px",
                marginTop: "20px" 
              }}>
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ color: selectedPlanet.highlightColor, marginBottom: "5px" }}>
                    Radius
                  </div>
                  <div style={{ fontSize: "1.2em" }}>
                    {selectedPlanet.radius} units
                  </div>
                </div>
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ color: selectedPlanet.highlightColor, marginBottom: "5px" }}>
                    Distance
                  </div>
                  <div style={{ fontSize: "1.2em" }}>
                    {selectedPlanet.distance} units
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 15px",
          background: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(255, 68, 68, 0.3)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ff6666";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ff4444";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        ⬅ Back to Stars
      </button>

      <Canvas 
        camera={{ position: [0, 70, 200], fov: 60 }}
        style={{ 
          background: 'black',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.6} />
        <pointLight 
          position={[100, 100, 100]} 
          intensity={6}
          color={"#ffffff"}
        />
        <pointLight 
          position={[-100, -100, -100]} 
          intensity={3}
          color={"#ffffff"}
        />
        <pointLight 
          position={[0, 0, 0]} 
          intensity={4}
          distance={300} 
          decay={2}
          color={"#ffd700"}
        />

        {/* Enhanced stars */}
        <Stars 
          radius={300} 
          depth={60} 
          count={25000}
          factor={4} 
          saturation={1}
          fade={true}
          speed={1} 
        />

        {/* Background stars (additional layer) */}
        <Stars 
          radius={350} 
          depth={100} 
          count={15000} 
          factor={6} 
          saturation={0.6} 
          fade={true}
          speed={0.5} 
        />

        {/* Darker fog */}
        <fog attach="fog" args={['#000000', 150, 500]} />

        {habitablePlanets.map((planet, index) => (
          <Planet
            key={planet.name}
            planet={planet}
            index={index}
            onClick={() => setSelectedPlanet(planet)}
          />
        ))}

        <OrbitControls 
          enableDamping={true} 
          dampingFactor={0.05} 
          minDistance={30}
          maxDistance={300}
        />
      </Canvas>

      {/* Add favorite buttons where needed, example: */}
      <button onClick={() => handleAddToFavorites({
        id: 'kepler-186f',
        name: 'Kepler-186f',
        description: 'First Earth-sized planet discovered in habitable zone'
      })}>
        Add Kepler-186f to Favorites
      </button>
    </div>
  );
};

export default HabitablePlanets; 