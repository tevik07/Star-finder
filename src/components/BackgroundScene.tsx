import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Planet component for background
const BackgroundPlanet = ({ position, size, speed, texture, orbitRadius }) => {
  const meshRef = useRef();
  const planetTexture = useTexture(texture);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Orbital motion
      const time = clock.getElapsedTime();
      meshRef.current.position.x = Math.cos(time * speed) * orbitRadius;
      meshRef.current.position.z = Math.sin(time * speed) * orbitRadius;
      meshRef.current.position.y = position[1];
      
      // Self rotation
      meshRef.current.rotation.y += speed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        map={planetTexture}
        metalness={0.4}
        roughness={0.7}
      />
    </mesh>
  );
};

// Star field component
const StarField = () => {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={starsRef}>
      {/* Multiple layers of stars */}
      <Stars 
        radius={300} 
        depth={100} 
        count={5000} 
        factor={6} 
        saturation={0.9} 
        fade 
        speed={1} 
      />
      <Stars 
        radius={200} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1.5} 
      />
      <Stars 
        radius={100} 
        depth={50} 
        count={1000} 
        factor={8} 
        saturation={1} 
        fade 
        speed={2} 
      />
    </group>
  );
};

const BackgroundScene = () => {
  const backgroundPlanets = [
    {
      position: [-15, 3, -20],
      size: 2.5,
      speed: 0.3,
      texture: '/textures/mars.jpg',
      orbitRadius: 20
    },
    {
      position: [20, -5, -25],
      size: 3,
      speed: 0.15,
      texture: '/textures/jupiter.jpg',
      orbitRadius: 25
    },
    {
      position: [-10, -8, -30],
      size: 2,
      speed: 0.4,
      texture: '/textures/venus.jpg',
      orbitRadius: 15
    },
    {
      position: [25, 12, -35],
      size: 2.8,
      speed: 0.2,
      texture: '/textures/neptune.jpg',
      orbitRadius: 30
    }
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 70 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Dense star field background */}
      <Stars 
        radius={300} 
        depth={60} 
        count={20000} 
        factor={7} 
        saturation={0} 
        fade={true} 
        speed={1} 
      />
      
      {/* Mid-layer stars */}
      <Stars 
        radius={200} 
        depth={40} 
        count={15000} 
        factor={5} 
        saturation={0} 
        fade={true} 
        speed={1.5} 
      />
      
      {/* Foreground stars */}
      <Stars 
        radius={100} 
        depth={20} 
        count={10000} 
        factor={4} 
        saturation={0} 
        fade={true} 
        speed={2} 
      />

      {/* Background planets */}
      {backgroundPlanets.map((planet, index) => (
        <BackgroundPlanet 
          key={index} 
          {...planet} 
        />
      ))}

      {/* Space fog for depth */}
      <fog attach="fog" args={['#000000', 30, 400]} />
    </Canvas>
  );
};

export default BackgroundScene; 