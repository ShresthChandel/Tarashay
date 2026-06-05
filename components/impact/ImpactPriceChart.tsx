"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const DATA = [
  { year: "2018", price: 90 },
  { year: "2019", price: 120 },
  { year: "2020", price: 180 },
  { year: "2021", price: 280 },
  { year: "2022", price: 420 },
  { year: "2023", price: 580 },
  { year: "2024", price: 720 },
  { year: "2025", price: 850 },
  { year: "2026", price: 900 },
];

export function ImpactPriceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-lg border border-heritage-brown/10 bg-off-white p-6"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={DATA} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F15" />
          <XAxis dataKey="year" tick={{ fill: "#3D2B1F", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#3D2B1F", fontSize: 12 }}
            label={{
              value: "₹/kg",
              angle: -90,
              position: "insideLeft",
              fill: "#3D2B1F99",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#F5ECD7",
              border: "1px solid #D4A017",
              borderRadius: 4,
            }}
            formatter={(value) => [
              `₹${Number(value ?? 0)}/kg`,
              "Price",
            ]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#C8860A"
            strokeWidth={2}
            dot={{ fill: "#C8860A", r: 4 }}
          />
          <ReferenceDot
            x="2018"
            y={90}
            r={6}
            fill="#C8860A"
            label={{ value: "₹90/kg", position: "top", fill: "#3D2B1F" }}
          />
          <ReferenceDot
            x="2026"
            y={900}
            r={6}
            fill="#C8860A"
            label={{
              value: "₹900/kg — 10× increase",
              position: "top",
              fill: "#3D2B1F",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-4 text-center text-xs text-heritage-brown/50">
        Raw areca nut (supari) price per kg. Source: Kunder family records.
      </p>
    </motion.div>
  );
}
