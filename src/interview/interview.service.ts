import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InterviewService {
  constructor(private readonly userService: UserService) { }

  async create(userId: number, interviewData: any): Promise<any> {
    const user = this.userService.findOne(userId);
    if (!user) {
      return `用户 ID ${userId} 不存在，无法创建面试`;
    }
    // 这里可以添加更多的面试创建逻辑，比如保存到数据库等
  }
}
