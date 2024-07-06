import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { repositorySHA } from '../schemas/repositorySHA.schema';

@Injectable()
export class repositorySHADatabaseService {
  constructor(
    @InjectModel('RepositorySHA')
    private repoDBAccess: Model<repositorySHA>,
  ) {}

  async createRepositorySHA(repo: repositorySHA): Promise<repositorySHA> {
    const createdRepoSHA = new this.repoDBAccess(repo);
    return await createdRepoSHA.save();
  }

  async getAllRepositorySHA(): Promise<repositorySHA[]> {
    return await this.repoDBAccess.find().exec();
  }
}
