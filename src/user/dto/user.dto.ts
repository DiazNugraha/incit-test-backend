import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UserDtoOut {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

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
    this.name = user.name;
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

  @ApiProperty()
  name: string;
}

export class CreateUserDtoIn {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}

export class ChangePasswordDtoIn {
  @ApiProperty()
  oldPassword: string | null;

  @ApiProperty()
  newPassword: string;
}

export class ChangeNameDtoIn {
  @ApiProperty()
  name: string;
}

export class UserListDtoOut {
  @ApiProperty()
  users: UserInfoDtoOut[];
}

export class UserInfoDtoOut {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  loginCount: number;

  @ApiProperty()
  lastLoginAt: Date;

  @ApiProperty()
  lastLogoutAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class UserStatisticsDtoOut {
  @ApiProperty()
  userCount: number;

  @ApiProperty()
  activeUserCount: number;

  @ApiProperty()
  averageActiveUserCount: number;
}
