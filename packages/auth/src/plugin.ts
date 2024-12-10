import { betterFetch } from "@better-fetch/fetch";
import {
  setSessionCookie,
  type BetterAuthClientPlugin,
  type BetterAuthPlugin,
} from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { z } from "zod";
import { LoginResponse, UserResponse } from "./types.js";

const ERROR_CODES = {
  INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
  EMAIL_NOT_VERIFIED: "email not verified",
  UNEXPECTED_ERROR: "unexpected error",
  INVALID_REQUEST: "invalid request",
  FAILED_TO_CREATE_SESSION: "failed to create session",
};

export const myServerAuthPlugin = () => {
  return {
    id: "login",
    schema: {
      user: {
        fields: {
          email: {
            type: "string",
            required: true,
            unique: true,
            returned: true,
          },
          password: {
            type: "string",
            required: true,
            returned: false,
          },
          rememberMe: {
            type: "boolean",
            required: false,
            returned: false,
          },
        },
      },
    },
    endpoints: {
      login: createAuthEndpoint(
        "/sign-in/login",
        {
          method: "POST",
          body: z.object({
            email: z.string().email(),
            password: z.string(),
            rememberMe: z.boolean().optional(),
          }),
        },
        async (ctx) => {
          try {
            const { email, password, rememberMe } = ctx.body;
            const { data: user } = await betterFetch<UserResponse>(
              "http://localhost:3000/user/email/" + email
            );

            if (!user) {
              await ctx.context.password.hash(password);
              ctx.context.logger.error("user not found", { email });
              throw new APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
              });
            }

            await ctx.context.internalAdapter.createUser({
              id: user.data.id.toString(),
              createdAt: new Date(user.data.createdAt),
              updatedAt: new Date(user.data.updatedAt),
              email: user.data.email,
              emailVerified: false,
              name: user.data.name,
              image: null,
              password: await ctx.context.password.hash(password),
            });

            const { data: loginData } = await betterFetch<LoginResponse>(
              "http://localhost:3000/auth/login",
              {
                method: "POST",
                body: { email, password },
              }
            );

            if (!loginData) {
              ctx.context.logger.error("invalid username or password", {
                email,
              });
              throw new APIError("UNAUTHORIZED", {
                message: ERROR_CODES.INVALID_USERNAME_OR_PASSWORD,
              });
            }

            const session = await ctx.context.internalAdapter.createSession(
              user.data.id.toString(),
              ctx.request,
              rememberMe === false
            );

            // if (!session) {
            //   return ctx.json(null, {
            //     status: 500,
            //     body: {
            //       message: ERROR_CODES.FAILED_TO_CREATE_SESSION,
            //       status: 500,
            //     },
            //   });
            // }

            // await setSessionCookie(
            //   ctx,
            //   {
            //     session,
            //     user: {
            //       createdAt: new Date(user.data.createdAt),
            //       updatedAt: new Date(user.data.updatedAt),
            //       email: user.data.email,
            //       name: user.data.name,
            //       id: user.data.id.toString(),
            //       emailVerified: false,
            //       image: null,
            //     },
            //   },
            //   rememberMe === false
            // );

            return ctx.json({
              id: user.data.id,
              email: user.data.email,
              name: user.data.name,
              gender: user.data.gender,
              age: user.data.age,
              createdAt: new Date(user.data.createdAt),
              updatedAt: new Date(user.data.updatedAt),
              accessToken: loginData.data.accessToken,
              refreshToken: loginData.data.refreshToken,
            });
          } catch (error) {
            console.error("error", error);
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message:
                (error as Error)?.message || ERROR_CODES.UNEXPECTED_ERROR,
            });
          }
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};

export const myClientAuthPlugin = () => {
  return {
    id: "login",
    $InferServerPlugin: {} as ReturnType<typeof myServerAuthPlugin>,
    // getActions: () => {
    //   return {
    //     login: async (data: any, fetchOptions?: BetterFetchOption) => {
    //       try {
    //         console.log("run my-client-auth-plugin", data);
    //         const response = await fetch("http://localhost:3000/auth/login", {
    //           method: "POST",
    //           body: JSON.stringify(data),
    //           headers: {
    //             "Content-Type": "application/json",
    //             accept: "application/json",
    //           },
    //           ...fetchOptions,
    //         });
    //         const responseData = await response.json();

    //         console.log("response", responseData);
    //         return {
    //           ok: true,
    //           data: responseData.data,
    //         };
    //       } catch (error) {
    //         console.error("error", error);
    //       }
    //     },
    //   };
    // },
  } satisfies BetterAuthClientPlugin;
};
