import { NovarelMiddleware } from '../src/server/middleware';
import type { NextFunction } from 'express';
import type { NovarelRequest } from '../src/server/request';
import type { NovarelResponse } from '../src/server/response';

describe('NovarelMiddleware', () => {
  class TestMiddleware extends NovarelMiddleware {
    handle(
      req: NovarelRequest,
      res: NovarelResponse,
      next: NextFunction
    ): void {
      res.setHeader('X-Test', 'value');
      next();
    }
  }

  it('should call res.setHeader and next()', () => {
    const req = {} as NovarelRequest;

    const setHeader = jest.fn();
    const res = { setHeader } as unknown as NovarelResponse;

    const next = jest.fn();

    const middleware = new TestMiddleware();
    middleware.handle(req, res, next);

    expect(setHeader).toHaveBeenCalledWith('X-Test', 'value');
    expect(next).toHaveBeenCalled();
  });
});
