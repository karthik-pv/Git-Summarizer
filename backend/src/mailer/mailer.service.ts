import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { marked } from 'marked';

@Injectable()
export class MailerService {
  private transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendMail(content: string) {
    const htmlContent = marked(content);
    const mailOptions = {
      from: 'gitsummarizer@gmail.com',
      to: 'ananyabhat.cs22@rvce.edu.in',
      subject: 'test',
      text: content,
      html: htmlContent,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
