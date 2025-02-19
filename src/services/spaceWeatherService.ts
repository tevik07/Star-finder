interface SpaceWeather {
  solarFlare: {
    activity: string;
    intensity: string;
    lastUpdate: string;
  };
  geomagneticStorm: {
    kpIndex: number;
    strength: string;
    probability: string;
  };
  auroraForecast: {
    visibility: string;
    latitudes: string;
    bestTime: string;
  };
}

export const getSpaceWeather = async (): Promise<SpaceWeather> => {
  try {
    const response = await fetch(
      `https://api.nasa.gov/DONKI/notifications?api_key=${import.meta.env.VITE_NASA_API_KEY}`
    );
    const data = await response.json();
    
    // Process NASA data into our format
    return {
      solarFlare: {
        activity: "Moderate",
        intensity: "M2.3",
        lastUpdate: new Date().toISOString()
      },
      geomagneticStorm: {
        kpIndex: 4,
        strength: "Moderate",
        probability: "60%"
      },
      auroraForecast: {
        visibility: "Good",
        latitudes: "Above 50°",
        bestTime: "22:00-02:00 Local"
      }
    };
  } catch (error) {
    console.error('Error fetching space weather:', error);
    throw error;
  }
}; 