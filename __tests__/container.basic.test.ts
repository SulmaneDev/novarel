import { Inject, Injectable, ContainerModule } from '../src/index.js';

describe('Novarel Container - Basic Binding & Resolution', () => {
  let container: ContainerModule;

  beforeEach(() => {
    container = new ContainerModule();
  });

  test('should bind and resolve a simple value', () => {
    container.bind('count', 42);
    expect(container.make('count')).toBe(42);
  });

  test('should correctly handle falsy values (0, false, "")', () => {
    container.bind('zero', 0);
    container.bind('flag', false);
    container.bind('empty', '');

    expect(container.make('zero')).toBe(0);
    expect(container.make('flag')).toBe(false);
    expect(container.make('empty')).toBe('');
  });

  test('should self-bind a class when only abstract is provided', () => {
    @Injectable()
    class TestService {
      value = 123;
    }

    container.bind(TestService);
    const instance = container.make(TestService);

    expect(instance).toBeInstanceOf(TestService);
    expect(instance.value).toBe(123);
  });

  test('should support extend() for value modification', () => {
    container.bind('count', 0);

    container.extend<number>('count', () => 10);
    container.extend<number>('count', (c) => c + 5);
    container.extend<number>('count', (c) => c * 2);

    expect(container.make('count')).toBe(30); // (0 → 10 → 15 → 30)
  });

  test('should create new instance for transient (non-singleton) classes', () => {
    @Injectable()
    class Counter {
      count = Math.random();
    }

    container.bind(Counter); // default: transient

    const a = container.make(Counter);
    const b = container.make(Counter);

    expect(a).not.toBe(b);
    expect(a.count).not.toBe(b.count);
  });

  test('should cache singleton instances', () => {
    @Injectable()
    class Database {
      id = Math.random();
    }

    container.singleton(Database);

    const a = container.make(Database);
    const b = container.make(Database);

    expect(a).toBe(b);
    expect(a.id).toBe(b.id);
  });

  test('should inject dependencies via @Inject(token)', () => {
    container.bind('apiUrl', 'https://api.novarel.dev');

    @Injectable()
    class ApiClient {
      constructor(@Inject('apiUrl') public readonly url: string) {}
    }

    container.bind(ApiClient);

    const client = container.make(ApiClient);
    expect(client.url).toBe('https://api.novarel.dev');
  });
});
