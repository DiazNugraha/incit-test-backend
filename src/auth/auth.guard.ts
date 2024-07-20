import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const user = await this.jwtAuthService.verifyToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    request.user = user;
    return true;
  }
}
