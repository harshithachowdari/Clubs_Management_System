import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: any): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingRollNumber = await this.userModel.findOne({ rollNumber: createUserDto.rollNumber });
    if (existingRollNumber) {
      throw new ConflictException('Roll number already exists');
    }

    const user = new this.userModel();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.role = createUserDto.role;
    user.rollNumber = createUserDto.rollNumber;
    user.department = createUserDto.department;
    user.academicYear = createUserDto.academicYear || null;
    user.managedClubs = createUserDto.managedClubs || [];
    user.profileImage = null;
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getStudents(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.STUDENT }).select('-password').exec();
  }

  async getClubAdmins(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.CLUB_ADMIN }).select('-password').exec();
  }

  async getAdmins(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.ADMIN }).select('-password').exec();
  }

  async joinClub(userId: string, clubId: string): Promise<User> {
    console.log(`UsersService.joinClub: Adding clubId ${clubId} to userId ${userId}`);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedClubs: clubId } },
      { new: true }
    ).select('-password').exec();
    console.log(`UsersService.joinClub: User ${userId} now has ${updatedUser?.joinedClubs?.length} clubs`);
    return updatedUser;
  }

  async leaveClub(userId: string, clubId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { joinedClubs: clubId } },
      { new: true }
    ).select('-password').exec();
  }

  async assignClubAdmin(userId: string, clubId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { managedClubs: clubId },
        role: UserRole.CLUB_ADMIN
      },
      { new: true }
    ).select('-password').exec();
  }

  async removeClubAdmin(userId: string, clubId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedManagedClubs = user.managedClubs.filter(id => id !== clubId);
    
    // If user has no more managed clubs, revert to student role
    const updateData: any = { managedClubs: updatedManagedClubs };
    if (updatedManagedClubs.length === 0) {
      updateData.role = UserRole.STUDENT;
    }

    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password').exec();
  }

  async getStudentsByYear(clubId?: string): Promise<any> {
    const query: any = { role: UserRole.STUDENT };
    if (clubId) {
      query.joinedClubs = clubId;
    }
    
    const students = await this.userModel.find(query).select('-password').exec();
    
    return {
      '1st Year': students.filter(s => s.academicYear === '1st Year'),
      '2nd Year': students.filter(s => s.academicYear === '2nd Year'),
      '3rd Year': students.filter(s => s.academicYear === '3rd Year'),
      '4th Year': students.filter(s => s.academicYear === '4th Year'),
      'Uncategorized': students.filter(s => !s.academicYear)
    };
  }

  async getStudentClubDetails(userId: string, clubId: string): Promise<any> {
    // Validate IDs to prevent CastError (500)
    const isValidUserId = /^[0-9a-fA-H]{24}$/i.test(userId);
    if (!isValidUserId) {
      throw new NotFoundException('Invalid User ID');
    }

    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Safer check for joined clubs
    const joinedClubs = user.joinedClubs || [];

    return {
      profile: user,
      activities: [],
      eventsOrganized: 0,
      activeParticipation: joinedClubs.includes(String(clubId)),
      recentActivities: [],
      overallEngagement: 'Medium'
    };
  }
}
