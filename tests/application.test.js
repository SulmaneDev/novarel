import { Application } from "../src/index.js";

describe("Application", () => {
    let app;
    beforeEach(() => {
        app = new Application(process.cwd());
    });
    afterEach(() => {
        app.reset();
    });
    it('Should boots up the application', async () => {
        await app.boot();
        expect(true).toBe(true);
    });

    it('should register a provider', async () => {
        let events = [];
        const testProvider = {
            register: (application) => {
                events.push('register');
            },
            boot: (application) => {
                events.push('boot');
            }
        };
        app.provide(testProvider);
        await app.boot();
        expect(events).toEqual(['register', 'boot']);
    });

    it('Should have base binding', () => {
        expect(app.get('BASE_PATH')).toBe(process.cwd());
    });
});