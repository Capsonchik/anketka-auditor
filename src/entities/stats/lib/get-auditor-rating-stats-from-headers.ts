import { headers } from 'next/headers';
import { parseEncryptedJsonPayload } from '@/shared/lib/crypto';
import type { AuditorRatingStats } from '../model/types';

export async function getAuditorRatingStatsFromHeaders(): Promise<AuditorRatingStats | null> {
  const headersList = await headers();
  return parseEncryptedJsonPayload<AuditorRatingStats>(headersList.get('x-user-stats'));
}
