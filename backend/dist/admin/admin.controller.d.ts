import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
