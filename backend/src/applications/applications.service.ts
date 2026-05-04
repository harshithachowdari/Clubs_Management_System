import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from './schemas/application.schema';
import { MembershipsService } from '../memberships/memberships.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private membershipsService: MembershipsService,
  ) {}

  async create(applicationData: any): Promise<Application> {
    const application = new this.applicationModel(applicationData);
    return application.save();
  }

  async findByClub(clubId: string): Promise<Application[]> {
    return this.applicationModel.find({ club: clubId, status: 'pending' }).populate('user').exec();
  }

  async findByUser(userId: string): Promise<Application[]> {
    return this.applicationModel.find({ user: userId }).populate('club').exec();
  }

  async updateStatus(applicationId: string, status: string, adminId: string): Promise<Application> {
    const application = await this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status, reviewedBy: adminId, reviewedAt: new Date() },
      { new: true }
    ).exec();
    if (!application) throw new NotFoundException('Application not found');

    if (status === 'approved') {
      await this.membershipsService.create({
        user: application.user,
        club: application.club,
        role: application.positionApplied,
        status: 'active',
      });
    }

    return application;
  }
}
