import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class UtilitiesService {
  hashPwd(pwd: string): string {
    if (!pwd)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Passwords must be provided',
        },
        HttpStatus.FORBIDDEN,
      );
    const hmac = createHmac('sha512', process.env.HASH_SECRET_KEY);
    hmac.update(pwd);
    return hmac.digest('hex');
  }
}
