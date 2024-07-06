import { Injectable } from '@nestjs/common';
import { AiApiHandlerService } from 'src/ai-api-handler/ai-api-handler.service';
import { repositorySHA } from 'src/database/schemas/repositorySHA.schema';
import { GitInteractionService } from 'src/git-interaction/git-interaction.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositorySHADatabaseService } from 'src/database/services/repositorySHA.service';

@Injectable()
export class GenerateCodeSummaryService {
  constructor(
    private subService: SubscriptionService,
    private gitService: GitInteractionService,
    private aiService: AiApiHandlerService,
    private mailService: MailerService,
    private repoDBSHAService: repositorySHADatabaseService,
  ) {}

  async subscriptionCore(
    repos: string[],
    SHAMap: repositorySHA[],
  ): Promise<any> {
    for (const repo of repos) {
      console.log(repo);
      console.log(SHAMap);
      const repository: repositorySHA = SHAMap.find(
        (entry) => entry.repository === repo,
      );
      console.log(repository);
      if (repository) {
        const repoSHA: string = repository.SHA;
        const retrievedCode = await this.gitService.getUpdatedCodeFromCommit(
          repo,
          repoSHA,
        );
        const prompt: string =
          this.aiService.generatePeerDeveloperPrompt(retrievedCode);
        const summary: string =
          await this.aiService.getSummaryFromAiModel(prompt);
        console.log(summary);
      }
    }
  }

  async fullCycle(): Promise<string> {
    const repos: string[] = await this.subService.getUniqueRepositories();
    const link = 'https://github.com/karthik-pv/Emuser';
    const SHA: string = await this.gitService.getLatestSHAValue(link);
    const code: any = await this.gitService.getUpdatedCodeFromCommit(link, SHA);
    const prompt: string = this.aiService.generatePeerDeveloperPrompt(code);
    const summary: string = await this.aiService.getSummaryFromAiModel(prompt);
    this.mailService.sendMail(summary);
    return 'successful';
  }

  async subscriptionCycle(): Promise<subscription[]> {
    const repos: string[] = await this.subService.getUniqueRepositories();
    const updatedRepos: repositorySHA[] =
      await this.gitService.checkIfNewCommitExists(repos);
    const allSubscriptions: subscription[] =
      await this.subService.getAllSubscription();
    const updatedSHAValues: repositorySHA[] =
      await this.repoDBSHAService.getAllRepositorySHA();
    await this.subscriptionCore(repos, updatedSHAValues);
    return allSubscriptions;
  }
}
