import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address, AddressSchema } from "./address.schema";
import * as bcrypt from 'bcryptjs';

@Schema({
  timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  toJSON: { virtuals: true }, // 启用虚拟字段在 JSON 输出中显示
})
export class User extends Document { // 继承自 Document，这样 User 就有了 MongoDB 文档的所有属性
  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: function(v: string) {
        const bannedWords = ['admin', 'root', 'superuser'];
        return !bannedWords.includes(v.toLowerCase());
      },
      message: '用户名包含被禁止的词汇',
    }
  })
  username: string;

  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/, // 简单的邮箱格式验证
  })
  email: string;

  @Prop({
    required: true,
    minlength: 6,
    select: false, // 默认查询时不返回密码字段，提升安全性
    validate: {
      validator: function(v: string) {
        // 密码强度验证：至少包含一个数字、一个字母
        return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v);
      },
      message: '密码必须至少6位，并包含字母和数字',
    }
  })
  password: string;

  @Prop({
    type: Number,
    min: 0,
    max: 120,
  })
  age: number;

  @Prop({ default: Date.now }) // 设置默认值为当前时间
  createdAt: Date;

  @Prop({ 
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'banned'], // 限制 status 的值只能是这三个之一
 }) // 设置默认值为 'active'
  status: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isAdmin: boolean;

  @Prop({ type: AddressSchema }) // 嵌套 Address 模式
  address: Address;

  @Prop({ type: [String] }) // 标签数组
  tags: string[];

  readonly isActive: boolean; // 虚拟字段：只读属性，表示用户是否活跃

  // 实例方法类型声明
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 添加虚拟字段
UserSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// 添加索引
UserSchema.index({ email: 1 }); // 为 email 字段创建索引，提高查询效率
UserSchema.index({ username: 1 }); // 为 username 字段创建索引，提高查询效率

// 保存前加密密码
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return ;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    // next(err);
    console.error('Error hashing password', err);
  }
})

UserSchema.post('save', function(doc) {
  console.log(`用户 ${doc.username} 已保存到数据库`);
})

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
}