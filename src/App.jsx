import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './App.css';
import Die from './components/Die';

function App() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const winCondition = diceArray.every(
      (die, index, array) =>
        die.isHeld === true && (index === 0 || die.value === array[0].value)
    );

    if (winCondition) {
      setTenzies(true);
    }
  }, [diceArray]);

  useEffect(() => {
    let interval;

    if (!tenzies) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 100); // Increment by 100 milliseconds
      }, 100);
    }

    return () => clearInterval(interval);
  }, [tenzies]);

  function allNewDice() {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(generateNewDie());
    }
    return newArray;
  }

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid(),
    };
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false);
      setDiceArray(allNewDice());
      setElapsedTime(0);
      setMoves(0)
    } else {
      setMoves((prevMoves) => prevMoves + 1); // Increment moves on each roll
      setDiceArray((prevState) =>
        prevState.map((die) => (die.isHeld ? die : generateNewDie()))
      );
    }
  }

  function holdDice(id) {
    setDiceArray((prevState) =>
      prevState.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = diceArray.map((die, index) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => {
        holdDice(die.id);
        // Increment moves when a die is clicked
        setMoves((prevMoves) => prevMoves + 1);
      }}
    />
  ));

  return (
    <main className='main--main'>
      {tenzies && <Confetti />}
      <div className='main--div'>
        <div className='score--board'>
          <p className='elapsed--time'>Elapsed Time: {formatElapsedTime(elapsedTime)}</p>
          <p className='score'>Score: {moves}</p>
        </div>
        <div className='game--board'>
          <div className='game--board--text'>
            <h2>Tenzies</h2>
            <p className='game--board--text--instruction'>
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
          </div>
          <div className='game--board--button--container'>{diceElements}</div>
          <button className='roll--btn' onClick={rollDice}>
            {tenzies ? 'New Game' : 'Roll'}
          </button>
        </div>
      </div>
    </main>
  );
}

// Helper function to format elapsed time
function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const remainingMilliseconds = milliseconds % 1000;

  return `${padZero(minutes)}:${padZero(remainingSeconds)}.${padZeroMilliseconds(
    remainingMilliseconds
  )}`;
}

// Helper function to pad single-digit numbers with zero
function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

// Helper function to pad milliseconds with zeros
function padZeroMilliseconds(milliseconds) {
  return milliseconds < 10
    ? `00${milliseconds}`
    : milliseconds < 100
    ? `0${milliseconds}`
    : milliseconds;
}

export default App;
