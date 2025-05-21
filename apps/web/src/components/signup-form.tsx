"use client";

import { z } from "zod";
import { signUp } from "../lib/auth-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { tryCatch } from "app";

const schema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SignUpForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    console.log(name, email, password, confirmPassword, formData);

    // if (password !== confirmPassword) {
    //   toast.error("Passwords do not match");
    //   return;
    // }

    const { error } = tryCatch(() =>
      schema.safeParseAsync({
        name: name as string,
        email: email as string,
        password: password as string,
        confirmPassword: confirmPassword as string,
      })
    );

    if (error) {
      toast.error(error.message);
    }

    await signUp.email({
      email: email as string,
      password: password as string,
      name: name as string,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" required />
        </div>
        <Button type="submit" className="w-full z-50">
          Create Account ss
        </Button>
      </div>
    </form>
  );
}
