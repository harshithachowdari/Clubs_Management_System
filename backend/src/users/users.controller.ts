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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('students')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  getStudents() {
    return this.usersService.getStudents();
  }

  @Get('students-by-year')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  getStudentsByYear(@Request() req) {
    // If club admin, only show students of their club
    const clubId = req.user.role === UserRole.CLUB_ADMIN ? req.user.managedClubs[0] : null;
    return this.usersService.getStudentsByYear(clubId);
  }

  @Get('student-details/:userId/club/:clubId')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  getStudentClubDetails(@Param('userId') userId: string, @Param('clubId') clubId: string) {
    console.log(`UsersController.getStudentClubDetails: userId=${userId}, clubId=${clubId}`);
    return this.usersService.getStudentClubDetails(userId, clubId);
  }

  @Get('club-admins')
  @Roles(UserRole.ADMIN)
  getClubAdmins() {
    return this.usersService.getClubAdmins();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':userId/join-club/:clubId')
  @Roles(UserRole.STUDENT)
  joinClub(@Param('userId') userId: string, @Param('clubId') clubId: string, @Request() req) {
    // Ensure user can only join clubs for themselves
    if (req.user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.joinClub(userId, clubId);
  }

  @Post(':userId/leave-club/:clubId')
  @Roles(UserRole.STUDENT)
  leaveClub(@Param('userId') userId: string, @Param('clubId') clubId: string, @Request() req) {
    // Ensure user can only leave clubs for themselves
    if (req.user.id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.usersService.leaveClub(userId, clubId);
  }

  @Post(':userId/assign-club-admin/:clubId')
  @Roles(UserRole.ADMIN)
  assignClubAdmin(@Param('userId') userId: string, @Param('clubId') clubId: string) {
    return this.usersService.assignClubAdmin(userId, clubId);
  }

  @Post(':userId/remove-club-admin/:clubId')
  @Roles(UserRole.ADMIN)
  removeClubAdmin(@Param('userId') userId: string, @Param('clubId') clubId: string) {
    return this.usersService.removeClubAdmin(userId, clubId);
  }
}
