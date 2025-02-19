import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect } from "react";
import { useSpring } from "@react-spring/three";
import Star from "./Star";
import { fetchStars } from "../services/starsApi";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useNavigate } from "react-router-dom";  // Import navigation

const TOTAL_STARS = 3000; // Increased star count

const StarsScene: React.FC = () => {
  const [starsData, setStarsData] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [objectInfo, setObjectInfo] = useState<{ name: string; description: string } | null>(null);
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadStars = async () => {
      const data = await fetchStars(TOTAL_STARS);
      let extraStars = [];
      if (data.length < TOTAL_STARS) {
        for (let i = data.length; i < TOTAL_STARS; i++) {
          extraStars.push({
            name: `Star ${i + 1}`,
            description: "A distant unknown star.",
            spectralClass: "G",
            color: ["#cad7ff", "#aabfff", "#ffd2a1", "#f8f7ff", "#9bb0ff"][Math.floor(Math.random() * 5)],
            position: [
              (Math.random() - 0.5) * 300, 
              (Math.random() - 0.5) * 300, 
              (Math.random() - 0.5) * 300, 
            ],
          });
        }
      }
      setStarsData([...data, ...extraStars]);
    };
    loadStars();
  }, []);

  const handleObjectClick = (position, name, description) => {
    setSelectedObject(name);
    setObjectInfo({ name: name || "Unknown Object", description: description || "No data available." });
    setTargetPosition([position[0], position[1], position[2] - 5]);
  };

  const searchObject = () => {
    const foundStar = starsData.find((star) => star.name.toLowerCase() === searchQuery.toLowerCase());
    if (foundStar) {
      handleObjectClick(foundStar.position, foundStar.name, foundStar.description);
      return;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", position: "relative" }}>
      {/* Existing Buttons */}
      <button
        onClick={() => navigate('/solar-system')}
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
        Solar System
      </button>

      <button
        onClick={() => navigate('/habitable-planets')}
        style={{
          position: "absolute",
          top: "20px",
          left: "150px", // Adjusted position
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
        Habitable Planets
      </button>

      {/* New Buttons */}
      <button
        onClick={() => navigate('/news')}
        style={{
          position: "absolute",
          top: "20px",
          right: "150px", // Position from right
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
        Space News
      </button>

      <button
        onClick={() => navigate('/quiz')}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px", // Position from right
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
        Space Quiz
      </button>

      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
        }}
      >
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <ambientLight intensity={0.3} />

        <Stars count={3000} radius={500} factor={5} saturation={0} fade speed={1} />

        {starsData.map((star, index) => (
          <Star
            key={index}
            position={star.position}
            name={star.name}
            description={star.description}
            color={star.color || "white"}
            onClick={() => handleObjectClick(star.position, star.name, star.description)}
          />
        ))}

        <OrbitControls enableDamping={true} dampingFactor={0.1} rotateSpeed={0.3} />

        <EffectComposer multisampling={0} resolutionScale={0.8}>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.2} intensity={0.8} />
        </EffectComposer>

        <CameraAnimation targetPosition={targetPosition} />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: 10,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          borderRadius: 5,
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search a star..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: 5, borderRadius: 5 }}
        />
        <button onClick={searchObject} style={{ padding: 5, borderRadius: 5, cursor: "pointer" }}>
          Search
        </button>
      </div>

      {objectInfo && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            padding: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: 5,
          }}
        >
          <h3>{objectInfo.name}</h3>
          <p>{objectInfo.description}</p>
        </div>
      )}
    </div>
  );
};

const CameraAnimation = ({ targetPosition }) => {
  const { camera } = useThree();
  const { cameraPosition } = useSpring({
    cameraPosition: targetPosition || [0, 0, 5],
    config: { tension: 200, friction: 30 },
    onChange: ({ value }) => {
      camera.position.set(...value.cameraPosition);
    },
  });
  return null;
};

export default StarsScene;
