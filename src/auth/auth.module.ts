import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { FacebookAuthService } from './oauth/facebook-auth.service';
import { HttpModule } from '@nestjs/axios';
import { GoogleAuthService } from './oauth/google-auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secretKey'),
      }),
      inject: [ConfigService],
    }),
    JwtAuthModule,
    ConfigModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtService,
    FacebookAuthService,
    GoogleAuthService,
  ],
  exports: [
    AuthService,
    UserService,
    JwtService,
    FacebookAuthService,
    GoogleAuthService,
  ],
})
export class AuthModule {}
