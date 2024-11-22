import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constant/auth.constant';
import { AuthType } from '../type/auth-type';

export const Auth = (...authTypes: AuthType[]) => {
  // console.log('authTypes: ', authTypes);
  return SetMetadata(AUTH_TYPE_KEY, authTypes);
};
