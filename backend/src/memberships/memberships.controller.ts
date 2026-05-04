import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('api/memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('club/:clubId')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.FACULTY)
  findByClub(@Param('clubId') clubId: string) {
    return this.membershipsService.findByClub(clubId);
  }

  @Get('my-memberships')
  findMyMemberships(@Request() req: any) {
    return this.membershipsService.findByUser(req.user._id);
  }
}
