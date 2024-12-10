"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function Login({ mode }: { mode: "login" | "register" }) {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "bao3@gmail.com",
      password: "123456#@Nn",
    },
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      // redirectTo: "/",
      // redirectTo: "/",
    });
  }

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
