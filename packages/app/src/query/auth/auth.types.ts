export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
  callbackUrl?: string;
};

export type LoginResponse = {
  redirect: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  callbackUrl?: string;
};

export type RegisterResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};
