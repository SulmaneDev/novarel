import Route from "../../src/router/route";
import Router from "../../src/router/router";

test("should have array of instances of Route", () => {
    Router.get("/test", ["", ""]);
    Router.get("/test", ["", ""]);
    expect(Router.getRoutes()[0]).toBeInstanceOf(Route);
});
