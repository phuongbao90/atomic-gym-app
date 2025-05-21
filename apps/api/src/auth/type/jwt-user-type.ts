export type JwtUser = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  name: string;
  avatar: string;
};
