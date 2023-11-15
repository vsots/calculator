import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [buttons, setButtons] = useState([
    ["AC", "+/-", "%", "/"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]);

  const [displayFirstNumber, setDisplayFirstNumber] = useState(true);
  const [firstNumber, setFirstNumber] = useState("");
  const operation = useRef("");
  const plus = useRef(null);
  const minus = useRef(null);
  const multiply = useRef(null);
  const divide = useRef(null);

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
    console.log(e.target);
    e.preventDefault();
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
          operation.current = "";
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
        operation.current = "";
        setDisplayFirstNumber(true);
      }
    } else if (operators.includes(value)) {
      if (value === "+") {
        plus.current.style = {};
      }
      // Handles all operators excepts equals
      if (!operation.current) {
        // Adds operation if none in place
        operation.current = value;
        setDisplayFirstNumber(false);
      } else if (operation.current && !secondNumber) {
        // Changes operation if second number not input yet
        operation.current = value;
      } else {
        // Completes previous operation if second number inputted
        const op = operations.get(operation.current)!;
        setFirstNumber(op().toString());
        setSecondNumber("");
        operation.current = value;
      }
    } else if (value === "=") {
      // Handles equals operator by completing operation
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setDisplayFirstNumber(true);
      setSecondNumber("");
      operation.current = "";
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
            {row.map((button) =>
              button === "+" ? (
                <button
                  ref={plus}
                  key={button}
                  className=":active"
                  style={{ outline: "none", userSelect: "none" }}
                  onClick={(e) => editInput(e)}
                  value={button}
                >
                  {button}
                </button>
              ) : (
                <button
                  key={button}
                  style={{ outline: "none", userSelect: "none" }}
                  onClick={(e) => editInput(e)}
                  value={button}
                >
                  {button}
                </button>
              ),
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
