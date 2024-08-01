import { handleExpiredSession } from './sessionUtils';

export async function authenticatedFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (response.status === 401) {
    await handleExpiredSession();
    return null;
  }
  return response;
}