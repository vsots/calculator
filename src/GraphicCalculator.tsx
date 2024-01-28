import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FunctionInput from "./FunctionInput";
import "./GraphicCalculator.css";

function GraphicCalculator() {
  const [equation, setEquation]: (string | Dispatch<SetStateAction<string>>)[] =
    useState("x");

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

  function calculate(_x: number) {
    const evalEquation = (equation as string).replace(/x/gm, _x.toString());
    return eval(evalEquation);
  }

  function setData(
    x: number,
    y: number,
    data: [number, number][],
    width: number,
  ) {
    let calcX = 0;

    while (calcX < width + 1) {
      let _x = calcX;
      _x -= x;

      let calcY = calculate(_x);

      calcY *= -1;
      calcY += y;

      data.push([calcX, calcY]);
      calcX += 1;
    }
  }

  function plotData(data: [number, number][], graph: CanvasRenderingContext2D) {
    if (!data.length) return;
    graph.beginPath();
    graph.moveTo(data[0][0], data[0][1]);
    graph.strokeStyle = "rgba(0, 90, 230)";

    data.forEach(([x, y]) => graph.lineTo(x, y));

    graph.stroke();
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector(".grid")!;
    const graph: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const { innerWidth, innerHeight } = window;
    const responsiveWidth = Math.round(0.315 * innerWidth);
    const responsiveHeight = Math.round(0.456 * innerHeight);

    responsiveWidth % 2 === 0
      ? (canvas.width = responsiveWidth + 1)
      : (canvas.width = responsiveWidth);
    responsiveHeight % 2 === 0
      ? (canvas.height = responsiveHeight + 1)
      : (canvas.height = responsiveHeight);

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

    const data: [number, number][] = [];

    setData(x, y, data, width);
    plotData(data, graph);
  });

  return (
    <div className="graph-calc">
      <FunctionInput equation={equation} setEquation={setEquation} />
      <canvas className="grid" />
    </div>
  );
}

export default GraphicCalculator;
