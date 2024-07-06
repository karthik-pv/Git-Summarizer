import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { repositorySHA } from 'src/database/schemas/repositorySHA.schema';
import { repositorySHADatabaseService } from 'src/database/services/repositorySHA.service';
import {
  subscription,
  subscriptionSchema,
} from 'src/database/schemas/subscription.schema';

@Injectable()
export class GitInteractionService {
  constructor(private repoSHADatabaseService: repositorySHADatabaseService) {}
  private formatRetrievedCodeToString(patchData: any): string {
    const formattedPatches = patchData.map((patch) => {
      const filename = patch.filename;
      const patchContent = patch.content.replace(/\\n/g, '\n');
      return `Filename: ${filename}\nContent:\n${patchContent}`;
    });

    return formattedPatches.join('\n\n');
  }

  private extractOwnerAndRepo(repoUrl: string): {
    owner: string;
    repo: string;
  } {
    if (typeof repoUrl !== 'string') {
      throw new Error('Invalid input: repoUrl must be a string');
    }
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);

    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return { owner: match[1], repo: match[2] };
  }
  private readonly GITHUB_API_URL = 'https://api.github.com/repos';
  private readonly GITHUB_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
  async getLatestSHAValue(repoUrl: string): Promise<string> {
    try {
      const { owner, repo } = this.extractOwnerAndRepo(repoUrl);

      const response = await axios.get(
        `${this.GITHUB_API_URL}/${owner}/${repo}/commits`,
        {
          headers: {
            Authorization: `token ${this.GITHUB_ACCESS_TOKEN}`,
          },
        },
      );

      const latestCommitSha = response.data[0].sha;
      return latestCommitSha;
    } catch (error) {
      console.error('Error fetching the latest commit:', error);
      throw new HttpException('Failed to fetch the latest commit', 500);
    }
  }

  async getUpdatedCodeFromCommit(
    repoUrl: string,
    commitSha: string,
  ): Promise<any> {
    try {
      const { owner, repo } = this.extractOwnerAndRepo(repoUrl);
      const response = await axios.get(
        `${this.GITHUB_API_URL}/${owner}/${repo}/commits/${commitSha}`,
        {
          headers: {
            Authorization: `token ${this.GITHUB_ACCESS_TOKEN}`,
          },
        },
      );

      const files = response.data.files;

      const updatedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.status === 'removed') {
            return {
              filename: file.filename,
              status: file.status,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
              patch: file.patch,
              content: null,
            };
          }

          const rawContentResponse = await axios.get(file.raw_url);

          return {
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            patch: file.patch,
            content: rawContentResponse.data,
          };
        }),
      );

      return this.formatRetrievedCodeToString(updatedFiles);
    } catch (error) {
      console.error('Error fetching the commit details:', error);
      throw new HttpException('Failed to fetch the commit details', 500);
    }
  }
  async checkIfNewCommitExists(
    repositories: string[],
  ): Promise<repositorySHA[]> {
    const updatedRepoSHAs: repositorySHA[] = [];
    const existingSHAValues: repositorySHA[] =
      await this.repoSHADatabaseService.getAllRepositorySHA();

    try {
      for (const sub of repositories) {
        const latestSHA = await this.getLatestSHAValue(sub);
        const existingSHA = existingSHAValues.find(
          (repoSHA) => repoSHA.repository === sub,
        );

        if (!existingSHA || existingSHA.SHA !== latestSHA) {
          updatedRepoSHAs.push({ repository: sub, SHA: latestSHA });
        }
      }
    } catch (error) {
      console.error('Error checking for new commits:', error);
    }

    return updatedRepoSHAs;
  }
}
