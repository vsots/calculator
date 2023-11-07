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
  const operation = useRef("");
  const [secondNumber, setSecondNumber] = useState("");

  const operators: Map<string, string> = new Map([
    ["/", "divide"],
    ["x", "multiply"],
    ["-", "subtract"],
    ["+", "add"],
  ]);

  const operations: Map<string, () => number> = new Map([
    ["divide", () => parseFloat(firstNumber) / parseFloat(secondNumber)],
    ["multiply", () => parseFloat(firstNumber) * parseFloat(secondNumber)],
    ["add", () => parseFloat(firstNumber) + parseFloat(secondNumber)],
    ["subtract", () => parseFloat(firstNumber) - parseFloat(secondNumber)],
  ]);

  const editInput = (e) => {
    const value = e.target.value;
    if (operators.has(value) && !operation.current) {
      operation.current = operators.get(value)!;
      setDisplayFirstNumber(false);
    } else if ((operators.has(value) && operation.current) || value === "=") {
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setSecondNumber("");
      if (value !== "=") operation.current = operators.get(value)!;
      else operation.current = "";
    } else if (operation.current) setSecondNumber(secondNumber + value);
    else if (value === "AC") {
      setFirstNumber("");
      setSecondNumber("");
      setDisplayFirstNumber(true);
    } else setFirstNumber(firstNumber + e.target.innerText);
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
              <button
                key={button}
                onClick={(e) => editInput(e)}
                value={button === "÷" ? "/" : button}
              >
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
