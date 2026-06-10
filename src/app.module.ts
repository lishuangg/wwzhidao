import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './auth/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InterviewModule } from './interview/interview.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { AdminController } from './admin/admin.controller';
import { JwtAuthGuard } from './auth/jwt-auth.grard';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { configSchema } from './config/config.schema';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 优先加载环境特定文件，回退到 .env
      isGlobal: true, // 全局模块，可以在任何地方使用
      validationSchema: configSchema, // 使用 Joi 进行环境变量验证
      validationOptions: { allowUnknown: true, abortEarly: false }, // 允许未知变量，收集所有错误
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/wwzhidao',
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    InterviewModule,
    DatabaseModule,
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    // 在 app.module.ts 中使用 APP_INTERCEPTOR 注册全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard, // 使用 JWT 认证守卫保护整个应用
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // 全局异常过滤器
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 配置全局中间件
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
