import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.grard';
import { RoleGuard, Roles } from 'src/auth/role.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard) // 保护整个控制器，所有路由都需要认证
export class AdminController {
  @Get('users')
  @Roles('admin') // 只有具有 'admin' 角色的用户才能访问这个路由
  getAllUsers() {}

  @Get('stats')
  @Roles('admin', 'moderator') // 只有具有 'admin' 或 'moderator' 角色的用户才能访问这个路由
  getStats() {}

  
  @Get('admin')
  @UseGuards(RoleGuard) // 这个路由需要额外的角色验证
  @Roles('admin') // 只有具有 'admin' 角色的用户才能访问这个路由
  getAdminInfo() {}
}
