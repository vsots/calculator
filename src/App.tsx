import "./App.css";

function App() {
  const buttons = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <>
      <input type="text" />
      <div className="column">
        {buttons.map((row) => (
          <div>
            {row.map((button) => (
              <button key={button}>{button}</button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
