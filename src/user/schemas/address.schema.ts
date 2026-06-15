import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({_id: false}) // 设置 _id: false，表示不自动生成 _id 字段
export class Address extends Document {
  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  street: string;

  @Prop()
  zipCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);