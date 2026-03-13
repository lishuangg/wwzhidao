import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE') || 'mongodb';
        if (dbType === 'mongodb') {
          return {
            type: 'mongodb',
            uri:
              configService.get<string>('MONGODB_URI') ||
              'mongodb://localhost:27017/wwzhidao',
          };
        } else if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST') || 'localhost',
            port: configService.get<number>('POSTGRES_PORT') || 5432,
            database: configService.get<string>('POSTGRES_DB') || 'wwzhidao',
          };
        }
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
