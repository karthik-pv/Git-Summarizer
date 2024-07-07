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
      const customPromptMailList: subscription[] = []; // Initialize the array

      for (const sub of allSubs) {
        if (
          sub.subscriptionType == 'Peer Developer' &&
          sub.repository === repo
        ) {
          peerDeveloperMailList += sub.email + ',';
        }
        if (sub.subscriptionType == 'Manager' && sub.repository === repo) {
          managerMailList += sub.email + ',';
        }
        if (sub.subscriptionType == 'Learner' && sub.repository === repo) {
          learnerMailList += sub.email + ',';
        }
        if (sub.subscriptionType == 'Custom' && sub.repository === repo) {
          customPromptMailList.push(sub);
        }
      }

      // Remove trailing commas
      peerDeveloperMailList = peerDeveloperMailList.slice(0, -1);
      managerMailList = managerMailList.slice(0, -1);
      learnerMailList = learnerMailList.slice(0, -1);

      // Log the email lists
      console.log('Peer Developer Email List:', peerDeveloperMailList);
      console.log('Manager Email List:', managerMailList);
      console.log('Learner Email List:', learnerMailList);
      console.log(
        'Custom Prompt Email List:',
        customPromptMailList.map((sub) => sub.email),
      );

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

        // Check if there are recipients before sending emails
        if (peerDeveloperMailList) {
          await this.mailService.sendMail(
            peerDeveloperSummary,
            peerDeveloperMailList,
          );
        }

        if (managerMailList) {
          await this.mailService.sendMail(managerSummary, managerMailList);
        }

        if (learnerMailList) {
          await this.mailService.sendMail(learnerSummary, learnerMailList);
        }

        for (const sub of customPromptMailList) {
          const prompt = this.aiService.generateCustomPrompt(
            sub.customPrompt,
            retrievedCode,
          );
          const customPromptSummary: string =
            await this.aiService.getSummaryFromAiModel(prompt);
          await this.mailService.sendMail(customPromptSummary, sub.email);
        }
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

  async subscriptionCycle(): Promise<string> {
    const repos: string[] = await this.subService.getUniqueRepositories();
    const updatedRepos: repositorySHA[] =
      await this.gitService.checkIfNewCommitExists(repos);
    const updatedReposString: string[] = [];
    for (const rep of updatedRepos) {
      updatedReposString.push(rep.repository);
    }
    console.log(updatedReposString);
    const allSubscriptions: subscription[] =
      await this.subService.getAllSubscription();
    const updatedSHAValues: repositorySHA[] =
      await this.repoDBSHAService.getAllRepositorySHA();
    // return await this.subscriptionCore(
    //   repos,
    //   updatedSHAValues,
    //   allSubscriptions,
    // );
    return 'e';
  }

  private startInterval() {
    this.subscriptionCycle();
    setInterval(
      () => {
        this.subscriptionCycle();
      },
      5 * 60 * 1000,
    );
  }
  onModuleInit() {
    this.startInterval();
  }
}
