// hooks/useRoleParam.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback } from 'react';

export const useRoleParam = (defaultRole: 'auditor' | 'controler' = 'auditor') => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const roleParam = searchParams.get('role');
  const isValid = roleParam === 'auditor' || roleParam === 'controler';
  const role = isValid ? roleParam as 'auditor' | 'controler' : defaultRole;

  // Исправляем невалидную роль
  useEffect(() => {
    const currentRole = searchParams.get('role');
    if (currentRole !== 'auditor' && currentRole !== 'controler') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('role', defaultRole);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router, defaultRole]);

  const setRole = useCallback((newRole: 'auditor' | 'controler') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', newRole);
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleRoleChange = useCallback((newRole: string | number | boolean) => {
    setRole(String(newRole) as 'auditor' | 'controler');
  }, [setRole]);

  return { role, setRole, handleRoleChange };
};