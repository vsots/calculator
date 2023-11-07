import { useState, useRef } from "react";
import "./App.css";

function App() {
  const buttons = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const [displayFirstNumber, setDisplayFirstNumber] = useState(true);
  const [firstNumber, setFirstNumber] = useState("");
  const operation = useRef(null);
  const [secondNumber, setSecondNumber] = useState("");

  const operators = ["÷", "x", "-", "+"];

  const editInput = (e) => {
    const value = e.target.innerText;
    if (operators.includes(value)) {
      operation.current = value;
      setDisplayFirstNumber(false);
    } else if (operation.current) setSecondNumber(secondNumber + value);
    else setFirstNumber(firstNumber + e.target.innerText);
  };

  return (
    <>
      <input
        type="text"
        value={
          displayFirstNumber ? firstNumber || "0" : secondNumber || firstNumber
        }
        readOnly={true}
      />
      <div className="column">
        {buttons.map((row) => (
          <div className="row">
            {row.map((button) => (
              <button key={button} onClick={(e) => editInput(e)}>
                {button}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
