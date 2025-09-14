"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  CartesianGrid,
} from "recharts";

type RoiPoint = { rooms: number; roi: number };

export function RoiVsRooms({ data, currentRooms }: { data: RoiPoint[]; currentRooms: number }) {
  const maxPoint = data && data.length
    ? data.reduce((a, b) => (b.roi > a.roi ? b : a), data[0])
    : { rooms: 0, roi: 0 };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="rooms"
            label={{ value: "Rooms", position: "insideBottom", dy: 12 }}
          />
          <YAxis
            tickFormatter={(v: number) => `${(Number(v) * 100).toFixed(0)}%`}
            label={{ value: "ROI (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => [`${(Number(value) * 100).toFixed(1)}%`, "ROI"]}
            labelFormatter={(label) => `Rooms: ${label}`}
          />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#F97316"
            strokeWidth={2}
            dot={false}
            name="ROI vs Rooms"
          />
          {currentRooms ? (
            <ReferenceLine x={currentRooms} stroke="#94a3b8" strokeDasharray="4 2" label={{ value: "Current", position: "top" }} />
          ) : null}
          {maxPoint && maxPoint.rooms ? (
            <ReferenceDot x={maxPoint.rooms} y={maxPoint.roi} r={5} fill="#F97316" stroke="none" label={{ value: "Peak ROI", position: "top" }} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
