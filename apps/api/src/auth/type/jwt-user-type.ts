export type JwtUser = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  name: string;
  avatar: string;
};
