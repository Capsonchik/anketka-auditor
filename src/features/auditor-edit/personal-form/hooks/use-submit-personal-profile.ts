'use client';

import { useCallback } from 'react';
import { useUpdateAuditorMutation } from '@/entities/auditor/api/auditor.api';
import type { PersonalFormValues } from '../model/types';
import { mapPersonalProfileUpdate } from '../lib/map-to-update';

export function useSubmitPersonalProfile() {
  const [updateAuditor, result] = useUpdateAuditorMutation();

  const submit = useCallback(
    async (data: PersonalFormValues) => {
      return updateAuditor(mapPersonalProfileUpdate(data)).unwrap();
    },
    [updateAuditor],
  );

  return { submit, ...result };
}
