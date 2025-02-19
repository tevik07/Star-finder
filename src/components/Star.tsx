import { useSpring, animated } from "@react-spring/three";

interface StarProps {
  position: [number, number, number];
  name: string;
  description: string;
  selectedStar: string | null;
  color: string; // Dynamic color
  onClick: (name: string, description: string) => void;
}

const Star: React.FC<StarProps> = ({ position, name, description, selectedStar, color, onClick }) => {
  const isSelected = selectedStar === name;

  // Animate movement towards user
  const { positionZ } = useSpring({
    positionZ: isSelected ? position[2] - 1.5 : position[2], // Move forward if selected
    config: { tension: 200, friction: 25 },
  });

  return (
    <animated.mesh
      position={[position[0], position[1], positionZ.get()]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(name, description);
      }}
    >
      {/* Glowing effect */}
      <pointLight intensity={1.2} color={color} distance={5} decay={2} />
      
      {/* Star shape */}
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial color={color} /> {/* Retains color correctly */}
    </animated.mesh>
  );
};

export default Star;
