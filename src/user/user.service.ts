import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  
  async create(createUserDto: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // const createdUser = new this.userModel(createUserDto);
    // return createdUser.save();
    return this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: number, updateUserDto: Partial<any>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    // 查询时只选择必要的字段，提升性能
    const user = await this.userModel
      .findOne({ email })
      .select('+password') // password 字段可能被默认排除，需要显式包含
      .exec();

    if (!user) {
      // 使用统一的错误信息，避免暴露用户是否存在（安全性）
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    return user;
  }
}
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   createdAt: Date;
// }
// @Injectable()
// export class UserService {
//   private users: User[] = [
//     {
//       id: 1,
//       name: '张三',
//       email: 'zhangsan@example.com',
//       createdAt: new Date('2026-01-01'),
//     },
//     {
//       id: 2,
//       name: '李四',
//       email: 'lisi@example.com',
//       createdAt: new Date('2026-01-02'),
//     },
//     {
//       id: 3,
//       name: '王五',
//       email: 'wangwu@example.com',
//       createdAt: new Date('2026-01-03'),
//     },
//   ];

//   // @Inject() 是一个依赖注入（Dependency Injection）装饰器，用于将外部资源（如服务、配置等）注入到类的构造函数中。在这个例子中，我们使用 @Inject('DATABASE_CONNECTION') 来注入一个名为 'DATABASE_CONNECTION' 的依赖项，这个依赖项是在 DatabaseModule 中提供的数据库连接配置。
//   constructor(
//     @Inject('DATABASE_CONNECTION') private readonly dbConfig: any, 
//     private configService: ConfigService
//   ) {
//     console.log('Database Config:', this.dbConfig);
//     console.log('Config Service:', this.configService);
//   }

//   someMethod() {
//     const dbUri = this.configService.get<string>('MONGODB_URI');
//     const port = this.configService.get<number>('PORT', 3000);
//     console.log('Database URI:', dbUri);
//     console.log('Application Port:', port);
//     // const apiKey = this.configService.getOrThrow<string>('API_KEY');
//     // getOrThrow: 如果不存在，会抛出异常
//   }

//   findAll(): User[] {
//     return this.users;
//   }

//   findOne(id: number): User | undefined {
//     return this.users.find((user) => user.id === id);
//   }

//   create(user: Omit<User, 'id' | 'createdAt'>): User {
//     const newUser: User = {
//       id: this.users.length + 1,
//       ...user,
//       createdAt: new Date(),
//     };
//     this.users.push(newUser);
//     return newUser;
//   }
//   update(
//     id: number,
//     user: Partial<Omit<User, 'id' | 'createdAt'>>,
//   ): User | undefined {
//     const index = this.users.findIndex((user) => user.id === id);
//     if (index === -1) {
//       return undefined;
//     }
//     this.users[index] = { ...this.users[index], ...user };
//     return this.users[index];
//   }
//   delete(id: number): boolean {
//     const index = this.users.findIndex((user) => user.id === id);
//     if (index === -1) {
//       return false;
//     }
//     this.users.splice(index, 1);
//     return true;
//   }
// }
