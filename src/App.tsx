import { useState } from "react";
import "./App.css";

function App() {
  const buttons = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const operators = ["÷", "x", "-", "+"];

  const [firstNumber, setFirstNumber] = useState("");

  const editInput = (e) => setFirstNumber(firstNumber + e.target.innerText);

  return (
    <>
      <input type="text" value={firstNumber || "0"} readOnly={true} />
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
