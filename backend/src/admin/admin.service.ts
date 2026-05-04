import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ClubsService } from '../clubs/clubs.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clubsService: ClubsService,
  ) {}

  async getStats() {
    const [users, clubs] = await Promise.all([
      this.usersService.findAll(),
      this.clubsService.findAll(),
    ]);

    const stats = {
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalClubAdmins: users.filter(u => u.role === 'club_admin').length,
      totalClubs: clubs.length,
      activeClubs: clubs.filter(c => c.isActive).length,
      totalMemberships: clubs.reduce((acc, club) => acc + (club.members?.length || 0), 0),
    };

    return {
      success: true,
      data: stats
    };
  }
}
