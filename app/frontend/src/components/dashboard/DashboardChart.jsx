import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Mon",
    cpu: 45,
    memory: 60,
    network: 35,
  },
  {
    name: "Tue",
    cpu: 52,
    memory: 65,
    network: 40,
  },
  {
    name: "Wed",
    cpu: 49,
    memory: 68,
    network: 38,
  },
  {
    name: "Thu",
    cpu: 70,
    memory: 74,
    network: 48,
  },
  {
    name: "Fri",
    cpu: 62,
    memory: 70,
    network: 44,
  },
  {
    name: "Sat",
    cpu: 58,
    memory: 63,
    network: 42,
  },
  {
    name: "Sun",
    cpu: 50,
    memory: 61,
    network: 37,
  },
];

const DashboardChart = () => {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="cpu"
          stroke="#2563EB"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 7,
          }}
        />

        <Line
          type="monotone"
          dataKey="memory"
          stroke="#16A34A"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 7,
          }}
        />

        <Line
          type="monotone"
          dataKey="network"
          stroke="#EA580C"
          strokeWidth={3}
          dot={{
            r: 4,
          }}
          activeDot={{
            r: 7,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
