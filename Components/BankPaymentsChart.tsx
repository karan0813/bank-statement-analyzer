import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BankPayment {
  bank: string;
  totalAmount: number;
  count: number;
}

interface BankPaymentsChartProps {
  data: BankPayment[];
}

const BankPaymentsChart: React.FC<BankPaymentsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.bank),
    datasets: [
      {
        label: "Total Amount",
        data: data.map((item) => item.totalAmount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        yAxisID: "y",
      },
      {
        label: "Transaction Count",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Total Amount (₹)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Transaction Count",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Bank Payments Summary",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BankPaymentsChart;
