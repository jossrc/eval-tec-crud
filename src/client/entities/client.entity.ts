import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'clients',
})
export class Client extends Document {
  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  salt: string;

  @Prop({
    required: false,
  })
  phone: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
