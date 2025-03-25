"use server";

import { RegisterResponse } from "app/query/auth/use-register-mutation";
import { ofetch } from "ofetch";
import { z } from "zod";
import { signIn } from "../../auth";
import { API_URL } from "../../config/env";
import { validatedAction } from "../../util/validate-action";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    name: z.string().min(3),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const login = validatedAction(loginSchema, async (data, formData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("login data =====>", email, password);

    signIn("credentials", {
      email,
      password,
      // redirectTo: "/",
      // redirect: false,
    });

    return { success: "Login successful" };
  } catch (error) {
    console.log("error =====>", error);
    return { error: "Login failed" };
  }
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  console.log("signUp data =====>", data);

  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    // const res = await register({
    //   email: email as string,
    //   password: password as string,
    //   name: name as string,
    // });
    // console.log("res =====>", res);

    const registerResponse = await ofetch<{ data: RegisterResponse }>(
      API_URL + "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({
          email: email as string,
          password: password as string,
          name: name as string,
        }),
      },
    );

    console.log(
      "registerResponse =====>",
      registerResponse,
      registerResponse.data,
    );

    // if (!registerResponse || !registerResponse.data) {
    console.log("-------sign in------");
    await signIn("credentials", {
      email: email as string,
      password: password as string,
      // redirectTo: "/",
      redirect: false,
    });
    // }

    return { success: "Sign up successful", error: "" };
  } catch (error) {
    console.log("error =====>", error);
    return { error: "Sign up failed", success: "" };
  }
});
