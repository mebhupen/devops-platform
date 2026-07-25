import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", cpu: 32, memory: 45 },
  { day: "Tue", cpu: 48, memory: 50 },
  { day: "Wed", cpu: 40, memory: 52 },
  { day: "Thu", cpu: 60, memory: 58 },
  { day: "Fri", cpu: 52, memory: 63 },
  { day: "Sat", cpu: 38, memory: 47 },
  { day: "Sun", cpu: 46, memory: 55 },
];

function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="cpu"
          stroke="#2563eb"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="memory"
          stroke="#22c55e"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DashboardChart;
