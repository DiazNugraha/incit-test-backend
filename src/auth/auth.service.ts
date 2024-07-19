import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDtoOut } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyEmailToken(token: string) {
    const user = await this.userService.verifyEmailToken(token);
    return user;
  }

  async login(email: string, password: string): Promise<LoginDtoOut> {
    const user = await this.userService.login(email, password);
    if (!user) {
      return null;
    }
    const { accessToken, refreshToken } = await this.generateToken(email);
    await this.userService.userOauth(user, accessToken, refreshToken);
    console.log('keene');
    const loginDtoOut: LoginDtoOut = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: user.email,
    };

    return loginDtoOut;
  }

  async generateToken(email: string) {
    const configService = new ConfigService();
    const payload = { email: email };
    const accessToken = this.jwtService.sign(payload, {
      secret: configService.get('jwt.secretKey'),
      expiresIn: '1h', // Access token lifespan
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: configService.get('jwt.secretKey'),
      expiresIn: '7d', // Refresh token lifespan
    });

    return { accessToken, refreshToken };
  }
}
