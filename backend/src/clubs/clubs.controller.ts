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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ClubCategory } from './schemas/club.schema';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get('debug/ping')
  ping() {
    return 'pong';
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Get()
  findAll() {
    console.log('ClubsController.findAll called');
    return this.clubsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.clubsService.searchClubs(query);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: ClubCategory) {
    return this.clubsService.findByCategory(category);
  }

  @Get('my-clubs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  async getMyClubs(@Request() req) {
    const managedClubs = req.user.managedClubs || [];
    
    // Primary source: User's managedClubs array
    let clubs = await this.clubsService.findMany(managedClubs);
    
    // Fallback: Search by adminId (for legacy or manually updated records)
    if (clubs.length === 0) {
      clubs = await this.clubsService.getClubByAdmin(req.user.id);
    }
    
    return clubs;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto, @Request() req) {
    // If club admin, ensure they own the club
    if (req.user.role === UserRole.CLUB_ADMIN) {
      // Additional validation would be needed here to ensure club admin owns the club
      // For now, we'll allow it but in production you'd want to verify ownership
    }
    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  joinClub(@Param('id') id: string, @Request() req) {
    return this.clubsService.joinClub(id, req.user.id);
  }

  @Post(':id/approve/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  approveMember(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    return this.clubsService.approveMember(id, userId, req.user.id);
  }

  @Post(':id/reject/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  rejectMember(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    return this.clubsService.rejectMember(id, userId, req.user.id);
  }

  @Post(':id/remove-member/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    return this.clubsService.removeMember(id, userId, req.user.id);
  }

  @Get(':id/pending-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  getPendingRequests(@Param('id') id: string, @Request() req) {
    return this.clubsService.getPendingRequests(id, req.user.id);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLUB_ADMIN)
  getMembers(@Param('id') id: string, @Request() req) {
    return this.clubsService.getClubMembers(id, req.user.id);
  }

  @Get(':id/performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  getPerformance(@Param('id') id: string) {
    return this.clubsService.getClubPerformance(id);
  }

  @Get(':id/engagement')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN)
  getEngagement(@Param('id') id: string) {
    return this.clubsService.getClubEngagement(id);
  }
}
