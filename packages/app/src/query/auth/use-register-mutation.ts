type RegisterInput = {
  email: string;
  password: string;
};

export const register = async (input: RegisterInput) => {
  console.log("register ", input);
};

export const useRegisterMutation = () => {};
