"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const club_schema_1 = require("./schemas/club.schema");
const membership_schema_1 = require("../memberships/schemas/membership.schema");
const users_service_1 = require("../users/users.service");
let ClubsService = class ClubsService {
    constructor(clubModel, membershipModel, usersService) {
        this.clubModel = clubModel;
        this.membershipModel = membershipModel;
        this.usersService = usersService;
    }
    async create(createClubDto) {
        const adminUser = await this.usersService.findOne(createClubDto.adminId);
        if (adminUser.managedClubs && adminUser.managedClubs.length > 0) {
            throw new common_1.ConflictException('This admin is already managing another club');
        }
        const existingClub = await this.clubModel.findOne({ name: createClubDto.name });
        if (existingClub) {
            throw new common_1.ConflictException('Club with this name already exists');
        }
        const club = new this.clubModel(createClubDto);
        return club.save();
    }
    async findAll() {
        return this.clubModel.find({ isActive: true }).exec();
    }
    async findOne(id) {
        const club = await this.clubModel.findById(id).exec();
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        return club;
    }
    async findByCategory(category) {
        return this.clubModel.find({ category, isActive: true }).exec();
    }
    async update(id, updateClubDto) {
        const club = await this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true }).exec();
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        return club;
    }
    async remove(id) {
        const club = await this.clubModel.findByIdAndDelete(id).exec();
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        return club;
    }
    async joinClub(clubId, userId) {
        console.log(`ClubsService.joinClub: userId ${userId} joining clubId ${clubId}`);
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            console.error(`ClubsService.joinClub: Club ${clubId} not found`);
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.members.includes(userId)) {
            console.warn(`ClubsService.joinClub: User ${userId} already member of ${clubId}`);
            throw new common_1.ConflictException('User is already a member of this club');
        }
        const memberId = String(userId);
        if (!club.members.includes(memberId)) {
            club.members.push(memberId);
            club.memberCount = club.members.length;
        }
        club.pendingRequests = club.pendingRequests.filter(id => String(id) !== memberId);
        const savedClub = await club.save();
        console.log(`ClubsService.joinClub: Club ${clubId} saved with ${savedClub.memberCount} members`);
        console.log(`ClubsService.joinClub: Updating user ${userId} joinedClubs`);
        await this.usersService.joinClub(memberId, String(clubId));
        const existingMembership = await this.membershipModel.findOne({ user: memberId, club: clubId, status: 'active' });
        if (!existingMembership) {
            const membership = new this.membershipModel({
                user: memberId,
                club: clubId,
                role: 'member',
                status: 'active',
                joinedAt: new Date(),
            });
            await membership.save();
            console.log(`ClubsService.joinClub: Membership record created for user ${userId} and club ${clubId}`);
        }
        return savedClub;
    }
    async approveMember(clubId, userId, adminId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.adminId !== adminId) {
            throw new Error('Only club admin can approve members');
        }
        if (!club.pendingRequests.includes(userId)) {
            throw new common_1.NotFoundException('User not found in pending requests');
        }
        club.pendingRequests = club.pendingRequests.filter(id => id !== userId);
        club.members.push(userId);
        club.memberCount = club.members.length;
        return club.save();
    }
    async rejectMember(clubId, userId, adminId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.adminId !== adminId) {
            throw new Error('Only club admin can reject members');
        }
        club.pendingRequests = club.pendingRequests.filter(id => id !== userId);
        return club.save();
    }
    async removeMember(clubId, userId, adminId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.adminId !== adminId) {
            throw new Error('Only club admin can remove members');
        }
        club.members = club.members.filter(id => id !== userId);
        club.memberCount = club.members.length;
        return club.save();
    }
    async getClubByAdmin(adminId) {
        return this.clubModel.find({ adminId, isActive: true }).exec();
    }
    async getPendingRequests(clubId, adminId) {
        const club = await this.clubModel.findById(clubId).populate('pendingRequests').exec();
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.adminId !== adminId) {
            throw new Error('Only club admin can view pending requests');
        }
        return club;
    }
    async getClubMembers(clubId, adminId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        if (club.adminId !== adminId) {
            throw new Error('Only club admin can view members');
        }
        return this.usersService.findAll().then(users => users.filter(user => club.members.includes(user._id.toString())));
    }
    async searchClubs(query) {
        const regex = new RegExp(query, 'i');
        return this.clubModel.find({
            isActive: true,
            $or: [
                { name: regex },
                { description: regex },
                { tags: { $in: [regex] } }
            ]
        }).exec();
    }
    async getClubPerformance(clubId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        return {
            eventsOrganized: 5,
            activeParticipationRate: '75%',
            recentActivitiesCount: 12,
            overallPerformance: 'Excellent',
            memberGrowth: '+10% this month'
        };
    }
    async getClubEngagement(clubId) {
        const club = await this.clubModel.findById(clubId);
        if (!club) {
            throw new common_1.NotFoundException('Club not found');
        }
        return {
            averageEventAttendance: 45,
            mostActiveMembers: [],
            topEvents: [],
            engagementScore: 88
        };
    }
};
exports.ClubsService = ClubsService;
exports.ClubsService = ClubsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(club_schema_1.Club.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], ClubsService);
//# sourceMappingURL=clubs.service.js.map