import { ResponsiveBar, ResponsiveBarSvgProps } from "@nivo/bar";

enum Keys {
  title = "title",
  raw = "raw",
  pval = "prevalanced",
}

export type BarDatum = {
  [k in Keys]: string | number;
};

export default function BarChart({ data }: ResponsiveBarSvgProps<BarDatum>) {
  return (
    <ResponsiveBar
      theme={{
        tooltip: {
          container: {
            background: "#000a",
            borderRadius: 14,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
        },
        axis: {
          ticks: { text: { fill: "white" } },
        },
        grid: {
          line: { stroke: "#fff1" },
        },
      }}
      data={data}
      keys={[Keys.raw, Keys.pval]}
      indexBy={Keys.title}
      margin={{ top: 80, right: 0, bottom: 50, left: 0 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "accent" }}
      defs={[
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#ee7c1222",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: { id: Keys.pval },
          id: "lines",
        },
      ]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 8,
        tickPadding: 5,
        renderTick({ x, y, value }) {
          const text = value as string;
          const truncate = 12;
          const maxLength = truncate * 2 - 3;
          const slice0 = text.slice(0, truncate);
          const slice1 = text.slice(truncate, maxLength);
          const ellipsis = text.length > maxLength ? "..." : "";
          return (
            <g transform={`translate(${x},${y})`}>
              <text
                dominant-baseline="central"
                text-anchor="middle"
                transform="translate(0,13)"
                style={{ fill: "white", fontSize: "11px", outlineWidth: "0px", outlineColor: "transparent" }}>
                {slice0}
              </text>
              {slice1.length && (
                <text
                  dominant-baseline="central"
                  text-anchor="middle"
                  transform="translate(0,28)"
                  style={{ fill: "white", fontSize: "11px", outlineWidth: "0px", outlineColor: "transparent" }}>
                  {slice1 + ellipsis}
                </text>
              )}
            </g>
          );
        },
      }}
      axisLeft={null}
      valueFormat=" >-1.0%"
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 3]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "top-right",
          direction: "column",
          justify: false,
          translateX: 0,
          translateY: -70,
          itemsSpacing: 4,
          itemWidth: 100,
          itemHeight: 18,
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 12,
          symbolShape: "circle",
          itemTextColor: "white",
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
    />
  );
}
