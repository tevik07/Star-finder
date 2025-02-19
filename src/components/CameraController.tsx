import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useEffect } from "react";

interface CameraControllerProps {
  targetPosition: [number, number, number] | null;
}

const CameraController: React.FC<CameraControllerProps> = ({ targetPosition }) => {
  const { camera } = useThree();

  // Smooth Camera Animation
  const [{ x, y, z }, set] = useSpring(() => ({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    config: { tension: 100, friction: 20 },
  }));

  useEffect(() => {
    if (targetPosition) {
      console.log("Moving camera to", targetPosition);
      set({ x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] });
    } else {
      console.log("Resetting camera position");
      set({ x: 0, y: 0, z: 5 }); // Reset to default position
    }
  }, [targetPosition, set]);

  useFrame(() => {
    camera.position.set(x.get(), y.get(), z.get());
  });

  return null;
};

export default CameraController;
