import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiApiHandlerService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getSummaryFromAiModel(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  }

  generatePeerDeveloperPrompt(code: string): string {
    const prompt =
      'Look at the code provided below and give details about\
    include details of the following - \
    1 - libraries / dependencies used \
    2 - algorithms used \
    3 - third party services used \
    4 - coding patterns used \
    5 - design patterns used \n\n';
    const finalPrompt = prompt + code;
    return finalPrompt;
  }
}
