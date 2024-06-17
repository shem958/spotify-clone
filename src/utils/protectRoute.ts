import { getSession } from "next-auth/react";

export default async function protectRoute() {
  const session = await getSession();
  if (!session) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      throw new Error('Redirect to login');
    }
  }
  return session;
}
