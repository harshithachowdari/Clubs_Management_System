import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ClubCategory {
  TECHNICAL = 'technical',
  CULTURAL = 'cultural',
  SPORTS = 'sports',
  ACADEMIC = 'academic',
  SOCIAL = 'social',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Club extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ClubCategory })
  category: ClubCategory;

  @Prop({ required: true })
  adminId: string; // Reference to User who is club admin (Faculty/Admin)

  @Prop({ required: true })
  presidentId: string; // Reference to User who is student president

  @Prop({ default: null })
  foundedDate: Date;

  @Prop({ default: null })
  logo: string;

  @Prop({ default: null })
  coverImage: string;

  @Prop({ type: [String], default: [] })
  members: string[]; // Array of user IDs

  @Prop({ type: [String], default: [] })
  pendingRequests: string[]; // Array of user IDs waiting for approval

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  memberCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null })
  meetingSchedule: string;

  @Prop({ type: Object, default: null })
  socialLinks: {
    website?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export const ClubSchema = SchemaFactory.createForClass(Club);
