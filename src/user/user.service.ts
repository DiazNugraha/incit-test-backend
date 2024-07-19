import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDtoOut } from './dto/user.dto';
import { PasswordHash } from 'src/security/password-hash';
import { MailService } from 'src/common/services/mail.service';
import { UserOauthEntity } from './entity/user-oauth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserOauthEntity)
    private readonly userOauthRepository: Repository<UserOauthEntity>,
    private passwordHash: PasswordHash,
    private mailService: MailService,
  ) {}

  async signUp(
    email: string,
    password: string,
    hostUrl: string,
  ): Promise<void> {
    const hashedPassword = await this.passwordHash.hash(password);
    const token = this.mailService.generateVerificationToken();

    const newUser = await this.userRepository.create({
      email: email,
      password: hashedPassword,
      emailVerificationToken: token,
    });

    const verificationUrl = `${hostUrl}/auth/verify?token=${token}`;

    await this.userRepository.save(newUser);

    await this.mailService.sendVerificationEmail(
      email,
      'Email Verification',
      '',
      `Please click the following link to verify your email: ${verificationUrl}`,
    );
  }

  async verifyEmailToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      emailVerificationToken: token,
    });
    if (!user) {
      return null;
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);
    return user;
  }

  async login(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    if (!(await this.passwordHash.compare(password, user.password))) {
      return null;
    }

    if (!user.emailVerified) {
      return null;
    }

    return user;
  }

  async userOauth(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const findUserOauth = await this.userOauthRepository.findOneBy({
      userId: user.id,
    });
    if (findUserOauth) {
      findUserOauth.accessToken = accessToken;
      findUserOauth.refreshToken = refreshToken;
      findUserOauth.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await this.userOauthRepository.save(findUserOauth);
      console.log('hereee');
      return;
    }
    const userOauth = this.userOauthRepository.create({
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      providerId: 1,
    });

    await this.userOauthRepository.save(userOauth);
  }
}
