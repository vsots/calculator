import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import FunctionInput from "./FunctionInput";
import "./GraphicCalculator.css";

function GraphicCalculator() {
  const [equation, setEquation]: (string | Dispatch<SetStateAction<string>>)[] =
    useState("x");
  const x: React.MutableRefObject<number> = useRef(0);
  const y: React.MutableRefObject<number> = useRef(0);
  const zoom: React.MutableRefObject<number> = useRef(1);
  const canvasElem: React.MutableRefObject<HTMLCanvasElement | null> =
    useRef(null);

  type Direction = "up" | "down" | "left" | "right";

  const createAxis = (
    graph: CanvasRenderingContext2D,
    toChange: { x: number } | { y: number },
  ) => {
    function isX(obj: { x: number } | { y: number }): obj is { x: number } {
      return (obj as { x: number }).x !== undefined;
    }

    graph.strokeStyle = "#000";
    graph.lineWidth = 3;

    graph.beginPath();
    graph.moveTo(x.current, y.current);
    graph.lineTo(
      isX(toChange) ? toChange.x : x.current,
      isX(toChange) ? y.current : toChange.y,
    );
    graph.stroke();
  };

  const calculateGridSpacing = (width: number, height: number): number => {
    const size = Math.max(width, height) / zoom.current;
    let gridSpacing = 0.025;

    const breakpoints = [
      0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 40, 50, 75, 100, 150, 200, 250,
      300, 400, 500, 1000, 2500, 10000, 25000, 50000, 100000,
    ];

    let i = 0;
    while (breakpoints[i] && breakpoints[i] < size / 4) {
      // ensures at least 4 grid cells on the major axis
      gridSpacing = breakpoints[i];
      i++;
    }

    return gridSpacing;
  };

  const createGrid = (
    graph: CanvasRenderingContext2D,
    gridSpacing: number,
    direction: Direction,
    width: number,
    height: number,
  ) => {
    let index = 0;
    let label = 0;
    let currentLine =
      direction === "up" || direction === "down" ? y.current : x.current;

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

      if (label !== 0 && index % 5 === 0) {
        if (direction === "down" || direction === "up") {
          graph.fillStyle = "black";
          graph.fillText(label.toString(), x.current + 3, currentLine - 3);
        } else {
          graph.fillStyle = "black";
          graph.fillText(label.toString(), currentLine + 2, y.current + 10);
        }
      }

      if (index % 5 === 0)
        label +=
          direction === "right" || direction === "up"
            ? gridSpacing
            : -gridSpacing;

      if (direction === "up" || direction === "left")
        currentLine -= (gridSpacing / 5) * zoom.current;
      else currentLine += (gridSpacing / 5) * zoom.current;

      index++;

      draw = drawOrNot(currentLine);
    }
  };

  function calculate(_x: number) {
    const evalEquation = (equation as string).replace(/x/gm, _x.toString());
    return eval(evalEquation);
  }

  function setData(data: [number, number][], width: number) {
    let calcX = 0;

    while (calcX < width + 1) {
      let _x = calcX;
      _x -= x.current;
      _x /= zoom.current;

      let calcY = calculate(_x);

      calcY *= -1;
      calcY *= zoom.current;
      calcY += y.current;

      data.push([calcX, calcY]);
      calcX += 1;
    }
  }

  function plotData(data: [number, number][], graph: CanvasRenderingContext2D) {
    if (!data.length) return;
    graph.beginPath();
    graph.moveTo(data[0][0], data[0][1]);
    graph.strokeStyle = "rgba(0, 90, 230)";
    graph.lineWidth = 1;

    data.forEach(([ptX, ptY]) => graph.lineTo(ptX, ptY));

    graph.stroke();
  }

  const plot = () => {
    const canvas: HTMLCanvasElement = canvasElem.current!;
    const graph: CanvasRenderingContext2D = canvas.getContext("2d")!;
    const { innerWidth, innerHeight } = window;
    const responsiveWidth = Math.round(0.5 * innerWidth);
    const responsiveHeight = Math.round(0.65 * innerHeight);

    responsiveWidth % 2 === 0
      ? (canvas.width = responsiveWidth + 1)
      : (canvas.width = responsiveWidth);
    responsiveHeight % 2 === 0
      ? (canvas.height = responsiveHeight + 1)
      : (canvas.height = responsiveHeight);

    const { width, height } = canvas;

    x.current = width / 2;
    y.current = height / 2;

    graph.clearRect(0, 0, width, height);

    createAxis(graph, { x: width });
    createAxis(graph, { x: 0 });
    createAxis(graph, { y: height });
    createAxis(graph, { y: 0 });

    const gridSpacing = calculateGridSpacing(width, height);

    createGrid(graph, gridSpacing, "up", width, height);
    createGrid(graph, gridSpacing, "down", width, height);
    createGrid(graph, gridSpacing, "left", width, height);
    createGrid(graph, gridSpacing, "right", width, height);

    const data: [number, number][] = [];

    setData(data, width);
    plotData(data, graph);
  };

  useEffect(() => {
    plot();
  });

  const handleScroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const { wheelDeltaY } = e.nativeEvent as WheelEvent;

    if (wheelDeltaY > 0) zoom.current = +(zoom.current * 1.05);
    else zoom.current = +(zoom.current / 1.05);

    plot();
  };

  return (
    <div className="graph-calc">
      <FunctionInput equation={equation} setEquation={setEquation} />
      <canvas
        ref={canvasElem}
        className="grid"
        onWheel={(e) => handleScroll(e)}
      />
    </div>
  );
}

export default GraphicCalculator;
