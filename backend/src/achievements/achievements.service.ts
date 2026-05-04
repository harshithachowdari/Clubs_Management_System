import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement } from './schemas/achievement.schema';

@Injectable()
export class AchievementsService {
  constructor(@InjectModel(Achievement.name) private achievementModel: Model<Achievement>) {}

  async create(achievementData: any): Promise<Achievement> {
    const achievement = new this.achievementModel(achievementData);
    return achievement.save();
  }

  async findByClub(clubId: string): Promise<Achievement[]> {
    return this.achievementModel.find({ club: clubId }).sort({ date: -1 }).exec();
  }

  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.find().populate('club').sort({ date: -1 }).exec();
  }

  async remove(achievementId: string): Promise<void> {
    const result = await this.achievementModel.findByIdAndDelete(achievementId).exec();
    if (!result) throw new NotFoundException('Achievement not found');
  }
}
