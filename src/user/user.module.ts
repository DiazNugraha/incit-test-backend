import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { PasswordHash } from 'src/security/password-hash';
import { UserController } from './user.controller';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, PasswordHash, MailService],
  controllers: [UserController],
  exports: [TypeOrmModule, PasswordHash, UserService, MailService],
})
export class UserModule {}