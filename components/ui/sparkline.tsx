"use client";

import { LineChart, Line } from "recharts";
import type { PricePoint } from "@/types";

type SparklineProps = {
  data: PricePoint[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 60,
  height = 20,
  color = "var(--color-ink-secondary)",
  className = "",
}: SparklineProps) {
  const chartData = data.map((d) => ({ p: d.p }));

  return (
    <div className={className} style={{ width, height, minWidth: width, minHeight: height }}>
      <LineChart width={width} height={height} data={chartData}>
        <Line
          type="monotone"
          dataKey="p"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          strokeLinecap="round"
          strokeLinejoin="round"
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}
