import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UserDtoOut {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  loginCount: number;

  @ApiProperty()
  lastLoginAt: Date;

  @ApiProperty()
  lastLogoutAt: Date;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  emailVerificationToken: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.loginCount = user.loginCount;
    this.lastLoginAt = user.lastLoginAt;
    this.lastLogoutAt = user.lastLogoutAt;
    this.emailVerified = user.emailVerified;
    this.emailVerificationToken = user.emailVerificationToken;
  }
}

export class CreateUserDtoOut {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class CreateUserDtoIn {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
