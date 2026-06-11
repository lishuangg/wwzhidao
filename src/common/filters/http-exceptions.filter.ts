import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    let message: string = '请求失败';
    let error: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || '请求失败';
      error = responseObj.error || null;
    } else {
      message = exception.message || '请求失败';
    }

    response.status(status).json({
      code: status,
      statusCode: status,
      path: request.url,
      data: null,
      timestamp: new Date().toISOString(),
      message: Array.isArray(message) ? message.join(', ') : message,
      ...(error && { error }),
    });
  }
}