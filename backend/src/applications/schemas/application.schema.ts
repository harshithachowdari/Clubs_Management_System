import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  club: string;

  @Prop({ required: true })
  positionApplied: string; // e.g., 'member', 'secretary', 'treasurer'

  @Prop({ required: true, default: 'pending' })
  status: string; // e.g., 'pending', 'approved', 'rejected'

  @Prop({ default: '' })
  reason: string; // Optional: Why they want to join/applied for the role

  @Prop({ default: null })
  reviewedBy: string; // ID of the admin who reviewed it

  @Prop({ default: null })
  reviewedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
