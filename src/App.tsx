import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [buttons, setButtons] = useState([
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]);

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
    console.log(value);
    if (value === "AC" || value === "C") {
      if (value === "C") {
        if (displayFirstNumber) {
          setFirstNumber("");
          setButtons([["AC", ...buttons[0].slice(1)], ...buttons.slice(1)]);
        } else if (!displayFirstNumber && !secondNumber) {
          operation.current = "";
          setDisplayFirstNumber(true);
        } else {
          setSecondNumber("0");
          setButtons([["AC", ...buttons[0].slice(1)], ...buttons.slice(1)]);
        }
      } else {
        setFirstNumber("");
        setSecondNumber("");
        operation.current = "";
        setDisplayFirstNumber(true);
      }
    } else if (operators.includes(value) && !operation.current) {
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
    else {
      setFirstNumber(firstNumber + value);
      if (buttons[0][0] === "AC")
        setButtons([["C", ...buttons[0].slice(1)], ...buttons.slice(1)]);
    }
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
          <div className="row" key={row[1]}>
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
