import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDtoIn, LoginDtoOut } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

    return res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      email: result.email,
    });
  }
}
