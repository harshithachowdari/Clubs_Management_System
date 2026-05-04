import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/schemas/user.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from '../clubs/schemas/club.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Club.name) private clubModel: Model<Club>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    try {
      const payload = { 
        email: user.email, 
        sub: user._id.toString(), 
        role: user.role,
        managedClubs: user.managedClubs || []
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          rollNumber: user.rollNumber,
          department: user.department,
          profileImage: user.profileImage,
        },
      };
    } catch (error) {
      console.error('Error in login service:', error);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    // By default, all new users are students unless specified otherwise
    if (!createUserDto.role) {
      createUserDto.role = UserRole.STUDENT;
    }
    
    // Ensure profileImage is properly handled
    const userData: any = {
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role || UserRole.STUDENT,
      rollNumber: createUserDto.rollNumber,
      department: createUserDto.department,
      profileImage: null,
      academicYear: createUserDto.academicYear || null,
      managedClubs: createUserDto.administeringClubId ? [createUserDto.administeringClubId] : []
    };
    
    const user = await this.usersService.create(userData);
    
    // If club admin, link them to the club
    if (user.role === UserRole.CLUB_ADMIN && createUserDto.administeringClubId) {
      await this.clubModel.findByIdAndUpdate(createUserDto.administeringClubId, {
        adminId: user._id.toString()
      });
    }

    const { password, ...result } = user.toObject();
    
    return this.login(result);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
