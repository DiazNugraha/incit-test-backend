import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookAuthService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getFacebookAccessToken(code: string): Promise<string> {
    const clientId = this.configService.get('oauth.facebook.app_id');
    const clientSecret = this.configService.get('oauth.facebook.app_secret');
    const redirectUri = this.configService.get('oauth.facebook.redirect_uri');

    const tokenUrl = `https://graph.facebook.com/v10.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`;

    const response = await lastValueFrom(this.httpService.post(tokenUrl));
    if (response.data.error) {
      throw new UnauthorizedException(response.data.error.message);
    }
    return response.data.access_token;
  }

  async getFacebookUserProfile(accessToken: string): Promise<any> {
    const profileUrl = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`;
    const response = await lastValueFrom(this.httpService.get(profileUrl));
    if (response.data.error) {
      throw new UnauthorizedException(response.data.error.message);
    }
    return response.data;
  }
}
