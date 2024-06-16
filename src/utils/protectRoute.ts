import { getSession } from 'next-auth/react';

export const protectRoute = async () => {
  const session = await getSession();
  if (!session) {
    // Redirect to login page if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    } else {
      throw new Error('Redirect to login');
    }
  }
  return session;
};
