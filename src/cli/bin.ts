#!/usr/bin/env node

import { Command } from "commander";
import { getVersion } from "./lib/versions.js";
import CmdLoader from "./services/cmd.loader.js";

async function bootstrap() {
    const cmd = new Command();
    cmd
    .name("novarel")
    .version(await getVersion())
    .description("A advance and professional for novarel apps.")

    await CmdLoader.load(cmd);
    await cmd.parseAsync(process.argv);
}

await bootstrap();