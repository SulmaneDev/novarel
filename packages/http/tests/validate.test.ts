import { z } from 'zod';
import { Validate } from '../src/server/validate';
import type { NovarelRequest } from '../src/server/request';

describe('Validate (abstract)', () => {
  class TestValidator extends Validate {
    public authorize(): boolean {
      return true;
    }

    public rules() {
      return z.object({
        name: z.string().min(1),
        age: z.number().int().positive(),
      });
    }
  }

  it('should return true from authorize()', () => {
    const mockRequest = {} as NovarelRequest;
    const validator = new TestValidator(mockRequest);

    expect(validator.authorize()).toBe(true);
  });

  it('should return correct Zod schema from rules()', () => {
    const mockRequest = {} as NovarelRequest;
    const validator = new TestValidator(mockRequest);

    const schema = validator.rules();

    const valid = schema.safeParse({ name: 'Alice', age: 30 });
    const invalid = schema.safeParse({ name: '', age: -5 });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.format()).toHaveProperty('name');
      expect(invalid.error.format()).toHaveProperty('age');
    }
  });
});
