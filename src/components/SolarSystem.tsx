import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Mesh } from "three";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// 🪐 Planet Data
const solarSystemPlanets: PlanetData[] = [
  {
    name: "Mercury",
    radius: 3.8,
    distance: 40,
    color: "#A0522D",
    surfaceColor: "#8B4513",
    highlightColor: "#CD853F",
    description: "The smallest and innermost planet, Mercury is a rocky world with extreme temperatures and a heavily cratered surface.",
    temperature: "Range: -180°C to 430°C",
    atmosphere: "Very thin, almost none",
    moons: 0,
    dayLength: "176 Earth days",
    yearLength: "88 Earth days",
    rotationSpeed: 0.003,
  },
  {
    name: "Venus",
    radius: 9.5,
    distance: 72,
    color: "#DEB887",
    surfaceColor: "#DAA520",
    highlightColor: "#FFE4B5",
    description: "Often called Earth's sister planet, Venus has a thick toxic atmosphere and is the hottest planet in our solar system.",
    temperature: "Average: 462°C",
    atmosphere: "Very dense, mostly CO2",
    moons: 0,
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    rotationSpeed: 0.002,
  },
  {
    name: "Earth",
    radius: 10,
    distance: 100,
    color: "#4B9CD3",
    surfaceColor: "#2E86C1",
    highlightColor: "#85C1E9",
    description: "Our home planet, Earth is the only known world to support life, with liquid water oceans and a protective atmosphere.",
    temperature: "Average: 15°C",
    atmosphere: "Nitrogen, Oxygen rich",
    moons: 1,
    dayLength: "24 hours",
    yearLength: "365.25 days",
    rotationSpeed: 0.001,
  },
  {
    name: "Mars",
    radius: 5.3,
    distance: 152,
    color: "#CD5C5C",
    surfaceColor: "#B22222",
    highlightColor: "#FA8072",
    description: "The Red Planet features vast deserts, polar ice caps, and the solar system's largest volcano.",
    temperature: "Average: -63°C",
    atmosphere: "Thin, mostly CO2",
    moons: 2,
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    rotationSpeed: 0.0009,
  },
  {
    name: "Jupiter",
    radius: 112,
    distance: 520,
    color: "#DEB887",
    surfaceColor: "#CD853F",
    highlightColor: "#F4A460",
    description: "The largest planet, Jupiter is a gas giant with a Great Red Spot and dozens of moons.",
    temperature: "Average: -110°C",
    atmosphere: "Thick, Hydrogen and Helium",
    moons: 79,
    dayLength: "10 hours",
    yearLength: "11.9 Earth years",
    rotationSpeed: 0.0004,
  },
  {
    name: "Saturn",
    radius: 95,
    distance: 958,
    color: "#F0E68C",
    surfaceColor: "#DAA520",
    highlightColor: "#FFE4B5",
    description: "Famous for its spectacular ring system, Saturn is a gas giant with a unique appearance.",
    temperature: "Average: -140°C",
    atmosphere: "Mostly Hydrogen and Helium",
    moons: 82,
    dayLength: "10.7 hours",
    yearLength: "29.5 Earth years",
    rotationSpeed: 0.0003,
  },
  {
    name: "Uranus",
    radius: 40,
    distance: 1900,
    color: "#73C2FB",
    surfaceColor: "#5B92E5",
    highlightColor: "#89CFF0",
    description: "A unique ice giant that rotates on its side, Uranus has a tilted magnetic field and faint ring system.",
    temperature: "Average: -195°C",
    atmosphere: "Hydrogen, Helium, Methane",
    moons: 27,
    dayLength: "17.2 hours",
    yearLength: "84 Earth years",
    rotationSpeed: 0.0002,
  },
  {
    name: "Neptune",
    radius: 38,
    distance: 2800,
    color: "#4169E1",
    surfaceColor: "#0147AB",
    highlightColor: "#6495ED",
    description: "The windiest planet, Neptune is a distant ice giant with a dynamic atmosphere and a collection of moons.",
    temperature: "Average: -200°C",
    atmosphere: "Hydrogen, Helium, Methane",
    moons: 14,
    dayLength: "16.1 hours",
    yearLength: "165 Earth years",
    rotationSpeed: 0.0001,
  }
];

interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  color: string;
  surfaceColor: string;
  highlightColor: string;
  description: string;
  temperature: string;
  atmosphere: string;
  moons: number;
  dayLength: string;
  yearLength: string;
  rotationSpeed: number;
}

