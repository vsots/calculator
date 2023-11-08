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

  const operators: Array<string> = ["/", "x", "-", "+"];

  const operations: Map<string, () => number> = new Map([
    ["/", () => parseFloat(firstNumber) / parseFloat(secondNumber)],
    ["x", () => parseFloat(firstNumber) * parseFloat(secondNumber)],
    ["+", () => parseFloat(firstNumber) + parseFloat(secondNumber)],
    ["-", () => parseFloat(firstNumber) - parseFloat(secondNumber)],
  ]);

  const editInput = (e) => {
    const value: string = e.target.value;
    if (operators.includes(value) && !operation.current) {
      operation.current = value;
      setDisplayFirstNumber(false);
    } else if (
      (operators.includes(value) && operation.current) ||
      value === "="
    ) {
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setSecondNumber("");
      if (value !== "=") operation.current = value;
      else operation.current = "";
    } else if (operation.current) setSecondNumber(secondNumber + value);
    else if (value === "AC") {
      setFirstNumber("");
      setSecondNumber("");
      setDisplayFirstNumber(true);
    } else setFirstNumber(firstNumber + value);
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
