import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorCode } from '../../domain/errors/error-codes';

export function configureApp(app: {
  useGlobalPipes: (...pipes: ValidationPipe[]) => unknown;
}): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: () =>
        new BadRequestException({
          errorCode: ErrorCode.INVALID_REQUEST,
          message: 'La solicitud contiene campos faltantes o inválidos.',
        }),
    }),
  );
}
