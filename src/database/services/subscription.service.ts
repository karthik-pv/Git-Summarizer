import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { subscription } from '../schemas/subscription.schema';

@Injectable()
export class subscriptionDatabaseService {
  constructor(
    @InjectModel('Subscription')
    private sub: Model<subscription>,
  ) {}

  async createSubscription(sub: subscription): Promise<subscription> {
    const createdSubscription = new this.sub(sub);
    return await createdSubscription.save();
  }

  async getUniqueRepositories(): Promise<string[]> {
    return this.sub.distinct('repository').exec();
  }

  async getUsersForRepository(repo: string): Promise<subscription[]> {
    return this.sub.find({ repository: repo }).exec();
  }

  async getAllSubscriptions(): Promise<subscription[]> {
    return this.sub.find().exec();
  }
}
