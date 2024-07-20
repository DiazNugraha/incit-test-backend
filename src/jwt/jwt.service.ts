import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(userId: number) {
    const payload = { userId: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secretKey'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secretKey'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secretKey'),
      });
    } catch (error) {
      return null;
    }
  }
}
