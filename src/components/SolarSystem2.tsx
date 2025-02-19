import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useGLTF } from "@react-three/drei";

// Import textures
import sunTexture from '../assets/textures/sun.jpg';
import mercuryTexture from '../assets/textures/mercury.jpg';
import venusTexture from '../assets/textures/venus.jpg';
import earthTexture from '../assets/textures/earth.jpg';
import earthNormalTexture from '../assets/textures/earth_normal.jpg';
import earthCloudsTexture from '../assets/textures/earth_clouds.png';
import marsTexture from '../assets/textures/mars.jpg';
import jupiterTexture from '../assets/textures/jupiter.jpg';
import saturnTexture from '../assets/textures/saturn.jpg';
import saturnRingsTexture from '../assets/textures/saturn_rings.png';
import uranusTexture from '../assets/textures/uranus.jpg';
import neptuneTexture from '../assets/textures/neptune.jpg';

interface PlanetData {
  name: string;
  radius: number;
  textureUrl?: string;
  normalMapUrl?: string;
  specularMapUrl?: string;
  cloudsUrl?: string;
  ringsUrl?: string;
  emissive?: boolean;
  distance: number;
  speed: number;
  rotationSpeed: number;
  color?: string;
  orbitTilt: number;
  hasAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereOpacity: number;
}

