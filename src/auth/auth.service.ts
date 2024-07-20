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
    private readonly configService: ConfigService,
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

    const loginDtoOut: LoginDtoOut = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: user.email,
    };

    return loginDtoOut;
  }

  async logout(refreshToken: string) {
    await this.userService.logout(refreshToken);
  }

  async generateToken(email: string) {
    const payload = { email: email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secretKey'),
      expiresIn: '1h', // Access token lifespan
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secretKey'),
      expiresIn: '7d', // Refresh token lifespan
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('jwt.secretKey'),
    });
    const accessToken = this.jwtService.sign(
      { email: payload.email },
      {
        secret: this.configService.get('jwt.secretKey'),
        expiresIn: '1h', // Access token lifespan
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { email: payload.email },
      {
        secret: this.configService.get('jwt.secretKey'),
        expiresIn: '7d', // Refresh token lifespan
      },
    );

    const findUser = await this.userService.findUserByEmail(payload.email);
    if (!findUser) {
      return null;
    }

    await this.userService.userOauth(findUser, accessToken, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async validateOauthLogin(
    name: string,
    email: string,
    providerId: number,
  ): Promise<LoginDtoOut> {
    const { accessToken, refreshToken } = await this.generateToken(email);
    const user = await this.userService.validateOauthLogin(
      name,
      email,
      accessToken,
      refreshToken,
      providerId,
    );
    return { accessToken, refreshToken, email: user.email };
  }
}
