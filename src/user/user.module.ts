import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { DatabaseModule } from 'src/database/database.module';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    // DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // 注册 User 模型
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
