import { signOut } from 'next-auth/react';

export const handleExpiredSession = async () => {
  await signOut({ redirect: false });
  window.location.href = '/login?session_expired=true';
};