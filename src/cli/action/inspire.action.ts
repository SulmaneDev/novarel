import { programmingQuotes } from "../lib/qoutes.js";
import AbstractAction from "./abstract.action.js";
import { green } from "ansis";

export default class InspireAction extends AbstractAction {
    public async run() {
        const quote =
            programmingQuotes[
                Math.floor(Math.random() * programmingQuotes.length)
            ];
        if (!quote) {
            this.run();
        }
        console.log("\n" + green(quote) + "\n");
        process.exit(1);
    }
}
