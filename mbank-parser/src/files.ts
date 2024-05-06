import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";
import { globSync } from "glob";
import { processContent } from "./content.js";

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
  const { csv, filename } = processContent(fileBinary);
  fs.writeFileSync(`${argv.outputDir}/${filename}.csv`, csv);
}
