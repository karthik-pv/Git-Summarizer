import { Injectable } from '@nestjs/common';
import { subscriptionDatabaseService } from 'src/database/services/subscription.service';
import { subscription } from 'src/database/schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(private subService: subscriptionDatabaseService) {}

  async createSubscription(subObj: subscription): Promise<subscription> {
    return this.subService.createSubscription(subObj);
  }

  async getUniqueRepositories(): Promise<string[]> {
    return this.subService.getUniqueRepositories();
  }

  async getUsersSubscribedToRepository(
    repoLink: string,
  ): Promise<subscription[]> {
    return this.getUsersSubscribedToRepository(repoLink);
  }
}
