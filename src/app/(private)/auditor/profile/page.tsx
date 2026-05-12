import {
  auditorDisplayInitials,
  getAuditorFromHeaders,
} from '@/entities/auditor/lib/get-auditor-from-headers';
import { PersonalForm, personalFormValuesFromAuditor } from '@/features/auditor-edit';

export default async function ProfilePage() {
  const auditor = await getAuditorFromHeaders();
  const defaultValues = personalFormValuesFromAuditor(auditor);
  const avatarLabel = auditorDisplayInitials(auditor);

  return <PersonalForm defaultValues={defaultValues} avatarLabel={avatarLabel} />;
}
