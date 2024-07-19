import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import appConfig from 'config/app.config';

@Injectable()
export class MailService {
  private mailerConfig: {
    apiKey: string;
    senderEmail: string;
    senderName: string;
  };

  constructor() {
    this.mailerConfig = appConfig().mailer;
  }

  async sendVerificationEmail(
    email: string,
    subject?: string,
    html?: string,
    text?: string,
  ): Promise<void> {
    try {
      const mailerSend = new MailerSend({
        apiKey: this.mailerConfig.apiKey,
      });
      const sentFrom = new Sender(
        this.mailerConfig.senderEmail,
        this.mailerConfig.senderName,
      );

      const recipients = [new Recipient(email)];

      const emailParams = new EmailParams().setFrom(sentFrom).setTo(recipients);

      if (subject) {
        emailParams.setSubject(subject);
      }

      if (html) {
        emailParams.setHtml(html);
      }

      if (text) {
        emailParams.setText(text);
      }

      await mailerSend.email.send(emailParams);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  generateVerificationToken(): string {
    return uuidv4();
  }
}
