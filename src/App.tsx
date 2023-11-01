import "./App.css";

function App() {
  const buttons = [
    "AC",
    "+/-",
    "%",
    "÷",
    "7",
    "8",
    "9",
    "X",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  return (
    <>
      <input type="text" />
      {buttons.map((button) => (
        <button key={button}>{button}</button>
      ))}
    </>
  );
}

export default App;
