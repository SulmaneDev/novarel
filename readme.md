# Novarel

Novarel is an opinionated Node.js framework with built-in features like robust routing, declarative MVC, a powerful DB API, and versatile rendering (SSR, CSR, ISR, SSG). Designed for scalability, it includes event-driven architecture, factories, seeders, and more.

## Features

- **Routing** – Powerful and flexible routing system.
- **MVC Architecture** – Declarative Model-View-Controller pattern.
- **Database API** – Integrated ORM with migrations and queries.
- **Rendering Support** – Supports SSR, CSR, ISR, and SSG.
- **Event-Driven** – Built-in event system for scalable applications.
- **Factories & Seeders** – Easily generate test data.
- **Extensible** – Designed for plugins and middleware.

## Installation

```sh
npm install novarel
```

## Usage

in web.ts define routes

```ts
Router.get("/path", ["HomeController", "index"])
    .name("HomeRoute")
    .middlewares(["auth", "throttler"]);
```

in HomeController define method

```ts
class HomeController extends Controller() {
    index() {
        return view("index");
    }
}
```


in view index.tsx
```tsx
function index() {
    return (
        <div> Hello World</div>
    )
}

```