import { Command } from "commander";
import AbstractAction from "../action/abstract.action.js";

export default abstract class AbstractCmd {
    constructor(protected action: AbstractAction) {}

    abstract execute(cmd: Command): Promise<any>;
}

