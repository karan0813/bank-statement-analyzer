"use client";

import BankPaymentsChart from "@/Components/BankPaymentsChart";
import ExpenseGraph from "@/Components/ExpenseGraph";
import FileUpload from "@/Components/FileUpload";
import PaymentMethodsPieChart from "@/Components/PaymentMethodsPieChart";
import { ExpenseData } from "@/types";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<{
    [key: string]: number;
  } | null>(null);
  const [bankPaymentData, setBankPaymentData] = useState<{
    [key: string]: number;
  } | null>(null);

  // @ts-ignore
  const handleFileUpload = (data) => {
    setExpenseData(data.extractedData);
    setPaymentMethods(data.extractedDataPaiChart);
    setBankPaymentData(data.BankPaymentname);
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
              <div className="mt-12 space-y-8">
                <ExpenseGraph data={expenseData} />
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-violet-800">
                    Payment Methods Distribution
                  </h2>
                  <PaymentMethodsPieChart data={paymentMethods} />
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-violet-800">
                    Payment Methods Distribution
                  </h2>
                  <BankPaymentsChart
                    data={Array.isArray(bankPaymentData) ? bankPaymentData : []}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
