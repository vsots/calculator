import { useEffect } from "react";
import "./GraphicCalculator.css";

function GraphicCalculator() {
  type Direction = "up" | "down" | "left" | "right";

  const createAxis = (
    graph: CanvasRenderingContext2D,
    toChange: { x: number } | { y: number },
    x: number,
    y: number,
  ) => {
    function isX(obj: { x: number } | { y: number }): obj is { x: number } {
      return (obj as { x: number }).x !== undefined;
    }

    graph.strokeStyle = "#000";
    graph.lineWidth = 3;

    graph.beginPath();
    graph.moveTo(x, y);
    graph.lineTo(
      isX(toChange) ? toChange.x : x,
      isX(toChange) ? y : toChange.y,
    );
    graph.stroke();
  };

  const createGrid = (
    graph: CanvasRenderingContext2D,
    direction: Direction,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const gridSpacing = 15;
    let index = 0;
    let currentLine = direction === "up" || direction === "down" ? y : x;
    const drawOrNot = (line: number): boolean => {
      if (direction === "up") return line > 0;
      else if (direction === "down") return line < height;
      else if (direction === "left") return line > 0;
      else return line < width;
    };
    let draw = drawOrNot(currentLine);

    while (draw) {
      graph.strokeStyle =
        index % 5 === 0 ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.2)";
      graph.lineWidth = 1;
      if (direction === "up" || direction === "down") {
        graph.beginPath();
        graph.moveTo(0, currentLine);
        graph.lineTo(width, currentLine);
        graph.stroke();
      } else {
        graph.beginPath();
        graph.moveTo(currentLine, 0);
        graph.lineTo(currentLine, height);
        graph.stroke();
      }
      index++;
      if (direction === "up" || direction === "left")
        currentLine -= gridSpacing;
      else currentLine += gridSpacing;
      draw = drawOrNot(currentLine);
    }
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector(".grid")!;
    const graph: CanvasRenderingContext2D = canvas.getContext("2d")!;
    canvas.width = 445;
    canvas.height = 365;

    const { width, height } = canvas;
    const x = width / 2;
    const y = height / 2;

    graph.clearRect(0, 0, width, height);

    createAxis(graph, { x: width }, x, y);
    createAxis(graph, { x: 0 }, x, y);
    createAxis(graph, { y: height }, x, y);
    createAxis(graph, { y: 0 }, x, y);

    createGrid(graph, "up", x, y, width, height);
    createGrid(graph, "down", x, y, width, height);
    createGrid(graph, "left", x, y, width, height);
    createGrid(graph, "right", x, y, width, height);
  });

  return <canvas className="grid" />;
}

export default GraphicCalculator;
