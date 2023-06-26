import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Die from './die';
import {nanoid} from "nanoid"
import Confetti from "react-confetti-explosion"

export default function App() {

  // function to generate random numbers
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie()) 
    }
    return newDice
  }

  // state to hold random numbers
  const [dice, setDice] = React.useState(allNewDice())

  // state to hold the boolean if all the tenzies ae held
  const [tenzies, setTenzies] = React.useState(false)

  // useEffect to determine if all the tenzies are held
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue ) {
      setTenzies(true)
    }
  }, [dice])
  
  // function to generate new die
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  // function to roll the dice but keep held die 
  function rollDice() {
    if (!tenzies) {
      setDice( oldDice => oldDice.map(die => {
        return die.isHeld  ? die : generateNewDie( )
      })) 
    } else {
      setTenzies(false)
      setDice(allNewDice())
    }
  }

  // function that enables to hold dice
  function holdDice(id) {
    setDice( oldDice => oldDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }
 
  const diceElements = dice.map(die => 
    <Die 
        isHeld={die.isHeld} 
        key={die.id} 
        value={die.value} 
        holdDice={() => holdDice(die.id)} 
    />
  )

  return (
    <main>
        { tenzies && <Confetti /> }
        <h1 className="title">Tenzies</h1> 
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls. </p>
        <div className="dice-container">
          {diceElements}
        </div>
        <button 
          className="roll-dice" 
          onClick={rollDice}>
          { tenzies ? "New Game" : "Roll"}
        </button>
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)