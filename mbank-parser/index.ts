import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";
import { globSync } from "glob";
// @ts-ignore
import { decode } from "windows-1250";
import { DateTime } from "luxon";
import Papa from "papaparse";

interface Args {
  inputDir: string;
  outputDir: string;
}

const argv = yargs(hideBin(process.argv))
  .option("inputDir", {
    alias: "i",
    default: "./input",
  })
  .option("outputDir", {
    alias: "o",
    default: "./output",
  })
  .parseSync() satisfies Args;

fs.mkdirSync(argv.inputDir, { recursive: true });
fs.mkdirSync(argv.outputDir, { recursive: true });

const inputFilePaths = globSync(`${argv.inputDir}/**/*.csv`);

inputFilePaths.forEach(processFile);

function processFile(path: string) {
  const fileBinary = fs.readFileSync(path, { encoding: "binary" });
  const file = decode(fileBinary) as string;
  const parts = file.replaceAll("\r", "").split("\n");

  const interval = parts[14].split(";");

  const fullName = parts[9].split(";")[0].replaceAll(" ", "_");
  const from = DateTime.fromFormat(interval[0], "dd.MM.yyyy").toISODate();
  const to = DateTime.fromFormat(interval[1], "dd.MM.yyyy").toISODate();
  const accountName = parts[16].split(";")[0].replaceAll(" ", "_");
  const currency = parts[18].split(";")[0].replaceAll(" ", "_");
  const lastIBAN = parts[20].split(";")[0].replaceAll(" ", "").trim().slice(-4);

  const resultFile = `${fullName}_${accountName}_${lastIBAN}_${currency}_${from}_${to}`;

  const csv = parts.slice(38, -5).join("\n");
  const parsed = Papa.parse<string[]>(csv, { delimiter: ";", header: false });

  const mapped = parsed.data.map(processRecord);

  const csvSerialized = Papa.unparse(mapped);

  fs.writeFileSync(`${argv.outputDir}/${resultFile}.csv`, csvSerialized);
}

function processRecord(record: string[]): Record<string, string> {
  record[3];

  let payee = record[3].split("   ")[0].replaceAll(/\s{2,}/gi, " ");
  if (record[2].startsWith("PRZELEW "))
    payee = `${record[4].trim().replaceAll(/\s{2,}/gi, " ")} (XXX ${record[5]
      .replaceAll("'", "")
      .trim()
      .replaceAll(/\s{2,}/gi, " ")
      .slice(-4)})`;

  let notes = record[2];
  if (record[2].startsWith("PRZELEW ")) notes = record[3];

  return {
    date: record[0],
    payee: payee.trim(),
    notes: notes.trim(),
    amount: record[6],
  };
}
