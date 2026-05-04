import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async create(createNotificationDto: any): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByRecipient(recipientId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadByRecipient(recipientId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ recipientId, isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(recipientId: string): Promise<any> {
    return this.notificationModel
      .updateMany({ recipientId, isRead: false }, { isRead: true })
      .exec();
  }

  async remove(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async createEventRegistrationNotification(
    recipientId: string,
    eventId: string,
    eventTitle: string
  ): Promise<Notification> {
    return this.create({
      title: 'Event Registration Successful',
      message: `You have successfully registered for "${eventTitle}"`,
      recipientId,
      type: NotificationType.EVENT_REGISTRATION,
      relatedEntityId: eventId,
      relatedEntityType: 'event',
      actionUrl: `/events/${eventId}`,
    });
  }

  async createClubJoinRequestNotification(
    clubAdminId: string,
    clubId: string,
    clubName: string,
    studentName: string
  ): Promise<Notification> {
    return this.create({
      title: 'New Club Join Request',
      message: `${studentName} has requested to join "${clubName}"`,
      recipientId: clubAdminId,
      type: NotificationType.CLUB_JOIN_REQUEST,
      relatedEntityId: clubId,
      relatedEntityType: 'club',
      actionUrl: `/clubs/${clubId}/pending-requests`,
    });
  }

  async createClubJoinApprovalNotification(
    recipientId: string,
    clubId: string,
    clubName: string
  ): Promise<Notification> {
    return this.create({
      title: 'Club Join Request Approved',
      message: `Your request to join "${clubName}" has been approved!`,
      recipientId,
      type: NotificationType.CLUB_JOIN_APPROVAL,
      relatedEntityId: clubId,
      relatedEntityType: 'club',
      actionUrl: `/clubs/${clubId}`,
    });
  }

  async createAnnouncementNotification(
    recipientIds: string[],
    title: string,
    message: string,
    relatedEntityId?: string,
    relatedEntityType?: string
  ): Promise<Notification[]> {
    const notifications = recipientIds.map(recipientId =>
      this.create({
        title,
        message,
        recipientId,
        type: NotificationType.ANNOUNCEMENT,
        relatedEntityId,
        relatedEntityType,
      })
    );

    return Promise.all(notifications);
  }

  async createReminderNotification(
    recipientId: string,
    title: string,
    message: string,
    relatedEntityId?: string,
    relatedEntityType?: string
  ): Promise<Notification> {
    return this.create({
      title,
      message,
      recipientId,
      type: NotificationType.REMINDER,
      relatedEntityId,
      relatedEntityType,
    });
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.notificationModel
      .countDocuments({ recipientId, isRead: false })
      .exec();
  }
}
