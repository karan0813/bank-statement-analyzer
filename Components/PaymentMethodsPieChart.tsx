import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethodsPieChartProps {
  data: { [key: string]: number } | null | undefined;
}

const PaymentMethodsPieChart: React.FC<PaymentMethodsPieChartProps> = ({
  data,
}) => {
  // Provide a default empty object if data is null or undefined
  const safeData = data || {};

  const chartData = {
    labels: Object.keys(safeData),
    datasets: [
      {
        data: Object.values(safeData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Payment Methods Distribution",
      },
    },
  };

  // Only render the chart if there's data
  if (Object.keys(safeData).length === 0) {
    return <p>No payment method data available</p>;
  }

  return <Pie data={chartData} options={options} />;
};

export default PaymentMethodsPieChart;
