export type Input = Record<string, any>;
export default abstract class AbstractAction {
    public abstract run(inputs?: Input[], flags?: Input[]): any;
}
