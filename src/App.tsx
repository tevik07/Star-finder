import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import StarsScene from "./components/StarsScene";
import SolarSystemPage from "./components/SolarSystemPage";
import HabitablePlanets from "./components/HabitablePlanets";
import Favorites from "./components/Favorites";
import SpaceNews from './components/SpaceNews';
import SpaceQuiz from './components/SpaceQuiz';
import NightSkyMap from './components/NightSkyMap';
import './styles/LandingPage.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/stars" element={<StarsScene />} />
          <Route path="/solar-system" element={<SolarSystemPage />} />
          <Route path="/habitable-planets" element={<HabitablePlanets />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/news" element={<SpaceNews />} />
          <Route path="/quiz" element={<SpaceQuiz />} />
          <Route path="/sky-map" element={<NightSkyMap />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
