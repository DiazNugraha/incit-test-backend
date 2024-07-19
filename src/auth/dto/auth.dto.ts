import { ApiProperty } from '@nestjs/swagger';

export class LoginDtoIn {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginDtoOut {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: any;

  @ApiProperty()
  refreshToken: string;
}

export class ChangePasswordDtoIn {
  @ApiProperty()
  newPassword: string;
}
