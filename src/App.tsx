import { useState, useRef, MouseEvent } from "react";
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

  const operatorRefs: Map<string, React.MutableRefObject<null>> = new Map([
    ["+", plus],
    ["-", minus],
    ["x", multiply],
    ["/", divide],
  ]);

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

  const editInput = (e: MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) return;
    const value: string = e.target.value;
    if (value === "AC" || value === "C") {
      // Handles Clear and All Clear
      // Removes active operator style
      if (operation.current)
        operatorRefs.get(operation.current)!.current.style.border = "";
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
          operatorRefs.forEach((node) => (node.current.style.border = ""));
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
    } else if (value === "+/-") {
      if (displayFirstNumber) {
        firstNumber[0] === "-"
          ? setFirstNumber(firstNumber.substring(1))
          : setFirstNumber("-" + firstNumber);
      } else {
        secondNumber[0] === "-"
          ? setSecondNumber(secondNumber.substring(1))
          : setSecondNumber("-" + secondNumber);
      }
    } else if (value === "%") {
      if (displayFirstNumber) {
        setFirstNumber((parseFloat(firstNumber) / 100).toString());
      } else {
        setSecondNumber((parseFloat(secondNumber) / 100).toString());
      }
    } else if (operators.includes(value)) {
      // Reverts old operator to inactive styles
      if (operation.current)
        operatorRefs.get(operation.current)!.current.style.border = "";
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
      // Adds border to clicked operator to show operation
      operatorRefs.get(value)!.current.style.border = "0.2rem solid black";
    } else if (value === "=") {
      if (operation.current)
        operatorRefs.get(operation.current)!.current.style.border = "";

      // Handles equals operator by completing operation
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setDisplayFirstNumber(true);
      setSecondNumber("");
      operation.current = "";
    } else if (!displayFirstNumber) {
      // Sets second number being inputted after firstNumber and operator added
      if (value !== "." || (value === "." && !secondNumber.includes("."))) {
        setSecondNumber(secondNumber + value);
      }
    } else {
      // Updates firstNumber when displayFirstNumber
      if (value !== "." || (value === "." && !firstNumber.includes("."))) {
        setFirstNumber(firstNumber + value);
      }
      if (buttons[0][0] === "AC") {
        // Updates All Clear to Clear as now there are values to the equation
        setButtons([["C", ...buttons[0].slice(1)], ...buttons.slice(1)]);
      }
    }
  };

  return (
    <div className="calculator">
      <input
        type="text"
        value={
          displayFirstNumber ? firstNumber || "0" : secondNumber || firstNumber
        }
        readOnly={true}
      />
      {buttons.map((row) => {
        return (
          <div className="row">
            {row.map((button) => {
              return (
                <button
                  ref={
                    operatorRefs.has(button)
                      ? operatorRefs.get(button)!
                      : undefined
                  }
                  key={button}
                  className="item"
                  id={button === "0" ? "button-zero" : undefined}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => editInput(e)}
                  value={button}
                >
                  {button}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
