import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if(!this.validateToken(token)) {
      throw new UnauthorizedException('无效的认证令牌');
    }

    request.user = this.getUserFromToken(token);

    return true;
  }

  private getUserFromToken(token: string): any {
    // 从 token 中提取用户信息
    // 这里简化处理
    return { id: 1, name: '测试用户' };
  }

  private async validateToken(token: string): Promise<boolean> {
    // 在这里实现你的令牌验证逻辑，例如使用 JWT 验证令牌的有效性
    // 你可以使用第三方库如 jsonwebtoken 来验证 JWT 令牌
    // 例如：
    // try {
    //   const decoded = jwt.verify(token, 'your-secret-key');
    //   return true; // 令牌有效
    // } catch (err) {
    //   return false; // 令牌无效
    // }
    return true; // 这里暂时返回 true，实际应用中应根据验证结果返回 true 或 false
  }
}
