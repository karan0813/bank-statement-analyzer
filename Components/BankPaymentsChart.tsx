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
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Transaction Count",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Total Amount (₹)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          callback: (value: number) => "₹" + value.toLocaleString(),
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
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          stepSize: 1,
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
        font: {
          size: 16,
          weight: "bold", // Change this to 'bold', 'normal', or a number (e.g., 400, 700)
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                context.datasetIndex === 0
                  ? "₹" + context.parsed.y.toLocaleString()
                  : context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="h-[500px] w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BankPaymentsChart;
