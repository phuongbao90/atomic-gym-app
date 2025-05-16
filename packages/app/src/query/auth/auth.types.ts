export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
};
