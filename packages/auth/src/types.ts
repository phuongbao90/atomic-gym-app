export type LoginResponse = {
  data: { accessToken: string; refreshToken: string };
  error: string;
};

export type UserResponse = {
  data: {
    id: number;
    email: string;
    name: string;
    gender: null | "male" | "female";
    age: null | number;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  error: string;
};
