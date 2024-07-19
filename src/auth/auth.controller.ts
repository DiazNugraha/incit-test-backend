import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
