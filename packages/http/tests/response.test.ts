import {NovarelResponse} from '../src/server/response';

test("NovarelResponse", () => {
    const setHeader = jest.fn();

    const fakeRes = {
    setHeader,
    } as any;
    
    const res = new NovarelResponse(fakeRes);
    res.setHeader('X-Test', 'value');
    
    expect(setHeader).toHaveBeenCalledWith('X-Test', 'value');
    
});