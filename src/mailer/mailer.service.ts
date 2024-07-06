import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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
    const mailOptions = {
      from: 'gitsummarizer@gmail.com',
      to: 'karthik.pv77@gmail.com',
      subject: 'test',
      text: content,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
