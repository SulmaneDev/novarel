# Novarel

A progressive **convention-over-configuration** framework for building web applications in Node.js.

> [!WARNING]
> **Novarel is currently under active development.**

---

## Overview

Novarel focuses on developer productivity by prioritizing sensible defaults and a modular architecture. It provides a structured foundation for building scalable applications without the boilerplate, allowing you to focus on writing your core logic.

## The Service Container

The Service Container is the central piece of Novarel, managing class dependencies and enabling seamless dependency injection throughout your application.

### Basic Usage

The container simplifies the management of objects by allowing you to bind abstractions to concrete implementations.

#### Binding a Class

```javascript
import { Container } from 'novarel';

const container = new Container();

// Bind a class
container.bind('UserService', { useClass: UserService });

// Resolve it later
const userService = container.make('UserService');
```

#### Singletons

Singletons ensure that a class is instantiated only once and the same instance is returned on subsequent calls.

```javascript
container.singleton('Database', { useValue: new DatabaseConnection() });
```

#### Dependency Injection

Novarel automates dependency injection using `$injections` or `$inject`.

```javascript
class UserController {
    static $injections = ['UserService'];

    constructor(userService) {
        this.userService = userService;
    }
}

container.bind('UserController', { useClass: UserController });
const controller = container.make('UserController');
```

### Features

- **Lazy Resolution**: Instantiate dependencies only when they are first used with `makeLazy()`.
- **Tagging**: Group multiple services under a single tag and resolve them collectively using `tagged()`.
- **Aliases**: Define multiple names for a single binding to improve code readability.

---

## License

Novarel is open-sourced software licensed under the [MIT license](LICENSE).
