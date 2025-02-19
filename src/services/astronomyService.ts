import * as THREE from 'three';

interface Star {
  name: string;
  ra: number;  // Right Ascension in degrees
  dec: number; // Declination in degrees
  magnitude: number;
  constellation: string;
}

interface Planet {
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  diameter: number;
}

// Convert celestial coordinates to Cartesian coordinates
export const celestialToCartesian = (ra: number, dec: number, radius: number = 1000): THREE.Vector3 => {
  const phi = (90 - dec) * (Math.PI / 180);
  const theta = ra * (Math.PI / 180);
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Major stars data
export const majorStars: Star[] = [
  { name: "Polaris", ra: 37.95, dec: 89.26, magnitude: 1.97, constellation: "Ursa Minor" },
  { name: "Vega", ra: 279.23, dec: 38.78, magnitude: 0.03, constellation: "Lyra" },
  { name: "Sirius", ra: 101.28, dec: -16.71, magnitude: -1.46, constellation: "Canis Major" },
  // Add more stars...
];

// Constellation lines data
export const constellationLines = [
  {
    name: "Ursa Major",
    lines: [
      [[165.93, 61.75], [168.16, 60.72]], // Connect stars by their [ra, dec]
      // Add more line segments...
    ]
  },
  // Add more constellations...
];

// Calculate current planet positions (simplified)
export const calculatePlanetPositions = (date: Date): Planet[] => {
  // This would normally use complex orbital calculations
  // For now, returning placeholder data
  return [
    { name: "Mars", ra: 120, dec: 15, magnitude: 1.5, diameter: 6779 },
    { name: "Jupiter", ra: 150, dec: -5, magnitude: -2.2, diameter: 139820 },
    // Add more planets...
  ];
}; 