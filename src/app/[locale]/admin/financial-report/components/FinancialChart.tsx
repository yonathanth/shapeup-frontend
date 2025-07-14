import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const FinancialChart = ({ data }: { data: any[] }) => {
  // Custom tooltip renderer
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#121212",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "12px",
            color: "#fff",
          }}
        >
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} Birr
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} width={970} height={300}>
        <CartesianGrid
          stroke="#333"
          strokeDasharray="4 4"
          strokeOpacity={0.3}
        />
        <XAxis dataKey="period" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#00ff00"
          strokeWidth={2}
          dot={{ r: 4, fill: "#00ff00" }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ff0000"
          strokeWidth={2}
          dot={{ r: 4, fill: "#ff0000" }}
          name="Expense"
        />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#00bfff"
          strokeWidth={3}
          dot={{ r: 5, fill: "#00bfff" }}
          name="Net"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinancialChart;
