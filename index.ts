import { compressPngsInDir } from "./compress";
import { rmdirSync } from "fs";

function main() {
  const inputDir = "./input";
  const outputDir = "./output";

  // 清空输出目录
  rmdirSync(outputDir, { recursive: true });

  compressPngsInDir(inputDir, outputDir);
}

main();
