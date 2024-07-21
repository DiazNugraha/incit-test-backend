import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChangePasswordDtoIn,
  CreateUserDtoOut,
  UserInfoDtoOut,
  UserListDtoOut,
  UserStatisticsDtoOut,
} from './dto/user.dto';
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
    name: string,
    email: string,
    password: string,
    hostUrl: string,
  ): Promise<void> {
    const hashedPassword = await this.passwordHash.hash(password);
    const token = this.mailService.generateVerificationToken();

    const newUser = await this.userRepository.create({
      name: name,
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

    user.loginCount += 1;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    if (!user.emailVerified) {
      return null;
    }

    return user;
  }

  async logout(refreshToken: string): Promise<void> {
    const findUserOauth = await this.userOauthRepository.findOneBy({
      refreshToken: refreshToken,
    });
    const findUser = await this.userRepository.findOneBy({
      id: findUserOauth.userId,
    });
    if (findUserOauth && findUser) {
      findUserOauth.expiresAt = new Date(Date.now() - 1);
      findUserOauth.refreshToken = null;
      await this.userOauthRepository.save(findUserOauth);

      findUser.lastLogoutAt = new Date();
      await this.userRepository.save(findUser);
    }
  }

  async userOauth(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
    providerId?: number,
  ): Promise<void> {
    const findUserOauth = await this.userOauthRepository.findOneBy({
      userId: user.id,
    });
    if (findUserOauth) {
      findUserOauth.accessToken = accessToken;
      findUserOauth.refreshToken = refreshToken;
      findUserOauth.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await this.userOauthRepository.save(findUserOauth);
      return;
    }
    const userOauth = this.userOauthRepository.create({
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      providerId: providerId ? providerId : 1,
    });

    await this.userOauthRepository.save(userOauth);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }

  async validateOauthLogin(
    name: string,
    email: string,
    accessToken: string,
    refreshToken: string,
    providerId: number,
  ): Promise<UserEntity> {
    let user = await this.userRepository.findOneBy({ email });
    if (!user) {
      user = this.userRepository.create({
        name: name,
        email: email,
        emailVerified: true,
        loginCount: 1,
        lastLoginAt: new Date(),
      });

      await this.userRepository.save(user);
      await this.userOauth(user, accessToken, refreshToken, providerId);
      return user;
    }

    user.loginCount += 1;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    await this.userOauth(user, accessToken, refreshToken, providerId);
    return user;
  }

  async changePassword(
    userId: number,
    changePasswordDtoIn: ChangePasswordDtoIn,
  ): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      return false;
    }
    if (!user.password) {
      user.password = await this.passwordHash.hash(
        changePasswordDtoIn.newPassword,
      );
      await this.userRepository.save(user);
      return true;
    }

    if (
      !(await this.passwordHash.compare(
        changePasswordDtoIn.oldPassword,
        user.password,
      ))
    ) {
      return false;
    }

    user.password = await this.passwordHash.hash(
      changePasswordDtoIn.newPassword,
    );
    await this.userRepository.save(user);
    return true;
  }

  async changeName(userId: number, name: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      return false;
    }
    user.name = name;
    await this.userRepository.save(user);
    return true;
  }

  async getProfile(userId: number): Promise<CreateUserDtoOut> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getUserList(): Promise<UserListDtoOut> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'email',
        'name',
        'loginCount',
        'lastLoginAt',
        'lastLogoutAt',
        'createdAt',
      ],
    });
    const result: UserInfoDtoOut[] = [];
    for (const user of users) {
      result.push({
        id: user.id,
        email: user.email,
        name: user.name,
        loginCount: user.loginCount,
        lastLoginAt: user.lastLoginAt,
        lastLogoutAt: user.lastLogoutAt,
        createdAt: user.createdAt,
      });
    }

    return {
      users: result,
    };
  }

  async getUserStatistics(): Promise<UserStatisticsDtoOut> {
    const userCount = await this.userRepository.count();
    const activeUserCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.lastLoginAt > user.lastLogoutAt')
      .getCount();

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const activeSessionsQuery = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.last_login_at)', 'logindate')
      .addSelect('COUNT(user.id)', 'activesessions')
      .where('user.last_login_at > :sevenDaysAgo', { sevenDaysAgo })
      .andWhere('user.last_login_at > user.last_logout_at')
      .groupBy('logindate')
      .getRawMany();

    const dailyCounts = Array(7).fill(0);

    activeSessionsQuery.forEach((row) => {
      const index = Math.floor(
        (new Date().getTime() - new Date(row.logindate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (index >= 0 && index < 7) {
        dailyCounts[6 - index] = parseInt(row.activesessions, 10);
      }
    });

    const totalActiveSessions = dailyCounts.reduce(
      (acc, count) => acc + count,
      0,
    );
    const averageActiveSessions = totalActiveSessions / 7;

    return {
      userCount: userCount,
      activeUserCount: activeUserCount,
      averageActiveUserCount: averageActiveSessions.toFixed(2),
    };
  }
}
