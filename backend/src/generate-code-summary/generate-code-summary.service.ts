import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiApiHandlerService } from 'src/ai-api-handler/ai-api-handler.service';
import { repositorySHA } from 'src/database/schemas/repositorySHA.schema';
import { GitInteractionService } from 'src/git-interaction/git-interaction.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { subscription } from 'src/database/schemas/subscription.schema';
import { repositorySHADatabaseService } from 'src/database/services/repositorySHA.service';

@Injectable()
export class GenerateCodeSummaryService implements OnModuleInit {
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
    allSubs: subscription[],
  ): Promise<any> {
    for (const repo of repos) {
      const repository: repositorySHA = SHAMap.find(
        (entry) => entry.repository === repo,
      );
      let managerMailList: string = '';
      let peerDeveloperMailList: string = '';
      let learnerMailList: string = '';
      for (const sub of allSubs) {
        if (sub.subscriptionType == 'Peer Developer') {
          peerDeveloperMailList += sub.email;
          peerDeveloperMailList += ',';
        }
        if (sub.subscriptionType == 'Manager') {
          managerMailList += sub.email;
          managerMailList += ',';
        }
        if (sub.subscriptionType == 'Learner') {
          learnerMailList += sub.email;
          learnerMailList += ',';
        }
      }
      if (repository) {
        const repoSHA: string = repository.SHA;
        const retrievedCode = await this.gitService.getUpdatedCodeFromCommit(
          repo,
          repoSHA,
        );
        const peerDeveloperPrompt: string =
          this.aiService.generatePeerDeveloperPrompt(retrievedCode);
        const peerDeveloperSummary: string =
          await this.aiService.getSummaryFromAiModel(peerDeveloperPrompt);
        const managerPrompt: string =
          this.aiService.generateManagerPrompt(retrievedCode);
        const managerSummary: string =
          await this.aiService.getSummaryFromAiModel(managerPrompt);
        const learnerPrompt: string =
          this.aiService.generateLearnerPrompt(retrievedCode);
        const learnerSummary: string =
          await this.aiService.getSummaryFromAiModel(learnerPrompt);
        await this.mailService.sendMail(
          peerDeveloperSummary,
          peerDeveloperMailList,
        );
        await this.mailService.sendMail(managerSummary, managerMailList);
        await this.mailService.sendMail(learnerSummary, learnerMailList);
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
    this.mailService.sendMail(summary, 'karthik.pv77@gmail.com');
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
    return await this.subscriptionCore(
      repos,
      updatedSHAValues,
      allSubscriptions,
    );
  }

  private startInterval() {
    this.subscriptionCycle(); // Run it immediately once
    setInterval(
      () => {
        this.subscriptionCycle();
      },
      5 * 60 * 1000,
    ); // 10 minutes in milliseconds
  }
  onModuleInit() {
    this.startInterval();
  }
}
