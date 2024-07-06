import { Injectable } from '@nestjs/common';
import { AiApiHandlerService } from 'src/ai-api-handler/ai-api-handler.service';
import { repositorySHA } from 'src/database/schemas/repositorySHA.schema';
import { GitInteractionService } from 'src/git-interaction/git-interaction.service';
import { MailerService } from 'src/mailer/mailer.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class GenerateCodeSummaryService {
  constructor(
    private subService: SubscriptionService,
    private gitService: GitInteractionService,
    private aiService: AiApiHandlerService,
    private mailService: MailerService,
  ) {}
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

  async subscriptionCycle(): Promise<repositorySHA[]> {
    const repos: string[] = await this.subService.getUniqueRepositories();
    const updatedRepos: repositorySHA[] =
      await this.gitService.checkIfNewCommitExists(repos);
    return updatedRepos;
  }
}
