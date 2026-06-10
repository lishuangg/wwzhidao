import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if(typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误';
      this.logger.error(`未处理的异常： ${message}`, exception.stack, 'AllExceptionsFilter');
    }

    this.logger.error(`${request.method} ${request.url} 发生异常： ${status} - ${message}`,);

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