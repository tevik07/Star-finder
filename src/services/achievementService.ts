interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_perfect',
    name: 'Perfect Score!',
    description: 'Get all questions correct in a quiz',
    unlocked: false,
    icon: '🏆'
  },
  // Add more achievements
];

export const checkAchievements = (score: number, total: number) => {
  if (score === total) {
    unlockAchievement('first_perfect');
  }
  // Check other achievements
}; 