import { Dispatch, SetStateAction, FormEvent } from "react";
import "./FunctionInput.css";

function FunctionInput({
  equation,
  setEquation,
}: {
  equation: string;
  setEquation: Dispatch<SetStateAction<string>>;
}) {
  const runEquation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputBox: HTMLInputElement = e.currentTarget[1] as HTMLInputElement;
    setEquation(inputBox.value);
  };

  return (
    <form onSubmit={(e) => runEquation(e)}>
      <button id="function-button" type="submit">
        Submit
      </button>
      <input
        id="function-input"
        type="text"
        readOnly={false}
        placeholder={equation}
      />
    </form>
  );
}

export default FunctionInput;
