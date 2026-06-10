import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {
    // 在这里可以初始化数据库连接，或者提供一些数据库相关的方法
  }

  getConnectionString(): string {
    return this.configService.getOrThrow<string>('MONGODB_URI'); // 获取数据库连接字符串，如果不存在则抛出异常
  }

  getPort(): number {
    return this.configService.get<number>('PORT', 3000); // 获取应用程序端口，默认为 3000
  }
}
