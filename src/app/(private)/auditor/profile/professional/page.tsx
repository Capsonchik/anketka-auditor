import { getAuditorFromHeaders } from '@/entities/auditor/lib/get-auditor-from-headers';
import { ProfessionalForm, professionalFormValuesFromAuditor } from '@/features/auditor-edit';

export default async function ProfessionalDataPage() {
  const auditor = await getAuditorFromHeaders();
  const defaultValues = professionalFormValuesFromAuditor(auditor);

  return <ProfessionalForm defaultValues={defaultValues} />;
}
