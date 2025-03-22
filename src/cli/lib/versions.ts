import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export async function getVersion(): Promise<string> {
    try {
        return JSON.parse(
            (await readFile(
                join(
                    dirname(fileURLToPath(import.meta.url)),
                    "..",
                    "..",
                    "..",
                    "..",
                    "package.json",
                ),
                { encoding: "utf8" },
            )) as string,
        )?.version;
    } catch (error) {
        throw  error;
    }
}
