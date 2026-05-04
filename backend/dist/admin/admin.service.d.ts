import { UsersService } from '../users/users.service';
import { ClubsService } from '../clubs/clubs.service';
export declare class AdminService {
    private readonly usersService;
    private readonly clubsService;
    constructor(usersService: UsersService, clubsService: ClubsService);
    getStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalStudents: number;
            totalClubAdmins: number;
            totalClubs: number;
            activeClubs: number;
            totalMemberships: number;
        };
    }>;
}
