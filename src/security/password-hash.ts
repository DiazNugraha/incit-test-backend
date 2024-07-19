import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHash {
  async hash(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }
}
