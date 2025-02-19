interface APIQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface FormattedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const fetchQuizQuestions = async (amount: number = 10): Promise<FormattedQuestion[]> => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=17&type=multiple`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format');
    }

    return data.results.map((q: APIQuestion) => {
      const options = [...q.incorrect_answers, q.correct_answer]
        .sort(() => Math.random() - 0.5);

      return {
        question: decodeHTMLEntities(q.question),
        options: options.map(decodeHTMLEntities),
        correctAnswer: decodeHTMLEntities(q.correct_answer)
      };
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    // Return fallback questions if API fails
    return [
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Mercury"],
        correctAnswer: "Mars"
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
        correctAnswer: "Jupiter"
      },
      {
        question: "What is the name of our galaxy?",
        options: ["Andromeda", "Milky Way", "Triangulum", "Centaurus A"],
        correctAnswer: "Milky Way"
      },
      {
        question: "How many planets are in our solar system?",
        options: ["7", "8", "9", "10"],
        correctAnswer: "8"
      },
      {
        question: "Which is the hottest planet in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correctAnswer: "Venus"
      },
      {
        question: "What is the name of the force that keeps planets in orbit?",
        options: ["Magnetic Force", "Nuclear Force", "Gravity", "Centrifugal Force"],
        correctAnswer: "Gravity"
      },
      {
        question: "What is the closest star to Earth besides the Sun?",
        options: ["Proxima Centauri", "Alpha Centauri", "Sirius", "Betelgeuse"],
        correctAnswer: "Proxima Centauri"
      },
      {
        question: "What causes the seasons on Earth?",
        options: [
          "Earth's distance from the Sun",
          "Earth's tilt on its axis",
          "The Moon's gravity",
          "Solar winds"
        ],
        correctAnswer: "Earth's tilt on its axis"
      },
      {
        question: "What is a black hole?",
        options: [
          "A dead star",
          "An empty region of space",
          "A region where gravity is so strong nothing can escape",
          "A hole in the ozone layer"
        ],
        correctAnswer: "A region where gravity is so strong nothing can escape"
      },
      {
        question: "What is the Great Red Spot on Jupiter?",
        options: [
          "A volcano",
          "A giant storm",
          "A crater",
          "A lake of red liquid"
        ],
        correctAnswer: "A giant storm"
      },
      {
        question: "Which space mission first landed humans on the Moon?",
        options: ["Apollo 10", "Apollo 11", "Apollo 12", "Apollo 13"],
        correctAnswer: "Apollo 11"
      },
      {
        question: "What is the Sun primarily made of?",
        options: ["Liquid lava", "Molten iron", "Hydrogen and Helium", "Rocks and metals"],
        correctAnswer: "Hydrogen and Helium"
      },
      {
        question: "What is the name of the force field that protects Earth from solar winds?",
        options: ["Ozone layer", "Magnetosphere", "Atmosphere", "Ionosphere"],
        correctAnswer: "Magnetosphere"
      },
      {
        question: "Which planet has the most moons?",
        options: ["Saturn", "Jupiter", "Uranus", "Neptune"],
        correctAnswer: "Jupiter"
      },
      {
        question: "What is a light year?",
        options: [
          "The time it takes light to travel in a year",
          "The distance light travels in a year",
          "The speed of light",
          "The brightness of a star"
        ],
        correctAnswer: "The distance light travels in a year"
      },
      {
        question: "What is the name of Mars' largest moon?",
        options: ["Phobos", "Deimos", "Titan", "Europa"],
        correctAnswer: "Phobos"
      },
      {
        question: "What is the asteroid belt?",
        options: [
          "A ring around Saturn",
          "A region between Mars and Jupiter",
          "A belt around Earth",
          "A region beyond Pluto"
        ],
        correctAnswer: "A region between Mars and Jupiter"
      },
      {
        question: "What causes the Moon's phases?",
        options: [
          "Earth's shadow",
          "The Sun's rotation",
          "The Moon's position relative to Earth and Sun",
          "Cloud cover"
        ],
        correctAnswer: "The Moon's position relative to Earth and Sun"
      }
    ];
  }
};

// Helper function to decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}; 