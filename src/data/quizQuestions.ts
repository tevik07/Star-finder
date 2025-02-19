export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'planets' | 'stars' | 'space-exploration' | 'general';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which planet is known as the 'Red Planet'?",
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctAnswer: 'Mars',
    explanation: "Mars appears red due to iron oxide (rust) on its surface.",
    difficulty: 'easy',
    category: 'planets'
  },
  {
    id: 2,
    question: "What is the largest planet in our solar system?",
    options: ['Saturn', 'Mars', 'Jupiter', 'Neptune'],
    correctAnswer: 'Jupiter',
    explanation: "Jupiter is the largest planet, with a mass more than twice that of all other planets combined.",
    difficulty: 'easy',
    category: 'planets'
  },
  {
    id: 3,
    question: "What is the name of the galaxy we live in?",
    options: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'],
    correctAnswer: 'Milky Way',
    explanation: "The Milky Way is our home galaxy, containing over 100 billion stars.",
    difficulty: 'easy',
    category: 'general'
  },
  {
    id: 4,
    question: "Who was the first human to walk on the Moon?",
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'],
    correctAnswer: 'Neil Armstrong',
    explanation: "Neil Armstrong was the first person to walk on the Moon during the Apollo 11 mission in 1969.",
    difficulty: 'easy',
    category: 'space-exploration'
  },
  {
    id: 5,
    question: "What is the closest star to Earth (besides the Sun)?",
    options: ['Proxima Centauri', 'Alpha Centauri A', 'Sirius', 'Betelgeuse'],
    correctAnswer: 'Proxima Centauri',
    explanation: "Proxima Centauri is the closest star to our Solar System, at about 4.2 light-years away.",
    difficulty: 'medium',
    category: 'stars'
  },
  {
    id: 6,
    question: "What causes the phases of the Moon?",
    options: [
      'Earth\'s shadow',
      'The Moon\'s rotation speed',
      'The relative positions of the Sun, Earth, and Moon',
      'The Moon\'s varying distance from Earth'
    ],
    correctAnswer: 'The relative positions of the Sun, Earth, and Moon',
    explanation: "Moon phases occur due to how we see the sunlit portion of the Moon as it orbits Earth.",
    difficulty: 'medium',
    category: 'general'
  },
  {
    id: 98,
    question: "What is a pulsar?",
    options: [
      'A dying star',
      'A rotating neutron star',
      'A black hole',
      'A type of galaxy'
    ],
    correctAnswer: 'A rotating neutron star',
    explanation: "A pulsar is a highly magnetized, rotating neutron star that emits beams of electromagnetic radiation from its poles.",
    difficulty: 'hard',
    category: 'stars'
  },
  {
    id: 99,
    question: "What is dark energy?",
    options: [
      'A type of black hole',
      'The force that powers stars',
      'The hypothetical force causing universe expansion',
      'The energy inside atoms'
    ],
    correctAnswer: 'The hypothetical force causing universe expansion',
    explanation: "Dark energy is a hypothetical form of energy that is thought to permeate all of space and tend to accelerate the expansion of the universe.",
    difficulty: 'hard',
    category: 'general'
  },
  {
    id: 100,
    question: "What is the largest known star in the observable universe?",
    options: ['UY Scuti', 'VY Canis Majoris', 'Betelgeuse', 'Antares'],
    correctAnswer: 'UY Scuti',
    explanation: "UY Scuti is currently the largest known star with a radius about 1,700 times that of the Sun.",
    difficulty: 'hard',
    category: 'stars'
  }
];

// Function to get random questions with difficulty weighting
export const getRandomQuestions = (count: number): QuizQuestion[] => {
  // Weight questions by difficulty
  const weights = {
    easy: 0.4,    // 40% chance for easy questions
    medium: 0.35, // 35% chance for medium questions
    hard: 0.25    // 25% chance for hard questions
  };

  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  const selected: QuizQuestion[] = [];
  const difficultyCount = {
    easy: Math.round(count * weights.easy),
    medium: Math.round(count * weights.medium),
    hard: Math.round(count * weights.hard)
  };

  // Ensure we get the right number of questions for each difficulty
  Object.entries(difficultyCount).forEach(([difficulty, targetCount]) => {
    const questionsOfDifficulty = shuffled.filter(q => q.difficulty === difficulty);
    selected.push(...questionsOfDifficulty.slice(0, targetCount));
  });

  // If we don't have enough questions, add more randomly
  while (selected.length < count) {
    const remaining = shuffled.find(q => !selected.includes(q));
    if (remaining) selected.push(remaining);
  }

  // Shuffle the final selection
  return selected.sort(() => 0.5 - Math.random());
};

// Function to calculate score based on difficulty
export const calculateScore = (correct: boolean, difficulty: 'easy' | 'medium' | 'hard'): number => {
  const scores = {
    easy: 1,
    medium: 2,
    hard: 3
  };
  return correct ? scores[difficulty] : 0;
}; 