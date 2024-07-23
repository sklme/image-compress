import { readdir, readFile, writeFile, stat, mkdir } from "fs/promises";
import sharp from "sharp";
import { join, dirname } from "path";

// 压缩单个png
export async function compressPng(inputPath: string, outputPath: string) {
  try {
    const data = await readFile(inputPath);
    // 压缩
    const compressData = await sharp(data)
      .png({
        compressionLevel: 9,
        // force: true,
        quality: 10,
      })
      .toBuffer();

    await mkdir(dirname(outputPath), { recursive: true }); // 确保目录存在
    await writeFile(outputPath, compressData);

    // 输出压缩信息
    console.log();
    console.log(`Compressed: ${inputPath} -> ${outputPath}`);

    // 输出压缩率
    const inputSize = data.byteLength;
    const outputSize = compressData.byteLength;
    console.log(
      `Compressed size: ${inputSize} -> ${outputSize} (${(
        (outputSize / inputSize) *
        100
      ).toFixed(2)}%)`
    );
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}

// 压缩文件夹内的所有png文件
export async function compressPngsInDir(
  dirPath: string,
  outputDirPath: string
) {
  try {
    // 所有文件
    const files = await readdir(dirPath);

    // 开始读取文件
    for (const file of files) {
      const filePath = join(dirPath, file);
      const outputFilePath = join(outputDirPath, file);

      // 查看文件类型
      const fileStat = await stat(filePath);

      // 如果是文件夹，递归
      if (fileStat.isDirectory()) {
        await compressPngsInDir(filePath, outputFilePath);
      } else {
        // 如果是文件，压缩
        if (file.endsWith(".png")) {
          await compressPng(filePath, outputFilePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
}
