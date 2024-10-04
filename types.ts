export interface ExpenseData {
  months: string[];
  expenses: number[];
}
export interface Transaction {
  date?: string;
  description?: string;
  amount?: number;
  type?: "CR" | "DR";
  category?: "PhonePe" | "Google Pay" | "Other";
  bank?: string;
}

export interface BankPaymentSummary {
  bank: string;
  count: number;
  totalAmount: number;
}

export interface PaymentMethods {
  months: string[];
  expenses: number[];
  paymentMethods: { [key: string]: number };
}
