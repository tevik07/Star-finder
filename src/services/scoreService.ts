interface HighScore {
  playerName: string;
  score: number;
  difficulty: string;
  date: string;
}

export const saveHighScore = (score: HighScore) => {
  const scores = getHighScores();
  scores.push(score);
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 10)));
};

export const getHighScores = (): HighScore[] => {
  const scores = localStorage.getItem('highScores');
  return scores ? JSON.parse(scores) : [];
}; 