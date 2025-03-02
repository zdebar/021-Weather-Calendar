import { writeFile } from "fs/promises"
import logger from "./logger";

export default async function saveJsonToFile(filename: string, data: unknown): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await writeFile(filename, jsonString, "utf8");
    logger.info("Data saved successfully.");
  } catch (error) {
    logger.error("Error saving data:", error);
  }
}
