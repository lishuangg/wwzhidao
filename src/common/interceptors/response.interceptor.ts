/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface ResponseFormat<T = any> {
  code: number; // 状态码
  message: string; // 消息
  data: T; // 数据
  timestamp: string; // 时间戳
  path: string; // 请求路径
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const cxt = context.switchToHttp();
    const request = cxt.getRequest();
    const response = cxt.getResponse();
    const path = request.url;
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      // map 操作符用于转换数据
      map((data) => {
        if(data === null || data === undefined) {
          // 如果没有数据，返回默认的成功响应
          return {
            code: HttpStatus.OK,
            message: "操作成功",
            data: null,
            timestamp: timestamp,
            path: path,
          };
        }
        if(data && typeof data === "object" && "code" in data && "message" in data) {
          // 如果已经包含 code 和 message 字段，直接返回
          return {
            ...data,
            timestamp: timestamp,
            path: path,
          };
        }
        return {
          code: HttpStatus.OK,
          message: "操作成功",
          data: data,
          timestamp: timestamp,
          path: path,
        };
      }),
      // tap 操作符用于执行副作用，不修改数据
      // tap((data) => {
      //   console.log('响应数据:', data);
      // }),
    );
  }
}