import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubCategory } from './schemas/club.schema';
export declare class ClubsController {
    private readonly clubsService;
    constructor(clubsService: ClubsService);
    ping(): string;
    create(createClubDto: CreateClubDto): Promise<import("./schemas/club.schema").Club>;
    findAll(): Promise<import("./schemas/club.schema").Club[]>;
    search(query: string): Promise<import("./schemas/club.schema").Club[]>;
    findByCategory(category: ClubCategory): Promise<import("./schemas/club.schema").Club[]>;
    getMyClubs(req: any): Promise<import("./schemas/club.schema").Club[]>;
    findOne(id: string): Promise<import("./schemas/club.schema").Club>;
    update(id: string, updateClubDto: UpdateClubDto, req: any): Promise<import("./schemas/club.schema").Club>;
    remove(id: string): Promise<import("./schemas/club.schema").Club>;
    joinClub(id: string, req: any): Promise<import("./schemas/club.schema").Club>;
    approveMember(id: string, userId: string, req: any): Promise<import("./schemas/club.schema").Club>;
    rejectMember(id: string, userId: string, req: any): Promise<import("./schemas/club.schema").Club>;
    removeMember(id: string, userId: string, req: any): Promise<import("./schemas/club.schema").Club>;
    getPendingRequests(id: string, req: any): Promise<import("./schemas/club.schema").Club>;
    getMembers(id: string, req: any): Promise<any>;
    getPerformance(id: string): Promise<any>;
    getEngagement(id: string): Promise<any>;
}
