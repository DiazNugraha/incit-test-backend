import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { PasswordHash } from 'src/security/password-hash';
import { UserController } from './user.controller';
import { MailService } from 'src/common/services/mail.service';
import { UserOauthEntity } from './entity/user-oauth.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserOauthEntity])],
  providers: [
    UserService,
    PasswordHash,
    MailService,
    AuthGuard,
    JwtAuthService,
    JwtService,
    ConfigService,
  ],
  controllers: [UserController],
  exports: [TypeOrmModule, PasswordHash, UserService, MailService],
})
export class UserModule {}
