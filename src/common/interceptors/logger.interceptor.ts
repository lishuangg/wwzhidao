/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cxt = context.switchToHttp();
    const request = cxt.getRequest();
    const response = cxt.getResponse();
    const { method, url } = request;
    const now = Date.now();

    // 创建一个日志拦截器，记录请求和响应信息
    return next.handle().pipe(
      // tap 操作符用于执行副作用，不修改数据
      tap({
        next: ((data) => {
          console.log('响应数据:', data);
          const { statusCode } = response;
          const responseTime = Date.now() - now;
          this.logger.log(`${method}, 请求路径: ${url}, 状态码: ${statusCode}, 响应时间: ${responseTime}ms`);
        }),
        error: (err) => {
          const responseTime = Date.now() - now;
          this.logger.error(`${method}, 请求路径: ${url}, 错误信息: ${err.message}, 响应时间: ${responseTime}ms`);
        }
      }),
    );
  }
}