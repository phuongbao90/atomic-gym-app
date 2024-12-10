import { useQuery } from "@tanstack/react-query";
import { JWT_ACCESS_TOKEN_TTL } from "../../configs/constants";
import { request } from "../../libs/request";
import { QUERY_KEYS } from "../keys";

type Status = "unauthenticated" | "authenticated" | "loading";
type SessionUser = {
  email: string;
  name: string;
  avatar: string | null;
  sub: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};
type Session = {
  data: SessionUser | undefined;
  expires: number | undefined;
  status: Status;
  update: () => void;
};

export async function getSession() {
  try {
    const res = await request<SessionUser>("/auth/session", {
      method: "GET",
    });
    return res?.data;
  } catch (error) {
    console.log("error ", error);
  }
}

export const useSession = (): Session => {
  let status: Status = "unauthenticated";

  const update = () => {
    console.log("update session");
  };

  //   const updateUserMutation = useUp;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.session,
    queryFn: () => getSession(),
    staleTime: JWT_ACCESS_TOKEN_TTL,
  });

  if (isLoading) {
    status = "loading";
  } else if (data) {
    status = "authenticated";
  } else {
    status = "unauthenticated";
  }

  if (error) {
    status = "unauthenticated";
  }

  return { data, status, update, expires: data?.exp };
};
