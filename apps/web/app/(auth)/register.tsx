"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { ActionState } from "../../util/validate-action";
import { signUp } from "./actions";

export function Register() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUp,
    {
      success: "",
      error: "",
    }
  );

  console.log("pending =====>", pending);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <div>
      <form action={formAction}>
        <div>
          <label htmlFor="name">Name</label>
          <input name="name" id="name" defaultValue="Bao bao" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" id="email" defaultValue="bao101@gmail.com" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input name="password" id="password" defaultValue="123456#@Nn" />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            name="confirmPassword"
            id="confirmPassword"
            defaultValue="123456#@Nn"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
