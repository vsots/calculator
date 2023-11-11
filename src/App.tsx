import { useState } from "react";
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
  const [operation, setOperation] = useState("");
  const [secondNumber, setSecondNumber] = useState("");

  const operators: Array<string> = ["/", "x", "-", "+"];

  const operations: Map<string, () => number> = new Map([
    [
      "/",
      () => (parseFloat(firstNumber) || 0) / (parseFloat(secondNumber) || 0),
    ],
    [
      "x",
      () => (parseFloat(firstNumber) || 0) * (parseFloat(secondNumber) || 0),
    ],
    [
      "+",
      () => (parseFloat(firstNumber) || 0) + (parseFloat(secondNumber) || 0),
    ],
    [
      "-",
      () => (parseFloat(firstNumber) || 0) - (parseFloat(secondNumber) || 0),
    ],
  ]);

  const editInput = (e) => {
    const value: string = e.target.value;
    if (value === "AC" || value === "C") {
      // Handles Clear and All Clear
      if (value === "C") {
        // Handles Clear case
        if (displayFirstNumber) {
          // Clears first number if first number being inputted not completed
          setFirstNumber("");
          setButtons([["AC", ...buttons[0].slice(1)], ...buttons.slice(1)]);
        } else if (!displayFirstNumber && !secondNumber) {
          // Clears operation if second number not input yet
          setOperation("");
          setDisplayFirstNumber(true);
        } else {
          // Clears second number only
          setSecondNumber("0");
          setButtons([["AC", ...buttons[0].slice(1)], ...buttons.slice(1)]);
        }
      } else {
        // All Clear
        setFirstNumber("");
        setSecondNumber("");
        setOperation("");
        setDisplayFirstNumber(true);
      }
    } else if (operators.includes(value)) {
      // Handles all operators excepts equals
      if (!operation) {
        // Adds operation if none in place
        setOperation(value);
        setDisplayFirstNumber(false);
      } else if (operation && !secondNumber) {
        // Changes operation if second number not input yet
        setOperation(value);
      } else {
        // Completes previous operation if second number inputted
        const op = operations.get(operation)!;
        setFirstNumber(op().toString());
        setSecondNumber("");
        setOperation(value);
      }
    } else if (value === "=") {
      // Handles equals operator by completing operation
      const op = operations.get(operation)!;
      setFirstNumber(op().toString());
      setDisplayFirstNumber(true);
      setSecondNumber("");
      setOperation("");
    } else if (!displayFirstNumber) {
      // Sets second number being inputted after firstNumber and operator added
      setSecondNumber(secondNumber + value);
    } else {
      // Updates firstNumber when displayFirstNumber
      setFirstNumber(firstNumber + value);
      if (buttons[0][0] === "AC") {
        // Updates All Clear to Clear as now there are values to the equation
        setButtons([["C", ...buttons[0].slice(1)], ...buttons.slice(1)]);
      }
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
