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

interface ExpenseData {
  months: string[];
  expenses: number[];
}

interface ExpenseGraphProps {
  data: ExpenseData;
}

const ExpenseGraph: React.FC<ExpenseGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: "Monthly Expenses",
        data: data.expenses,
        backgroundColor: "rgba(109, 40, 217, 0.6)",
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Expenses",
        font: {
          size: 20,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Expenses (₹)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      style={{ height: "400px" }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExpenseGraph;
