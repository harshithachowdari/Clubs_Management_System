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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { EventStatus } from './schemas/event.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // Set the organizer ID to the current user
    createEventDto.organizerId = req.user.id;
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.eventsService.searchEvents(query);
  }

  @Get('my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  getMyEvents(@Request() req) {
    return this.eventsService.getEventsByOrganizer(req.user.id);
  }

  @Get('registered')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  getRegisteredEvents(@Request() req) {
    return this.eventsService.getRegisteredEvents(req.user.id);
  }

  @Get('attended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  getAttendedEvents(@Request() req) {
    return this.eventsService.getAttendedEvents(req.user.id);
  }

  @Get('club/:clubId')
  findByClub(@Param('clubId') clubId: string) {
    return this.eventsService.findByClub(clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: EventStatus) {
    return this.eventsService.updateEventStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  registerForEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.registerForEvent(id, req.user.id);
  }

  @Post(':id/unregister')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  unregisterFromEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.unregisterFromEvent(id, req.user.id);
  }

  @Post(':id/attendance/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN, UserRole.ADMIN)
  markAttendance(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    return this.eventsService.markAttendance(id, userId, req.user.id);
  }
}
