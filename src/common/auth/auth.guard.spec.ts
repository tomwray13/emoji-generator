import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard();
  // ...

  it(`should return false with invalid apiKey`, () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-api-key': `INVALID`,
          },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(false);
  });

  it(`should return false when api key does not exist`, () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(false);
  });
});
