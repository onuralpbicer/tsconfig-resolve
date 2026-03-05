import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

export async function findNearestTsConfig(
    filepath: string,
    workspaceRoot: string,
) {
    console.log("filepath", filepath);
    console.log("workspaceRoot", workspaceRoot);

    const relativeFile = path.relative(workspaceRoot, filepath);

    const rootDir = path.dirname(workspaceRoot);
    let dir = path.dirname(filepath);
    let tsConfig = "";

    do {
        const dirContents = await fs.readdir(dir);

        for (const file of dirContents) {
            const stat = await fs.stat(path.join(dir, file));
            console.log("checking", path.join(dir, file));

            if (stat.isDirectory()) continue;

            const candidate = path.join(dir, file);
            if (
                file.startsWith("tsconfig") &&
                file.endsWith(".json") &&
                (await verifyTsConfigOnFile(relativeFile, candidate))
            ) {
                tsConfig = candidate;
                break;
            }
        }

        dir = path.resolve(dir, "..");
    } while (!tsConfig && rootDir !== dir);

    console.log(
        "ts package...",
        ts.findConfigFile(filepath, ts.sys.fileExists),
    );

    console.log(
        "ts package...",
        ts.findConfigFile(filepath, ts.sys.fileExists, "tsconfig.app.json"),
    );

    console.log(
        "ts package...",
        ts.findConfigFile(filepath, ts.sys.fileExists, "tsconfig.spec.json"),
    );

    console.log(
        "spec files",
        (
            await readTsConfigFile(
                ts.findConfigFile(
                    filepath,
                    ts.sys.fileExists,
                    "tsconfig.spec.json",
                )!,
            )
        ).fileNames,
    );

    console.log(
        "app files",
        (
            await readTsConfigFile(
                ts.findConfigFile(
                    filepath,
                    ts.sys.fileExists,
                    "tsconfig.spec.json",
                )!,
            )
        ).fileNames,
    );

    console.log(
        "normal config files",
        (
            await readTsConfigFile(
                ts.findConfigFile(
                    filepath,
                    ts.sys.fileExists,
                    "tsconfig.json",
                )!,
            )
        ).fileNames,
    );

    return tsConfig;
}

export async function verifyTsConfigOnFile(
    relativePath: string,
    tsConfig: string,
) {
    // todo: check if this tsconfig file actually applies to the current file
    const tsConfigJson = await readTsConfigFile(tsConfig);

    // console.log(tsConfigJson.fileNames); // wow...
    return false;
}

export async function readTsConfigFile(tsConfig: string) {
    const tsConfigDir = path.dirname(tsConfig);

    return ts.parseJsonConfigFileContent(
        JSON.parse(await fs.readFile(tsConfig, "utf-8")),
        ts.sys,
        tsConfigDir,
    );
}
