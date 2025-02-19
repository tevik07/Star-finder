const spectralClassToColor = (spectralClass: string | null): string => {
  if (!spectralClass) return "#ffffff"; // Default white if no spectral class
  const classLower = spectralClass.toLowerCase();

  if (classLower.startsWith("o")) return "#9bb0ff"; // Blue
  if (classLower.startsWith("b")) return "#aabfff"; // Blue-white
  if (classLower.startsWith("a")) return "#cad7ff"; // White
  if (classLower.startsWith("f")) return "#f8f7ff"; // Yellow-white
  if (classLower.startsWith("g")) return "#fff4ea"; // Yellow (Sun-like)
  if (classLower.startsWith("k")) return "#ffd2a1"; // Orange
  if (classLower.startsWith("m")) return "#ffcc6f"; // Red-orange (Red Dwarfs & Giants)

  return "#ffffff"; // Default white
};

export const fetchStars = async () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.api-ninjas.com/v1/stars?min_apparent_magnitude=1.0&max_apparent_magnitude=2.0";

  try {
    const response = await fetch(API_URL, {
      headers: { "X-Api-Key": API_KEY },
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    console.log("Fetched star data:", data); // Debugging

    return data.map((star: any) => ({
      name: star.name || "Unknown Star",
      description: `Magnitude: ${star.apparent_magnitude}, Constellation: ${star.constellation || "Unknown"}`,
      spectralClass: star.spectral_class || null,
      color: spectralClassToColor(star.spectral_class), // Assign color here
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * -30 - 10,
      ],
    }));
  } catch (error) {
    console.error("Error fetching stars:", error);
    return [];
  }
};
