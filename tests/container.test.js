import { Container } from "../src/index.js"

describe('Container', () => {
    let container;

    beforeEach(() => {
        container = new Container();
    });

    afterEach(() => {
        container.reset();
    });


    it('should resolve a simple class', () => {
        container.bind('test', {
            useFactory: () => 'test',
        });
        const result = container.make('test');
        expect(result).toBe('test');
    });

    it('should resolve a class with dependencies', () => {
        class Test {
            static $injections = ['test'];

            constructor(test) {
                this.test = test;
            }
        }
        container.bind('test', {
            useFactory: () => 'test',
        });
        container.bind(Test, { useClass: Test });
        const result = container.make(Test);
        expect(result.test).toBe('test');
    });

    it('should resolve a class with $inject', () => {
        class Test {
            static $inject(app) {
                return [app.make('test')];
            };

            constructor(test) {
                this.test = test;
            }
        }
        container.bind('test', {
            useFactory: () => 'test',
        });
        container.bind(Test, { useClass: Test });
        const result = container.make(Test);
        expect(result.test).toBe('test');
    });

    it('should resolve a factory binding', () => {
        class Test {
            constructor(name) {
                this.name = name;
            }
        }
        container.bind('name', { useValue: "Novarel" });
        container.bind('factory', {
            useFactory: (app) => new Test(app.make('name')),
        });
        const result = container.make('factory');
        expect(result.name).toBe('Novarel');
    });

    it('should resolve itself', () => {
        container.instance(Container, container);
        const result = container.make(Container);
        expect(result).toBe(container);
    });

    it('should throw a circular dependency error', () => {

        container.bind('test', {
            useFactory: (app) => app.make('test'),
        });
        expect(() => container.make('test')).toThrow();
    });

});