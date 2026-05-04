import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('my-notifications')
  findMyNotifications(@Request() req) {
    return this.notificationsService.findByRecipient(req.user.id);
  }

  @Get('unread')
  findUnread(@Request() req) {
    return this.notificationsService.findUnreadByRecipient(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Post('announcement')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  createAnnouncement(@Body() announcementDto: {
    title: string;
    message: string;
    recipientIds: string[];
    relatedEntityId?: string;
    relatedEntityType?: string;
  }) {
    return this.notificationsService.createAnnouncementNotification(
      announcementDto.recipientIds,
      announcementDto.title,
      announcementDto.message,
      announcementDto.relatedEntityId,
      announcementDto.relatedEntityType
    );
  }
}
