import fs from "fs";
import path from "path";

const logPath = path.resolve("database/product.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

export function log(message) {
    const date = new Date().toISOString();
    logStream.write(`[${date}] ${message}\n`);
}