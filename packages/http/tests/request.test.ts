import { Request } from "express";
import {NovarelRequest} from '../src/server/request';

test("NovarelRequest", () => {
    const request=new NovarelRequest({
        body: {
            name: "sulman"
        },
        method: "GET",
    } as Request);
    expect(request.input("name")).toBe("sulman");
    expect(request.isMethod('GET')).toBe(true);
});