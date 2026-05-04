import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('api/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Request() req: any, @Body() applicationData: any) {
    return this.applicationsService.create({
      ...applicationData,
      user: req.user._id,
    });
  }

  @Get('club/:clubId')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.FACULTY)
  findByClub(@Param('clubId') clubId: string) {
    return this.applicationsService.findByClub(clubId);
  }

  @Get('my-applications')
  findMyApplications(@Request() req: any) {
    return this.applicationsService.findByUser(req.user._id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.CLUB_ADMIN, UserRole.FACULTY)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.applicationsService.updateStatus(id, status, req.user._id);
  }
}
