import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import pdf from "pdf-parse";
import {
  extractDataFromPDF,
  extractDataFromPDFbankname,
  extractDataFromPDFPAIChart,
} from "@/HelperBackend/Helper";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const extractedData = extractDataFromPDF(data.text);
    const extractedDataPaiChart = extractDataFromPDFPAIChart(data.text);
    const BankPaymentname = extractDataFromPDFbankname(data.text);

    res.status(200).json({
      extractedData,
      extractedDataPaiChart: extractedDataPaiChart.paymentMethods,
      BankPaymentname: BankPaymentname.bankPayments,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
}
