import { Model } from 'mongoose';
import { Club, ClubCategory } from './schemas/club.schema';
import { Membership } from '../memberships/schemas/membership.schema';
import { UsersService } from '../users/users.service';
export declare class ClubsService {
    private clubModel;
    private membershipModel;
    private usersService;
    constructor(clubModel: Model<Club>, membershipModel: Model<Membership>, usersService: UsersService);
    create(createClubDto: any): Promise<Club>;
    findAll(): Promise<Club[]>;
    findOne(id: string): Promise<Club>;
    findByCategory(category: ClubCategory): Promise<Club[]>;
    update(id: string, updateClubDto: any): Promise<Club>;
    remove(id: string): Promise<Club>;
    joinClub(clubId: string, userId: string): Promise<Club>;
    approveMember(clubId: string, userId: string, adminId: string): Promise<Club>;
    rejectMember(clubId: string, userId: string, adminId: string): Promise<Club>;
    removeMember(clubId: string, userId: string, adminId: string): Promise<Club>;
    getClubByAdmin(adminId: string): Promise<Club[]>;
    getPendingRequests(clubId: string, adminId: string): Promise<Club>;
    getClubMembers(clubId: string, adminId: string): Promise<any>;
    searchClubs(query: string): Promise<Club[]>;
    getClubPerformance(clubId: string): Promise<any>;
    getClubEngagement(clubId: string): Promise<any>;
}
