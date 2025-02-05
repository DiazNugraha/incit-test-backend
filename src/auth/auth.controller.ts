import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDtoIn } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthService } from './oauth/facebook-auth.service';
import { GoogleAuthService } from './oauth/google-auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private facebookAuthService: FacebookAuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Get('verify')
  async verifyEmail(
    @Query('token') token: string,
    @Res() res: any,
  ): Promise<void> {
    const user = await this.authService.verifyEmailToken(token);
    const frontendUrl = process.env.FRONTEND_URL;
    if (user) {
      return res.redirect(`${frontendUrl}/?verified=true`);
    }

    return res.redirect(`${frontendUrl}/?verified=false`);
  }

  @Post('login')
  async login(@Body() loginDtoIn: LoginDtoIn, @Res() res: Response) {
    const { email, password } = loginDtoIn;

    const result = await this.authService.login(email, password);
    if (!result) {
      return null;
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('userId', result.id, {
      httpOnly: false,
    });

    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}`);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('userId');
    return res.json({ message: 'Logout successful' });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const result = await this.authService.refreshToken(refreshToken);
    if (!result) {
      return null;
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}`);
  }

  // FACEBOOK OAUTH
  @Get('facebook')
  async facebookAuth(@Res() res: Response) {
    const { app_id, redirect_uri } = this.configService.get('oauth.facebook');
    const scopes = ['public_profile', 'email'];
    const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${app_id}&redirect_uri=${redirect_uri}&scope=${scopes.join(',')}`;
    res.redirect(authUrl);
  }

  @Get('facebook/redirect')
  async facebookAuthRedirect(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const accessToken =
      await this.facebookAuthService.getFacebookAccessToken(code);
    const profile =
      await this.facebookAuthService.getFacebookUserProfile(accessToken);
    const result = await this.authService.validateOauthLogin(
      profile.name,
      profile.email,
      3,
    );
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('userId', result.id, {
      httpOnly: false,
    });

    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}`);
  }

  // GOOGLE OAUTH
  @Get('google')
  googleAuth(@Res() res: Response) {
    const url = this.googleAuthService.generateAuthUrl();
    res.redirect(url);
  }

  @Get('google/redirect')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const accessToken = await this.googleAuthService.getGoogleAccessToken(code);
    const profile = await this.googleAuthService.getGoogleUserProfile(
      accessToken.id_token,
    );
    const result = await this.authService.validateOauthLogin(
      profile.name,
      profile.email,
      2,
    );
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('userId', result.id, {
      httpOnly: false,
    });

    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}`);
  }
}
