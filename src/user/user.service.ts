import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      createdAt: new Date('2026-01-01'),
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      createdAt: new Date('2026-01-02'),
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      createdAt: new Date('2026-01-03'),
    },
  ];

  // @Inject() 是一个依赖注入（Dependency Injection）装饰器，用于将外部资源（如服务、配置等）注入到类的构造函数中。在这个例子中，我们使用 @Inject('DATABASE_CONNECTION') 来注入一个名为 'DATABASE_CONNECTION' 的依赖项，这个依赖项是在 DatabaseModule 中提供的数据库连接配置。
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly dbConfig: any, 
    private configService: ConfigService
  ) {
    console.log('Database Config:', this.dbConfig);
    console.log('Config Service:', this.configService);
  }

  someMethod() {
    const dbUri = this.configService.get<string>('MONGODB_URI');
    const port = this.configService.get<number>('PORT', 3000);
    console.log('Database URI:', dbUri);
    console.log('Application Port:', port);
    // const apiKey = this.configService.getOrThrow<string>('API_KEY');
    // getOrThrow: 如果不存在，会抛出异常
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
  update(
    id: number,
    user: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return undefined;
    }
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }
  delete(id: number): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
