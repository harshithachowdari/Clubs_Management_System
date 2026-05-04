import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('api/achievements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.FACULTY)
  create(@Body() achievementData: any) {
    return this.achievementsService.create(achievementData);
  }

  @Get('club/:clubId')
  findByClub(@Param('clubId') clubId: string) {
    return this.achievementsService.findByClub(clubId);
  }

  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.FACULTY)
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }
}
