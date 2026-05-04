import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EventType {
  WORKSHOP = 'workshop',
  SEMINAR = 'seminar',
  COMPETITION = 'competition',
  MEETING = 'meeting',
  SOCIAL = 'social',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  clubId: string; // Reference to Club

  @Prop({ required: true })
  organizerId: string; // Reference to User (club admin)

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus;

  @Prop({ default: null })
  poster: string;

  @Prop({ default: 0 })
  maxParticipants: number;

  @Prop({ default: 0 })
  currentParticipants: number;

  @Prop({ type: [String], default: [] })
  registeredParticipants: string[]; // Array of user IDs

  @Prop({ type: [String], default: [] })
  attendedParticipants: string[]; // Array of user IDs

  @Prop({ default: false })
  requiresRegistration: boolean;

  @Prop({ default: null })
  registrationDeadline: Date;

  @Prop({ default: null })
  requirements: string;

  @Prop({ default: null })
  contactInfo: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