const planetData: PlanetData[] = [
  { 
    name: "Sun", 
    radius: 12,
    color: "#ffcc00",
    textureUrl: sunTexture,
    emissive: true,
    distance: 0,
    speed: 0,
    rotationSpeed: 0.001,
    orbitTilt: 0,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Mercury", 
    radius: 2,
    color: "#808080",
    textureUrl: mercuryTexture,
    distance: 28,
    speed: 0.4,
    rotationSpeed: 0.005,
    orbitTilt: 0.034,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Venus", 
    radius: 3.5,
    color: "#e0c97e",
    textureUrl: venusTexture,
    distance: 44,
    speed: 0.3,
    rotationSpeed: 0.004,
    orbitTilt: 0.009,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Earth", 
    radius: 4,
    color: "#1e90ff",
    textureUrl: earthTexture,
    normalMapUrl: earthNormalTexture,
    cloudsUrl: earthCloudsTexture,
    specularMapUrl: '/textures/earth_specular.jpg',
    distance: 62,
    speed: 0.25,
    rotationSpeed: 0.003,
    orbitTilt: 0.041,
    hasAtmosphere: true,
    atmosphereColor: "#88ccff",
    atmosphereOpacity: 0.1,
  },
  { 
    name: "Mars", 
    radius: 3,
    color: "#e35f48",
    textureUrl: marsTexture,
    distance: 78,
    speed: 0.2,
    rotationSpeed: 0.003,
    orbitTilt: 0.018,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Jupiter", 
    radius: 8,
    color: "#f3e4a1",
    textureUrl: jupiterTexture,
    distance: 100,
    speed: 0.15,
    rotationSpeed: 0.002,
    orbitTilt: 0.022,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Saturn", 
    radius: 7,
    color: "#d4b26f",
    textureUrl: saturnTexture,
    ringsUrl: saturnRingsTexture,
    distance: 138,
    speed: 0.1,
    rotationSpeed: 0.002,
    orbitTilt: 0.026,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Uranus", 
    radius: 5,
    color: "#67c7f5",
    textureUrl: uranusTexture,
    distance: 176,
    speed: 0.08,
    rotationSpeed: 0.001,
    orbitTilt: 0.097,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
  { 
    name: "Neptune", 
    radius: 5,
    color: "#417be1",
    textureUrl: neptuneTexture,
    distance: 200,
    speed: 0.06,
    rotationSpeed: 0.001,
    orbitTilt: 0.028,
    hasAtmosphere: false,
    atmosphereColor: "",
    atmosphereOpacity: 0,
  },
];
    
const textureLoader = new TextureLoader();
const texturePaths = [
  sunTexture,
  mercuryTexture,
  venusTexture,
  earthTexture,
  earthNormalTexture,
  earthCloudsTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  saturnRingsTexture,
  uranusTexture,
  neptuneTexture
];

const TexturePreloader: React.FC = () => {
  useEffect(() => {
    // Preload all textures
    texturePaths.forEach(path => {
      textureLoader.load(path, 
        // Success callback
        (texture) => {
          console.log(`Loaded texture: ${path}`);
        },
        // Progress callback
        undefined,
        // Error callback
        (error) => {
          console.error(`Error loading texture ${path}:`, error);
        }
      );
    });
  }, []);

  return null;
};

const AsteroidBelt: React.FC = () => {
  const asteroids = useMemo(() => {
    const belt = new THREE.Group();
    const asteroidCount = 2000;
    const beltRadius = 90; // Between Mars (78) and Jupiter (100)
    const beltWidth = 20;

    for (let i = 0; i < asteroidCount; i++) {
      // Random angle and radius for each asteroid
      const angle = (Math.random() * Math.PI * 2);
      const radius = beltRadius + (Math.random() - 0.5) * beltWidth;
      
      // Calculate position
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 5; // Some vertical variation

      // Create asteroid
      const size = Math.random() * 0.3 + 0.1;
      const geometry = new THREE.IcosahedronGeometry(size, 0);
      const material = new THREE.MeshStandardMaterial({
        color: '#666666',
        roughness: 0.8,
        metalness: 0.2,
      });

      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.position.set(x, y, z);
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      belt.add(asteroid);
    }

    return belt;
  }, []);

  useFrame((state) => {
    if (asteroids) {
      // Rotate the entire belt slowly
      asteroids.rotation.y += 0.0001;
    }
  });

  return <primitive object={asteroids} />;
};
    
    const SolarSystem2: React.FC<{ setSelectedPlanet: (planet: string) => void }> = ({ setSelectedPlanet }) => {
  const planetRefs = useRef<(THREE.Mesh | null)[]>(new Array(planetData.length).fill(null));
  const orbitRefs = useRef<(THREE.Line | null)[]>(new Array(planetData.length).fill(null));
  const ringsRefs = useRef<(THREE.Mesh | null)[]>(new Array(planetData.length).fill(null));
  const cloudsRefs = useRef<(THREE.Mesh | null)[]>(new Array(planetData.length).fill(null));

  // Create orbit paths
  const OrbitPath: React.FC<{ distance: number, orbitTilt: number }> = ({ distance, orbitTilt }) => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance * Math.sin(orbitTilt),
          Math.sin(angle) * distance * Math.cos(orbitTilt)
        )
      );
    }
    points.push(points[0]); // Close the circle

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#ffffff" opacity={0.1} transparent={true} />
      </line>
    );
  };

  useFrame((state, delta) => {
    planetRefs.current.forEach((mesh, index) => {
      if (mesh) {
        const planet = planetData[index];
        if (planet.name !== "Sun") {
          const time = state.clock.getElapsedTime();
          
          // Calculate orbital position
          const x = Math.cos(time * planet.speed) * planet.distance;
          const z = Math.sin(time * planet.speed) * planet.distance;
          const y = Math.sin(time * planet.speed) * planet.distance * Math.sin(planet.orbitTilt);
          
          // Update planet position
          mesh.position.set(x, y, z);

          // Update clouds position for Earth
          if (planet.name === "Earth" && cloudsRefs.current[index]) {
            const cloudMesh = cloudsRefs.current[index]!;
            // Match planet position
            cloudMesh.position.copy(mesh.position);
            // Rotate clouds slightly faster than the planet
            cloudMesh.rotation.y += planet.rotationSpeed * delta * 1.2;
          }

          // Update Saturn's rings position
          if (planet.name === "Saturn" && ringsRefs.current[index]) {
            ringsRefs.current[index]!.position.copy(mesh.position);
          }
        }

        // Self rotation
        mesh.rotation.y += planet.rotationSpeed * delta;
      }
    });
  });

  const Planet: React.FC<{ planet: PlanetData; index: number }> = ({ planet, index }) => {
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Load textures using useMemo to prevent unnecessary reloads
    const textures = useMemo(() => {
      try {
        const textureMap: Record<string, THREE.Texture | null> = {};
        let loadedCount = 0;
        const totalTextures = Object.keys(planet).filter(key => 
          key.toLowerCase().includes('texture') || key.toLowerCase().includes('map')
        ).length;
        
        const checkAllLoaded = () => {
          loadedCount++;
          if (loadedCount === totalTextures) {
            setTexturesLoaded(true);
          }
        };
        
        if (planet.textureUrl) {
          textureMap.map = textureLoader.load(planet.textureUrl, checkAllLoaded);
        }
        if (planet.normalMapUrl) {
          textureMap.normalMap = textureLoader.load(planet.normalMapUrl, checkAllLoaded);
        }
        if (planet.cloudsUrl) {
          textureMap.cloudsMap = textureLoader.load(planet.cloudsUrl, checkAllLoaded);
        }
        if (planet.ringsUrl) {
          textureMap.ringsMap = textureLoader.load(planet.ringsUrl, checkAllLoaded);
        }
        
        return textureMap;
      } catch (error) {
        console.error(`Error loading textures for ${planet.name}:`, error);
        return {};
      }
    }, [planet]);

    if (!texturesLoaded) {
      // Show a simple sphere while textures are loading
      return (
        <mesh position={[planet.distance, 0, 0]}>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial color={planet.color} />
        </mesh>
      );
    }
  
    return (
      <group>
        {/* Orbit Path (except for Sun) */}
        {planet.name !== "Sun" && (
          <OrbitPath distance={planet.distance} orbitTilt={planet.orbitTilt} />
        )}

        {/* Planet */}
        <mesh
          ref={(el) => (planetRefs.current[index] = el)}
          position={[planet.distance, 0, 0]}
          onClick={() => setSelectedPlanet(planet.name)}
        >
          <sphereGeometry args={[planet.radius, 64, 64]} />
          {planet.name === "Sun" ? (
            <meshBasicMaterial
              color={textures.map ? undefined : planet.color}
              map={textures.map || undefined}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              color={textures.map ? undefined : planet.color}
              map={textures.map || undefined}
              normalMap={textures.normalMap || undefined}
              metalness={0.1}
              roughness={0.6}
            />
          )}
        </mesh>
  
        {/* Clouds for Earth */}
        {planet.name === "Earth" && textures.cloudsMap && (
          <mesh
            ref={(el) => (cloudsRefs.current[index] = el)}
            position={[planet.distance, 0, 0]}
          >
            <sphereGeometry args={[planet.radius + 0.1, 64, 64]} />
            <meshStandardMaterial
              map={textures.cloudsMap}
              transparent={true}
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Saturn's Rings */}
        {planet.name === "Saturn" && (
          <mesh
            ref={(el) => (ringsRefs.current[index] = el)}
            position={[planet.distance, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[planet.radius * 1.4, planet.radius * 2, 64]} />
            <meshStandardMaterial
              map={textures.ringsMap || undefined}
              color={textures.ringsMap ? undefined : "#d4b26f"}
              transparent={true}
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    );
  };

  return (
    <>
      <TexturePreloader />
      {/* Improved lighting */}
      <ambientLight intensity={0.3} />
      <pointLight 
        position={[0, 0, 0]}
        intensity={6}
        distance={300}
        decay={1}
        color="#ffffff"
      />
      <pointLight
        position={[0, 50, -100]}
        intensity={0.5}
        distance={300}
        decay={2}
      />

      {/* Add asteroid belt */}
      <AsteroidBelt />

      {planetData.map((planet, index) => (
        <Planet key={planet.name} planet={planet} index={index} />
      ))}

      <OrbitControls 
        enableDamping={true}
        dampingFactor={0.1}
        rotateSpeed={0.1}
        minDistance={50}
        maxDistance={400}
      />
      </>
    );
  };
  
  export default SolarSystem2;
  