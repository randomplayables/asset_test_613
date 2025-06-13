import React, { useState } from 'react';
import RPLogo2_0 from "./assets/RPLogo2_0.png";
import './styles.css';

function getRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export default function App() {
  const [target, setTarget] = useState<number>(getRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Enter your guess between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const sendData = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setFeedback('Please enter a valid number');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    let result: string;
    if (numGuess < target) {
      result = 'low';
      setFeedback('Too low! Try again.');
    } else if (numGuess > target) {
      result = 'high';
      setFeedback('Too high! Try again.');
    } else {
      result = 'correct';
      setFeedback(`Correct! You guessed it in ${newAttempts} attempts.`);
      setGameOver(true);
    }
    sendData({
      event: 'guess',
      guess: numGuess,
      result,
      attempts: newAttempts,
      timestamp: new Date().toISOString()
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const resetGame = () => {
    const newTarget = getRandomNumber();
    setTarget(newTarget);
    setGuess('');
    setFeedback('New game! Enter your guess between 1 and 100');
    setAttempts(0);
    setGameOver(false);
    sendData({
      event: 'reset',
      newTarget,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="App">
      <img src={RPLogo2_0} alt="RPLogo2.png" className="logo" />
      <h1>Number Guessing Game</h1>
      <p>{feedback}</p>
      {!gameOver && (
        <div className="guess-container">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            className="guess-input"
            min="1"
            max="100"
          />
          <button onClick={handleGuess} className="guess-button">Guess</button>
        </div>
      )}
      {gameOver && (
        <button onClick={resetGame} className="reset-button">Play Again</button>
      )}
      <p>Attempts: {attempts}</p>
    </div>
  );
}