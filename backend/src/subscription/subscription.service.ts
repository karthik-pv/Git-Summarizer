import { Injectable } from '@nestjs/common';
import { subscriptionDatabaseService } from 'src/database/services/subscription.service';
import { repositorySHADatabaseService } from 'src/database/services/repositorySHA.service';
import { subscription } from 'src/database/schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    private subService: subscriptionDatabaseService,
    private repoSHAService: repositorySHADatabaseService,
  ) {}

  async createSubscription(subObj: subscription): Promise<subscription> {
    this.repoSHAService.createRepositorySHA({
      repository: subObj.repository,
      SHA: '',
    });
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

  async getAllSubscription(): Promise<subscription[]> {
    return await this.subService.getAllSubscriptions();
  }
}
