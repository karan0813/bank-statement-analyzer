import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ExpenseData {
  months: string[];
  expenses: number[];
}
interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "CR" | "DR";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable();

  try {
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = await fs.readFile(file.filepath);
    const data = await pdf(buffer);
    console.log("data", data);
    const extractedData = extractDataFromPDF(data.text);

    res.status(200).json(extractedData);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
}

function extractDataFromPDF(text: string): ExpenseData {
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
