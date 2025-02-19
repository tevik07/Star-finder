import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizQuestions, FormattedQuestion } from '../services/quizService';

const SpaceQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const navigate = useNavigate();

  const categories = [
    { id: 'planets', name: 'Planets' },
    { id: 'stars', name: 'Stars & Galaxies' },
    { id: 'exploration', name: 'Space Exploration' },
    { id: 'physics', name: 'Space Physics' }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!showResult && !isLoading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up, move to next question
            handleTimeUp();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, showResult, isLoading]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedQuestions = await fetchQuizQuestions(10);
      
      if (fetchedQuestions.length === 0) {
        throw new Error('No questions available');
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || !questions[currentQuestionIndex]) return;
    setSelectedAnswer(answer);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = async () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    await loadQuestions();
  };

  const DifficultySelector = () => (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Select Difficulty</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {['easy', 'medium', 'hard'].map(level => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level as 'easy' | 'medium' | 'hard');
              loadQuestions();
            }}
            style={{
              padding: '10px 20px',
              background: difficulty === level ? '#4caf50' : 'transparent',
              color: 'white',
              border: '1px solid white'
            }}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'black',
        color: 'white'
      }}>
        Loading questions...
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'black',
        color: 'white',
        gap: '20px'
      }}>
        <p>{error || 'Failed to load questions'}</p>
        <button
          onClick={loadQuestions}
          style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      padding: '20px'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '8px 16px',
          background: 'transparent',
          color: 'white',
          border: '1px solid white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px'
      }}>
        {!showResult ? (
          <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2>Space Quiz</h2>
              <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>

            <h3 style={{ marginBottom: '20px' }}>{currentQuestion.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  style={{
                    padding: '10px',
                    background: selectedAnswer === option 
                      ? option === currentQuestion.correctAnswer 
                        ? '#4caf50' 
                        : '#f44336'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedAnswer ? 'default' : 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', color: timeLeft < 10 ? '#f44336' : 'white' }}>
              Time Left: {timeLeft}s
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2>Quiz Complete!</h2>
            <p style={{ fontSize: '1.2em', margin: '20px 0' }}>
              Your Score: {score} out of {questions.length}
            </p>
            <button
              onClick={restartQuiz}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/stars')}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to Stars
            </button>
          </div>
        )}
      </div>

      <DifficultySelector />
    </div>
  );
};

export default SpaceQuiz; 