// 🔹 Planet Component (Fix for crashes)
const Planet: React.FC<{ planet: PlanetData; index: number; onClick: () => void }> = ({ 
  planet, 
  index,
  onClick 
}) => {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * planet.rotationSpeed + index;
      ref.current.position.x = planet.distance * Math.cos(t);
      ref.current.position.z = planet.distance * Math.sin(t);
      ref.current.rotation.y += planet.rotationSpeed * 0.5;
    }
  });

  return (
    <group>
      {/* Planet Core */}
      <mesh ref={ref} onClick={onClick}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshPhysicalMaterial
          color={planet.surfaceColor}
          roughness={0.7}
          metalness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          emissive={planet.color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Inner Atmosphere */}
      <mesh scale={1.02} position={ref.current?.position || [0, 0, 0]}>
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshPhongMaterial
          color={planet.highlightColor}
          transparent={true}
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Glow */}
      <mesh scale={1.15} position={ref.current?.position || [0, 0, 0]}>
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent={true}
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Add Saturn's rings */}
      {planet.name === "Saturn" && ref.current && (
        <SaturnRings position={ref.current.position} />
      )}
    </group>
  );
};

// Add this component right after the Planet component:
const OrbitLine: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 1, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Add this component after OrbitLine:
const SaturnRings: React.FC<{ position: THREE.Vector3 }> = ({ position }) => {
  return (
    <mesh position={position} rotation={[Math.PI / 6, 0, 0]}>
      <ringGeometry args={[120, 160, 64]} />
      <meshBasicMaterial
        color="#DAA520"
        transparent={true}
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 🌞 Main Solar System Component
const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Log if an error occurs
    if (error) console.error("WebGL Error: Check textures and materials!");
  }, [error]);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      background: "#000000",
      position: "relative",
      overflow: "hidden"
    }}>
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
        {selectedPlanet && (
          <>
            {/* Close button */}
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

            {/* Planet Name */}
            <h2 style={{ 
              color: selectedPlanet.color,
              fontSize: "2.5em",
              marginBottom: "20px",
              textShadow: `0 0 10px ${selectedPlanet.color}`,
            }}>
              {selectedPlanet.name}
            </h2>

            {/* Description */}
            <p style={{ 
              fontSize: "1.2em", 
              lineHeight: "1.6",
              marginBottom: "30px",
              color: "#e0e0e0" 
            }}>
              {selectedPlanet.description}
            </p>

            {/* Characteristics Section */}
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ 
                color: selectedPlanet.highlightColor,
                fontSize: "1.8em",
                marginBottom: "20px" 
              }}>
                Characteristics
              </h3>

              {/* Main Stats */}
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
                <p style={{ fontSize: "1.1em", marginBottom: "15px" }}>
                  <span style={{ color: selectedPlanet.highlightColor }}>Day Length: </span>
                  {selectedPlanet.dayLength}
                </p>
                <p style={{ fontSize: "1.1em" }}>
                  <span style={{ color: selectedPlanet.highlightColor }}>Year Length: </span>
                  {selectedPlanet.yearLength}
                </p>
              </div>

              {/* Additional Stats Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "15px",
                marginTop: "20px" 
              }}>
                {/* Moons */}
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ color: selectedPlanet.highlightColor, marginBottom: "5px" }}>
                    Moons
                  </div>
                  <div style={{ fontSize: "1.2em" }}>
                    {selectedPlanet.moons}
                  </div>
                </div>

                {/* Distance */}
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ color: selectedPlanet.highlightColor, marginBottom: "5px" }}>
                    Distance from Sun
                  </div>
                  <div style={{ fontSize: "1.2em" }}>
                    {selectedPlanet.distance} million km
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rest of your Solar System component */}
      <Canvas 
        camera={{ position: [0, 2000, 3000], fov: 45 }}
        style={{ background: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={3} color={"#FDB813"} distance={5000} decay={2} />
        
        {/* Sun with glow */}
        <group>
          <mesh>
            <sphereGeometry args={[200, 64, 64]} />
            <meshBasicMaterial color="#FDB813" />
            <pointLight position={[0, 0, 0]} intensity={2} distance={3000} decay={2} />
          </mesh>
          <mesh scale={1.2}>
            <sphereGeometry args={[200, 32, 32]} />
            <meshBasicMaterial
              color="#FDB813"
              transparent={true}
              opacity={0.4}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* Orbit Lines */}
        {solarSystemPlanets.map((planet) => (
          <OrbitLine key={`orbit-${planet.name}`} radius={planet.distance} />
        ))}

        {/* Planets */}
        {solarSystemPlanets.map((planet, index) => (
          <Planet
            key={planet.name}
            planet={planet}
            index={index}
            onClick={() => setSelectedPlanet(planet)}
          />
        ))}

        {/* Background starfield */}
        <Stars 
          radius={10000} 
          depth={1000} 
          count={15000} 
          factor={10} 
          saturation={0}
          fade={true}
          speed={0.5} 
        />

        {/* Closer, brighter stars */}
        <Stars 
          radius={5000} 
          depth={500} 
          count={50000} 
          factor={4} 
          saturation={1}
          fade={true}
          speed={1} 
        />

        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={500}
          maxDistance={5000}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3/4}
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          initialRotation={[Math.PI / 6, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default SolarSystem;
