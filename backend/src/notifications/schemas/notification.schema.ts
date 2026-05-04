import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationType {
  EVENT_REGISTRATION = 'event_registration',
  EVENT_APPROVAL = 'event_approval',
  CLUB_JOIN_REQUEST = 'club_join_request',
  CLUB_JOIN_APPROVAL = 'club_join_approval',
  ANNOUNCEMENT = 'announcement',
  REMINDER = 'reminder',
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  recipientId: string; // Reference to User

  @Prop({ required: false })
  senderId: string; // Reference to User (optional)

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: false })
  relatedEntityId: string; // Could be clubId, eventId, etc.

  @Prop({ required: false })
  relatedEntityType: string; // Could be 'club', 'event', etc.

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: null })
  actionUrl: string; // URL to redirect when notification is clicked

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
