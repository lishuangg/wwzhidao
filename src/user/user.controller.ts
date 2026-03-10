import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

// 这里 'user' 是路由前缀，表示这个控制器中的所有路由都会以 /user 开头。
// @Controller({ path: 'user', version: '1' }) 也可以指定版本号路由会变成 /v1/user
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    // 请求数据不符合要求，NestJS 会自动返回 400 错误
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: { name?: string; email?: string },
  ): User {
    const user = this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.userService.delete(id);
    if (!success) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
  }
}
