import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Membership extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  club: string;

  @Prop({ required: true, default: 'member' })
  role: string; // e.g., 'member', 'president', 'treasurer', 'secretary'

  @Prop({ required: true, default: 'active' })
  status: string; // e.g., 'active', 'inactive', 'suspended'

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
