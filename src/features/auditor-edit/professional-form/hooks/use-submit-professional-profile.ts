'use client';

import { useCallback } from 'react';
import { useUpdateAuditorMutation } from '@/entities/auditor/api/auditor.api';
import type { ProfessionalFormValues } from '../model/types';
import { mapProfessionalProfileUpdate } from '../lib/map-to-update';

export function useSubmitProfessionalProfile() {
  const [updateAuditor, result] = useUpdateAuditorMutation();

  const submit = useCallback(
    async (data: ProfessionalFormValues) => {
      return updateAuditor(mapProfessionalProfileUpdate(data)).unwrap();
    },
    [updateAuditor],
  );

  return { submit, ...result };
}
