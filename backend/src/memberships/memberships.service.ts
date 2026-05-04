import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership } from './schemas/membership.schema';

@Injectable()
export class MembershipsService {
  constructor(@InjectModel(Membership.name) private membershipModel: Model<Membership>) {}

  async create(membershipData: any): Promise<Membership> {
    const membership = new this.membershipModel(membershipData);
    return membership.save();
  }

  async findByClub(clubId: string): Promise<Membership[]> {
    return this.membershipModel.find({ club: clubId, status: 'active' }).populate('user').exec();
  }

  async findByUser(userId: string): Promise<Membership[]> {
    return this.membershipModel.find({ user: userId, status: 'active' }).populate('club').exec();
  }

  async remove(membershipId: string): Promise<void> {
    await this.membershipModel.findByIdAndUpdate(membershipId, { status: 'inactive' }).exec();
  }
}
