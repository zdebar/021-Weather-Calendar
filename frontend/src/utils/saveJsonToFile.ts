import { writeFile } from "fs/promises";

export default async function saveJsonToFile(filename: string, data: unknown): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2); // Pretty formatting
    await writeFile(filename, jsonString, "utf8");
    console.log(`File saved: ${filename}`);
  } catch (error) {
    console.error(`Error saving file: ${error}`);
    throw error;
  }
}
