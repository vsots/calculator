import { useRef, useEffect } from "react";
import "./GraphicCalculator.css";

function GraphicCalculator() {
  const graphCalc = useRef(null);

  const createAxis = (
    graph: CanvasRenderingContext2D,
    toChange: { x: number } | { y: number },
    x: number,
    y: number,
  ) => {
    graph.strokeStyle = "#000";
    graph.lineWidth = 2;
    function isX(obj: { x: number } | { y: number }): obj is { x: number } {
      return (obj as { x: number }).x !== undefined;
    }

    graph.beginPath();
    graph.moveTo(x, y);
    graph.lineTo(
      isX(toChange) ? toChange.x : x,
      isX(toChange) ? y : toChange.y,
    );
    graph.stroke();
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector(".grid")!;
    const graph: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const { width, height } = canvas;
    const x = width / 2;
    const y = height / 2;
    graph.clearRect(0, 0, width, height);

    graph.strokeStyle = "#000";
    graph.lineWidth = 2;

    createAxis(graph, { x: width }, x, y);
    createAxis(graph, { x: 0 }, x, y);
    createAxis(graph, { y: 0 }, x, y);
    createAxis(graph, { y: height }, x, y);
  });

  return <canvas className="grid" ref={graphCalc} />;
}

export default GraphicCalculator;
