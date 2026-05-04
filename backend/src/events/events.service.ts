import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventStatus, EventType } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createEventDto: any): Promise<Event> {
    const event = new this.eventModel(createEventDto);
    return event.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().sort({ startDate: 1 }).exec();
  }

  async findUpcoming(): Promise<Event[]> {
    return this.eventModel.find({ 
      status: EventStatus.UPCOMING,
      startDate: { $gte: new Date() }
    }).sort({ startDate: 1 }).exec();
  }

  async findByClub(clubId: string): Promise<Event[]> {
    return this.eventModel.find({ clubId }).sort({ startDate: 1 }).exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateEventDto: any): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async remove(id: string): Promise<Event> {
    const event = await this.eventModel.findByIdAndDelete(id).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async registerForEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if registration is still open
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      throw new ConflictException('Registration deadline has passed');
    }

    // Check if event requires registration
    if (!event.requiresRegistration) {
      throw new ConflictException('This event does not require registration');
    }

    // Check if user is already registered
    if (event.registeredParticipants.includes(userId)) {
      throw new ConflictException('User is already registered for this event');
    }

    // Check if event has reached maximum participants
    if (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants) {
      throw new ConflictException('Event has reached maximum participants');
    }

    // Add user to registered participants
    event.registeredParticipants.push(userId);
    event.currentParticipants = event.registeredParticipants.length;

    return event.save();
  }

  async unregisterFromEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Remove user from registered participants
    event.registeredParticipants = event.registeredParticipants.filter(id => id !== userId);
    event.currentParticipants = event.registeredParticipants.length;

    return event.save();
  }

  async markAttendance(eventId: string, userId: string, organizerId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if the requester is the event organizer
    if (event.organizerId !== organizerId) {
      throw new Error('Only event organizer can mark attendance');
    }

    // Check if user is registered
    if (!event.registeredParticipants.includes(userId)) {
      throw new NotFoundException('User not found in registered participants');
    }

    // Check if attendance is already marked
    if (event.attendedParticipants.includes(userId)) {
      throw new ConflictException('Attendance already marked for this user');
    }

    // Add user to attended participants
    event.attendedParticipants.push(userId);

    return event.save();
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventModel.find({ organizerId }).sort({ startDate: 1 }).exec();
  }

  async getRegisteredEvents(userId: string): Promise<Event[]> {
    return this.eventModel.find({ 
      registeredParticipants: userId 
    }).sort({ startDate: 1 }).exec();
  }

  async getAttendedEvents(userId: string): Promise<Event[]> {
    return this.eventModel.find({ 
      attendedParticipants: userId 
    }).sort({ startDate: 1 }).exec();
  }

  async updateEventStatus(eventId: string, status: EventStatus): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(
      eventId, 
      { status }, 
      { new: true }
    ).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async searchEvents(query: string): Promise<Event[]> {
    const regex = new RegExp(query, 'i');
    return this.eventModel.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
        { tags: { $in: [regex] } }
      ]
    }).sort({ startDate: 1 }).exec();
  }
}
