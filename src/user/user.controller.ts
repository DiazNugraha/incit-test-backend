import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDtoIn } from './dto/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  async signUp(
    @Body() createUserDtoIn: CreateUserDtoIn,
    @Req() request: Request,
  ): Promise<void> {
    const protocol = request.protocol;
    const host = request.get('host');
    const hostUrl = `${protocol}://${host}`;
    const { email, password, name } = createUserDtoIn;
    await this.userService.signUp(name, email, password, hostUrl);
  }
}
