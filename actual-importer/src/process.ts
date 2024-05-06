import * as api from "@actual-app/api";

interface ActualRow {
  date: string;
  payee_name: string;
  notes: string;
  amount: number;
}

interface ActualParseResult {
  filename: string;
  lastIBAN: string;
  currency: string;
  data: ActualRow[];
  csv: string;
}

export async function importResult(result: ActualParseResult) {
  console.log("Downloading budget...");

  console.log("Getting accounts...");
  const accounts = await api.getAccounts();

  const importAccount = accounts.filter(
    (account: any) =>
      account.name.includes(result.lastIBAN) &&
      account.name.includes(result.currency)
  )[0];

  if (!importAccount)
    throw new Error(
      `Account for IBAN(${result.lastIBAN}) and currency(${result.currency}) not found!`
    );

  console.log("Importing transactions...");
  return await api.importTransactions(importAccount.id, result.data);
}
