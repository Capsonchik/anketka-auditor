import { cookies, headers } from 'next/headers';
import { parseEncryptedJsonPayload } from '@/shared/lib/crypto';
import type { Auditor } from '../model/types';

export type GetAuditorFromHeadersOptions = {
  /**
   * Если true — не доверять заголовку без куки `accessToken`
   * (например публичная зона логина при устаревшем кэше).
   */
  requireAccessTokenCookie?: boolean;
};

export async function getAuditorFromHeaders(
  options?: GetAuditorFromHeadersOptions,
): Promise<Auditor | null> {
  if (options?.requireAccessTokenCookie) {
    const cookieStore = await cookies();
    if (!cookieStore.has('accessToken')) return null;
  }

  const headersList = await headers();
  return parseEncryptedJsonPayload<Auditor>(headersList.get('x-user-data'));
}

export function auditorDisplayInitials(auditor: Auditor | null): string {
  if (!auditor) return 'АУ';
  const a = (auditor.lastName?.trim()?.[0] ?? '').toUpperCase();
  const b = (auditor.firstName?.trim()?.[0] ?? '').toUpperCase();
  const s = `${a}${b}`.trim();
  return s || 'АУ';
}
