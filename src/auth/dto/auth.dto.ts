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
  email: string;

  @ApiProperty()
  refreshToken: string;
}

export class ChangePasswordDtoIn {
  @ApiProperty()
  newPassword: string;
}
