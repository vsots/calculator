import { useState, useRef, MouseEvent } from "react";

import "./BasicCalculator.css";

function BasicCalculator() {
  const buttons = [
    ["AC", "+/-", "%", "/"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const [displayFirstNumber, setDisplayFirstNumber] = useState(true);
  const [firstNumber, setFirstNumber] = useState("");
  const operation = useRef("");
  const clear = useRef(null);
  const plus = useRef(null);
  const minus = useRef(null);
  const multiply = useRef(null);
  const divide = useRef(null);

  const inputRefs: Map<string, React.MutableRefObject<null>> = new Map([
    ["AC", clear],
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
      () =>
        parseFloat(firstNumber || "0") /
        parseFloat(secondNumber || firstNumber || "0"),
    ],
    [
      "x",
      () =>
        parseFloat(firstNumber || "0") *
        parseFloat(secondNumber || firstNumber || "0"),
    ],
    [
      "+",
      () =>
        parseFloat(firstNumber || "0") +
        parseFloat(secondNumber || firstNumber || "0"),
    ],
    [
      "-",
      () =>
        parseFloat(firstNumber || "0") -
        parseFloat(secondNumber || firstNumber || "0"),
    ],
  ]);

  /**
   * Handles button input events and appropriately directs to a given function depending on the button's value.
   *
   * @param e - Button input event
   */
  const editInput = (e: MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) return;
    const value: string = e.target.value;
    if (value === "AC" || value === "C") clearAllClearInput(value);
    else if (value === "+/-") plusMinusInput();
    else if (value === "%") percentInput();
    else if (operators.includes(value)) setOperator(value);
    else if (value === "=") equalsInput();
    else integerAndDecimalInput(value);
  };

  /**
   * Handles clear (C) and all clear (AC) button input.
   * If "C", there are three possible cases to handle
   *    1. The user has not committed any operation, or they completed an operation already. This means firstNumber is the active value being inputted.
   *       In this case, the firstNumber is set to empty string.
   *    2. The user has committed an operation, but has not inputted the secondNumber.
   *       In this case, the active operation styles are removed, the operation is set to empty string, and the user returns to editting firstNumber.
   *    3. The user has committed a firstNumber, an operation, and has inputted a secondNumber, but has not completed the operation.
   *       In this case, the secondNumber is set to "0". The firstNumber and operation values remain the same as their previous state.
   *       The user is still editting secondNumber.
   *
   *    In all three cases, the user the button containing the value "C" gets switched to "AC".
   *
   * If "AC", the operation, operation active styles, firstNumber, and secondNumber get set to empty string.
   *
   * @param value - String "C" or "AC".
   */
  const clearAllClearInput = (value: string) => {
    if (value === "C") {
      if (displayFirstNumber) setFirstNumber("");
      else if (operation.current && !secondNumber) {
        inputRefs.get(operation.current)!.current.style.border = "";
        operation.current = "";
        setDisplayFirstNumber(true);
      } else setSecondNumber("0");

      clear.current.value = "AC";
      clear.current.innerText = "AC";
    } else {
      if (operation.current)
        inputRefs.get(operation.current)!.current.style.border = "";
      setFirstNumber("");
      setSecondNumber("");
      operation.current = "";
      setDisplayFirstNumber(true);
    }
  };

  /**
   * Handles the negation (+/-) button input.
   * If firstNumber is active, it gets negated. Otherwise, secondNumber gets negated.
   */
  const plusMinusInput = () => {
    if (displayFirstNumber) {
      firstNumber[0] === "-"
        ? setFirstNumber(firstNumber.substring(1))
        : setFirstNumber("-" + firstNumber);
    } else {
      secondNumber[0] === "-"
        ? setSecondNumber(secondNumber.substring(1))
        : setSecondNumber("-" + secondNumber);
    }
  };

  /**
   * Handles the percent (%) button input.
   * If firstNumber is active, it is set as a percent in decimal form. Otherwise, secondNumber is set a percent in decimal form.
   */
  const percentInput = () => {
    if (displayFirstNumber) {
      setFirstNumber((parseFloat(firstNumber) / 100).toString());
    } else {
      setSecondNumber((parseFloat(secondNumber) / 100).toString());
    }
  };

  /**
   * Handles button input that is in operators array (["/", "x", "-", "+"]).
   * There are two cases to handle for the operator input:
   *
   * In both cases, the active styles for the current operation (if one has been selected are removed)
   *    1. No operation is currently selected or a new operation value is being selected with secondNumber not being inputted.
   *       In this case, the operation selected is saved or overrides the previous operation and the user will now input secondNumber
   *    2. secondNumber has already been inputted.
   *       In this case, the previous operation gets completed with the result being set to firstNumber. The operation selected is saved and the user will now input secondNumber.
   *
   * @param value - String that is in operators array (["/", "x", "-", "+"]).
   */
  const setOperator = (value: string) => {
    if (operation.current)
      inputRefs.get(operation.current)!.current.style.border = "";

    if (!operation.current || (operation.current && !secondNumber)) {
      operation.current = value;
      setDisplayFirstNumber(false);
    } else {
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setSecondNumber("");
      operation.current = value;
    }

    inputRefs.get(value)!.current.style.border = "0.2rem solid black";
  };

  /**
   * Handles equals (=) input
   * Completes the operation of firstNumber, operation.current, and secondNumber selected (if any). The result is set as firstNumber. User is now editting firstNumber.
   */
  const equalsInput = () => {
    if (operation.current) {
      inputRefs.get(operation.current)!.current.style.border = "";
      const op = operations.get(operation.current)!;
      setFirstNumber(op().toString());
      setDisplayFirstNumber(true);
      setSecondNumber("");
      operation.current = "";
    }
  };

  /**
   * Handles integer (0-9) and decimal (.) input
   * Sets firstNumber or secondNumber depending on which one is currently being displayed. Ensures decimal is only added once.
   * Errant zeros (i.e. 00000006) are ensured to be removed by parsing the string to a float first and then converting it back to a string.
   * If "AC" was being displayed, the value and text are changed to "C".
   *
   * @param value - string that is decimal or integer
   */
  const integerAndDecimalInput = (value: string) => {
    if (
      value !== "." ||
      (value === "." && !firstNumber.includes(".")) ||
      (value === "." && !secondNumber.includes("."))
    ) {
      displayFirstNumber
        ? setFirstNumber(
            value === "."
              ? (firstNumber || "0") + value
              : parseFloat(firstNumber + value).toString(),
          )
        : setSecondNumber(
            value === "."
              ? (secondNumber || "0") + value
              : parseFloat(secondNumber + value).toString(),
          );
    }
    if (clear.current.value === "AC") {
      clear.current.value = "C";
      clear.current.innerText = "C";
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
      {buttons.map((row, rowIdx) => {
        return (
          <div className="row" key={rowIdx.toString()}>
            {row.map((button) => {
              return (
                <button
                  ref={
                    inputRefs.has(button) ? inputRefs.get(button)! : undefined
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

export default BasicCalculator;
