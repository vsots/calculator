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

  const [operation, setOperation] = useState(0);

  const editInput = (e) => setOperation(operation + e.target.innerText);

  return (
    <>
      <input type="text" value={operation} readOnly={true} />
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
