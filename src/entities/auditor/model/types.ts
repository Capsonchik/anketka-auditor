export interface Auditor {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  city: string;
}

export interface MeResponse {
  auditor: Auditor;
}

export interface Assignment {
  projectId: string;
  projectName: string;
  checkId: string;
  checkName: string;
  surveyId: string;
  surveyTitle: string;
  surveyCategory: string;
  status: string;
  checkStatus: string;
  assignedAt: string;
  acceptedAt: string;
  declinedAt: string;
  inProgressAt: string;
  itemsCompleted: number;
  itemsTotal: number;
  revisionComment: string;
  inviteToken: string;
}

export interface ListAssignmentsResponse {
  items: Assignment[];
}
