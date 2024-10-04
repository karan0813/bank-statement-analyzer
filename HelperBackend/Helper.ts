import { BankPaymentSummary, ExpenseData, Transaction } from "@/types";

export function extractDataFromPDF(text: string): ExpenseData {
  const lines = text.split("\n");
  const transactions: Transaction[] = [];
  const monthlyExpenses: { [key: string]: number } = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})/);

    if (dateMatch) {
      const date = dateMatch[1];
      let description = line.substring(dateMatch[0].length).trim();

      // Check if description continues on next line
      while (
        i + 1 < lines.length &&
        !lines[i + 1].match(/^\d{2}-\d{2}-\d{4}/)
      ) {
        i++;
        description += " " + lines[i].trim();
      }

      const amountMatch = description.match(/(\d+\.\d{2})\s*(DR|CR)$/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const type = amountMatch[2] as "CR" | "DR";
        description = description
          .substring(0, description.length - amountMatch[0].length)
          .trim();

        transactions.push({ date, description, amount, type });

        // Calculate monthly expenses
        const [day, month, year] = date.split("-");
        const monthYear = `${month}-${year}`;
        if (type === "DR") {
          monthlyExpenses[monthYear] =
            (monthlyExpenses[monthYear] || 0) + amount;
        }
      }
    }
  }

  // Sort months and create final arrays
  const sortedMonths = Object.keys(monthlyExpenses).sort();
  const months = sortedMonths.map((m) => {
    const [month, year] = m.split("-");
    return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      "default",
      { month: "long" }
    )} ${year}`;
  });
  const expenses = sortedMonths.map((m) => monthlyExpenses[m]);

  return { months, expenses };
}

export function extractDataFromPDFPAIChart(text: string): {
  months: string[];
  expenses: number[];
  paymentMethods: { [key: string]: number };
} {
  const lines = text.split("\n");
  const transactions: Transaction[] = [];
  const monthlyExpenses: { [key: string]: number } = {};
  const paymentMethods: { [key: string]: number } = {
    PhonePe: 0,
    "Google Pay": 0,
    Other: 0,
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})/);

    if (dateMatch) {
      const date = dateMatch[1];
      let description = line.substring(dateMatch[0].length).trim();

      // Check if description continues on next line
      while (
        i + 1 < lines.length &&
        !lines[i + 1].match(/^\d{2}-\d{2}-\d{4}/)
      ) {
        i++;
        description += " " + lines[i].trim();
      }

      const amountMatch = description.match(/(\d+\.\d{2})\s*(DR|CR)$/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const type = amountMatch[2] as "CR" | "DR";
        description = description
          .substring(0, description.length - amountMatch[0].length)
          .trim();

        let category: "PhonePe" | "Google Pay" | "Other" = "Other";
        if (description.includes("Ph/")) {
          category = "PhonePe";
        } else if (description.toLowerCase().includes("google pay")) {
          category = "Google Pay";
        }

        transactions.push({ date, description, amount, type, category });

        // Calculate monthly expenses
        const [day, month, year] = date.split("-");
        const monthYear = `${month}-${year}`;
        if (type === "DR") {
          monthlyExpenses[monthYear] =
            (monthlyExpenses[monthYear] || 0) + amount;
          paymentMethods[category] += amount;
        }
      }
    }
  }

  // Sort months and create final arrays
  const sortedMonths = Object.keys(monthlyExpenses).sort();
  const months = sortedMonths.map((m) => {
    const [month, year] = m.split("-");
    return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      "default",
      { month: "long" }
    )} ${year}`;
  });
  const expenses = sortedMonths.map((m) => monthlyExpenses[m]);

  return { months, expenses, paymentMethods };
}

export function extractDataFromPDFbankname(text: string): {
  months: string[];
  expenses: number[];
  bankPayments: BankPaymentSummary[];
} {
  const lines = text.split("\n");
  const transactions: Transaction[] = [];
  const monthlyExpenses: { [key: string]: number } = {};
  const bankPayments: { [key: string]: BankPaymentSummary } = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})/);

    if (dateMatch) {
      const date = dateMatch[1];
      let description = line.substring(dateMatch[0].length).trim();

      // Check if description continues on next lines
      while (
        i + 1 < lines.length &&
        !lines[i + 1].match(/^\d{2}-\d{2}-\d{4}/)
      ) {
        i++;
        description += " " + lines[i].trim();
      }

      const amountMatch = description.match(/(\d+\.\d{2})\s*(DR|CR)$/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const type = amountMatch[2] as "CR" | "DR";
        description = description
          .substring(0, description.length - amountMatch[0].length)
          .trim();

        // Extract bank name
        const bankMatch = description.match(/Ph\/.*?\/(.*?)\//);
        const bank = bankMatch ? bankMatch[1].trim() : "Unknown Bank";

        transactions.push({ date, description, amount, type, bank });

        // Calculate monthly expenses
        const [day, month, year] = date.split("-");
        const monthYear = `${month}-${year}`;
        if (type === "DR") {
          monthlyExpenses[monthYear] =
            (monthlyExpenses[monthYear] || 0) + amount;

          // Update bank payments
          if (!bankPayments[bank]) {
            bankPayments[bank] = { bank, totalAmount: 0, count: 0 };
          }
          bankPayments[bank].totalAmount += amount;
          bankPayments[bank].count += 1;
        }
      }
    }
  }

  // Sort months and create final arrays
  const sortedMonths = Object.keys(monthlyExpenses).sort();
  const months = sortedMonths.map((m) => {
    const [month, year] = m.split("-");
    return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      "default",
      { month: "long" }
    )} ${year}`;
  });
  const expenses = sortedMonths.map((m) => monthlyExpenses[m]);

  return {
    months,
    expenses,
    bankPayments: Object.values(bankPayments).sort(
      (a, b) => b.totalAmount - a.totalAmount
    ),
  };
}
