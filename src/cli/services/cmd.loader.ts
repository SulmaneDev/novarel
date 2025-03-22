import { Command } from "commander";
import InspireCmd from "../cmd/inspire.cmd.js";
import InspireAction from "../action/inspire.action.js";

export default class CmdLoader {
    public static async load(cmd: Command): Promise<void> {
        await new InspireCmd(new InspireAction()).execute(cmd);
    }
}
