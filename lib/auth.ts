import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserRole } from "@/types";
import { apiError } from "@/lib/api-response";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    return {
      authorized: false as const,
      response: apiError("Unauthorized — admin access required", 401),
    };
  }

  return { authorized: true as const, session };
}
