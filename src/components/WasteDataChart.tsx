import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WasteDataChartProps {
  data: {
    time: string;
    value: number;
  }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
  title?: string;
}

const WasteDataChart: React.FC<WasteDataChartProps> = ({
  data,
  colors = {
    backgroundColor: "white",
    lineColor: "#2962FF",
    textColor: "black",
    areaTopColor: "rgba(41, 98, 255, 0.56)",
    areaBottomColor: "rgba(41, 98, 255, 0.04)",
  },
  title = "Pengelolaan Sampah (dalam ton/tahun)",
}) => {
  const formattedData = data.map((item) => ({
    time: item.time,
    value: item.value,
    // Jika perlu format nilai (misalnya untuk jutaan ton)
    formattedValue: (item.value / 1000000).toFixed(2),
  }));

  return (
    <div className="w-full h-[300px] relative bg-white p-4 rounded-lg">
      <div className="text-center font-bold mb-4">{title}</div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={formattedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip
            formatter={(value) => [
              `${(Number(value) / 1000000).toFixed(2)} juta ton`,
              "Jumlah",
            ]}
            labelFormatter={(label) => `Tahun ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.lineColor}
            fill={colors.areaTopColor}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WasteDataChart;
