import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubCategory } from './schemas/club.schema';

import { Membership } from '../memberships/schemas/membership.schema';
import { User, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(Membership.name) private membershipModel: Model<Membership>,
    private usersService: UsersService,
  ) {}

  async create(createClubDto: any): Promise<Club> {
    // Check if the admin is already managing a club
    const adminUser = await this.usersService.findOne(createClubDto.adminId);
    if (adminUser.managedClubs && adminUser.managedClubs.length > 0) {
      throw new ConflictException('This admin is already managing another club');
    }

    const existingClub = await this.clubModel.findOne({ name: createClubDto.name });
    if (existingClub) {
      throw new ConflictException('Club with this name already exists');
    }

    const club = new this.clubModel(createClubDto);
    return club.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubModel.findById(id).exec();
    if (!club) {
      throw new NotFoundException('Club not found');
    }
    return club;
  }

  async findMany(ids: string[]): Promise<Club[]> {
    return this.clubModel.find({ _id: { $in: ids } }).exec();
  }

  async findByCategory(category: ClubCategory): Promise<Club[]> {
    return this.clubModel.find({ category, isActive: true }).exec();
  }

  async update(id: string, updateClubDto: any): Promise<Club> {
    const club = await this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true }).exec();
    if (!club) {
      throw new NotFoundException('Club not found');
    }
    return club;
  }

  async remove(id: string): Promise<Club> {
    const club = await this.clubModel.findByIdAndDelete(id).exec();
    if (!club) {
      throw new NotFoundException('Club not found');
    }
    return club;
  }

  async joinClub(clubId: string, userId: string): Promise<Club> {
    console.log(`ClubsService.joinClub: userId ${userId} joining clubId ${clubId}`);
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      console.error(`ClubsService.joinClub: Club ${clubId} not found`);
      throw new NotFoundException('Club not found');
    }

    // Check if user is already a member
    if (club.members.includes(userId)) {
      console.warn(`ClubsService.joinClub: User ${userId} already member of ${clubId}`);
      throw new ConflictException('User is already a member of this club');
    }

    // Instant enrollment logic: Use Set to ensure uniqueness
    const memberId = String(userId);
    if (!club.members.includes(memberId)) {
      club.members.push(memberId);
      club.memberCount = club.members.length;
    }
    
    // Also remove from pending requests if they were there
    club.pendingRequests = club.pendingRequests.filter(id => String(id) !== memberId);
    
    const savedClub = await club.save();
    console.log(`ClubsService.joinClub: Club ${clubId} saved with ${savedClub.memberCount} members`);

    // Update user's joined clubs
    console.log(`ClubsService.joinClub: Updating user ${userId} joinedClubs`);
    await this.usersService.joinClub(memberId, String(clubId));

    // Create membership record (Check if already exists first)
    const existingMembership = await this.membershipModel.findOne({ user: memberId, club: clubId, status: 'active' });
    if (!existingMembership) {
      const membership = new this.membershipModel({
        user: memberId,
        club: clubId,
        role: 'member',
        status: 'active',
        joinedAt: new Date(),
      });
      await membership.save();
      console.log(`ClubsService.joinClub: Membership record created for user ${userId} and club ${clubId}`);
    }

    return savedClub;
  }

  async approveMember(clubId: string, userId: string, adminId: string): Promise<Club> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    // Check if the requester is the club admin
    if (club.adminId !== adminId) {
      throw new Error('Only club admin can approve members');
    }

    // Check if user is in pending requests
    if (!club.pendingRequests.includes(userId)) {
      throw new NotFoundException('User not found in pending requests');
    }

    // Remove from pending requests and add to members
    club.pendingRequests = club.pendingRequests.filter(id => id !== userId);
    club.members.push(userId);
    club.memberCount = club.members.length;

    return club.save();
  }

  async rejectMember(clubId: string, userId: string, adminId: string): Promise<Club> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    // Check if the requester is the club admin
    if (club.adminId !== adminId) {
      throw new Error('Only club admin can reject members');
    }

    // Remove from pending requests
    club.pendingRequests = club.pendingRequests.filter(id => id !== userId);

    return club.save();
  }

  async removeMember(clubId: string, userId: string, adminId: string): Promise<Club> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    // Check if the requester is the club admin
    if (club.adminId !== adminId) {
      throw new Error('Only club admin can remove members');
    }

    // Remove from members
    club.members = club.members.filter(id => id !== userId);
    club.memberCount = club.members.length;

    return club.save();
  }

  async getClubByAdmin(adminId: string): Promise<Club[]> {
    return this.clubModel.find({ adminId: String(adminId), isActive: true }).exec();
  }

  async getPendingRequests(clubId: string, adminId: string): Promise<Club> {
    const club = await this.clubModel.findById(clubId).populate('pendingRequests').exec();
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    if (club.adminId !== adminId) {
      throw new Error('Only club admin can view pending requests');
    }

    return club;
  }

  async getClubMembers(clubId: string, adminId: string): Promise<any> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    if (club.adminId !== adminId) {
      throw new Error('Only club admin can view members');
    }

    // Fetch member details from User collection
    return this.usersService.findAll().then(users => 
      users.filter(user => club.members.includes(user._id.toString()))
    );
  }

  async searchClubs(query: string): Promise<Club[]> {
    const regex = new RegExp(query, 'i');
    return this.clubModel.find({
      isActive: true,
      $or: [
        { name: regex },
        { description: regex },
        { tags: { $in: [regex] } }
      ]
    }).exec();
  }

  async getClubPerformance(clubId: string): Promise<any> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    // Placeholder for actual metrics logic
    return {
      eventsOrganized: 5, // Simulated
      activeParticipationRate: '75%', // Simulated
      recentActivitiesCount: 12, // Simulated
      overallPerformance: 'Excellent', // Simulated
      memberGrowth: '+10% this month' // Simulated
    };
  }

  async getClubEngagement(clubId: string): Promise<any> {
    const club = await this.clubModel.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club not found');
    }

    // Placeholder for engagement analytics
    return {
      averageEventAttendance: 45,
      mostActiveMembers: [],
      topEvents: [],
      engagementScore: 88
    };
  }
}
