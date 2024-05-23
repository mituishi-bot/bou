import React from "react";
import * as d3 from "d3";

function Chart({ data }) {
  const width = 1200;
  const height = 800;
  const barHeight = 20;
  const barPadding = 10;
  const labelPadding = 20;
  const axisX = 100;
  const labelOffset = 10;
  const legendX = width - 150;
  const legendY = 60;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const maxValue = Math.max(...data.series.flatMap((series) => series.values));
  const axisMaxValue = Math.ceil(maxValue / 100) * 100 + 100;

  const xScale = d3
    .scaleLinear()
    .domain([0, axisMaxValue])
    .range([axisX, width - 100]);

  const totalBarHeight = (barHeight + barPadding) * data.series.length;
  const contentHeight = (totalBarHeight + labelPadding) * data.labels.length;

  const axisY = contentHeight + 50;

  const labelScale = d3
    .scaleBand()
    .domain(data.labels)
    .range([0, contentHeight])
    .padding(0.1);

  const bars = data.series.flatMap((series, seriesIndex) =>
    series.values.map((value, i) => ({
      value,
      label: data.labels[i],
      color: color(seriesIndex),
      offset: seriesIndex * (barHeight + barPadding),
    }))
  );

  return (
    <svg width={width} height={height}>
      <line x1={axisX} y1={0} x2={axisX} y2={contentHeight} stroke="black" />

      <line
        x1={axisX}
        y1={axisY - 50}
        x2={width - 100}
        y2={axisY - 50}
        stroke="black"
      />

      <g>
        {bars.map(({ value, label, color, offset }, index) => {
          const y = labelScale(label) + offset;
          const barWidth = xScale(value) - axisX;
          return (
            <rect
              key={index}
              x={axisX}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
            />
          );
        })}
      </g>
      <g>
        {data.labels.map((label, i) => {
          const y = labelScale(label) + totalBarHeight / 2;
          return (
            <g key={i}>
              <line x1={axisX - 15} y1={y} x2={axisX} y2={y} stroke="black" />
              <text
                x={axisX - labelOffset * 2}
                y={y}
                alignmentBaseline="middle"
                textAnchor="end"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>

      <g>
        {Array.from({ length: axisMaxValue / 100 }, (_, i) => (
          <g key={i}>
            <line
              x1={xScale(i * 100)}
              y1={0}
              x2={xScale(i * 100)}
              y2={contentHeight}
              stroke="black"
            />
            <line
              x1={xScale(i * 100)}
              y1={axisY - 40}
              x2={xScale(i * 100)}
              y2={axisY - 50}
              stroke="black"
            />
            <text
              x={xScale(i * 100)}
              y={axisY - 20}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {i * 100}
            </text>
          </g>
        ))}
      </g>

      <g transform={`translate(${legendX}, ${legendY})`}>
        {data.series.map((series, i) => (
          <g key={i} transform={`translate(0, ${i * 30})`}>
            <rect width={20} height={20} fill={color(i)} />
            <text x={25} y={15} alignmentBaseline="middle">
              {series.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function App() {
  const data = {
    labels: ["A", "B", "C", "D"],
    series: [
      {
        name: "data",
        values: [123, 456, 789, 1111],
      },
      {
        name: "another data",
        values: [234, 567, 891, 1024],
      },
      {
        name: "and more",
        values: [567, 678, 789, 890],
      },
    ],
  };
  return <Chart data={data} />;
}

export default App;
