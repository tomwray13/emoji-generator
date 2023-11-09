import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : 500;

    response.status(status).json({
      message: isHttpException ? exception.message : `Internal server error`,
      error: isHttpException ? exception.name : `GenericException`,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
