import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get('oauth.google.app_id'),
      this.configService.get('oauth.google.app_secret'),
      this.configService.get('oauth.google.redirect_uri'),
    );
  }

  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async getGoogleAccessToken(code: string): Promise<any> {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
    return tokens;
  }

  async getGoogleUserProfile(accessToken: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken: accessToken,
      audience: this.configService.get('oauth.google.app_id'),
    });
    const payload = ticket.getPayload();
    return payload;
  }
}
