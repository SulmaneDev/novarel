import { Command } from "commander";
import AbstractCmd from "./abstract.cmd.js";

export default class InspireCmd extends AbstractCmd {
    async execute(cmd: Command): Promise<any> {
        cmd.
            command("inspire")
            .description("Prints a inspiring quote on console")
            .version("1.0.0")
            .action(() => {
                this.action.run();
            });
    }
}
