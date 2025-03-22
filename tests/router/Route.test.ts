import Route from "../../src/router/route"; 

test("should return instance Route.ts", () => {
    const route =  new Route({
        handler: () => {},
        method:'get',
        path: "/"
    });
    expect(route).toBeInstanceOf(Route);
});
