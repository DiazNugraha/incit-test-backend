import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDtoOut } from './dto/user.dto';
import { PasswordHash } from 'src/security/password-hash';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
}
