import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangeNameDtoIn,
  ChangePasswordDtoIn,
  CreateUserDtoIn,
  CreateUserDtoOut,
} from './dto/user.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Post('change-password/:id')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDtoIn: ChangePasswordDtoIn,
    @Param('id') id: number,
  ): Promise<boolean> {
    const response = await this.userService.changePassword(
      id,
      changePasswordDtoIn,
    );

    if (!response) {
      throw new BadRequestException('Failed to change password');
    }

    return response;
  }

  @Post('change-name/:id')
  @UseGuards(AuthGuard)
  async changeName(
    @Body() changeNameDtoIn: ChangeNameDtoIn,
    @Param('id') id: number,
  ): Promise<boolean> {
    const response = await this.userService.changeName(
      id,
      changeNameDtoIn.name,
    );
    if (!response) {
      throw new BadRequestException('Failed to change name');
    }
    return response;
  }

  @Get('profile/:id')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') id: number): Promise<CreateUserDtoOut> {
    const user = await this.userService.getProfile(id);
    if (!user) {
      throw new BadRequestException('Failed to get profile');
    }
    return user;
  }
}
