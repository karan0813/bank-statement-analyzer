"use client";
import ExpenseGraph from "@/Components/ExpenseGraph";
import FileUpload from "@/Components/FileUpload";
import React, { useEffect, useState } from "react";

interface ExpenseData {
  months: string[];
  expenses: number[];
}

const Home: React.FC = () => {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);

  const handleFileUpload = (data: ExpenseData) => {
    setExpenseData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full px-2 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-center text-violet-800">
              Bank Statement Analyzer
            </h1>
            <FileUpload onFileUpload={handleFileUpload} />
            {expenseData && (
              <div className="mt-12">
                <ExpenseGraph data={expenseData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
