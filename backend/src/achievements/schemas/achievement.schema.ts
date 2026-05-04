import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Achievement extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true })
  club: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  imageUrl: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
