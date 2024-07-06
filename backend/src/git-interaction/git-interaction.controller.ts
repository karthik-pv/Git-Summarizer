import { Controller, Post, Body } from '@nestjs/common';
import { GitInteractionService } from './git-interaction.service';

@Controller('gitInteraction')
export class GitInteractionController {
  constructor(private gitService: GitInteractionService) {}

  @Post('getLatestCommitSHA')
  getLatestCommitSHA(@Body() body: string) {
    return this.gitService.getLatestSHAValue(body['repoURL']);
  }

  @Post('getLatestCommitCode')
  getUpdatedCodeFromCommit(@Body() body: string) {
    return this.gitService.getUpdatedCodeFromCommit(
      body['repoURL'],
      body['SHA'],
    );
  }
}
