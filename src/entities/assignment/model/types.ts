export interface RevisionThread {
  attemptId: string;
  questionCode: string;
  questionTitle: string;
  messageCount: number;
  lastMessageAt: string;
  lastMessageText: string;
}

export interface Assignment {
  projectId: string;
  projectName: string;
  checkId: string;
  checkName: string;
  surveyId: string;
  surveyTitle: string;
  surveyCategory: string;
  status: 'assigned' | 'completed' | 'overdue' | string;
  checkStatus: 'overdue' | 'on_control' | string;
  assignedAt: string;
  acceptedAt: string | null;
  declinedAt: string | null;
  inProgressAt: string | null;
  itemsCompleted: number;
  itemsTotal: number;
  revisionComment: string | null;
  opsRevisionThreads: RevisionThread[];
  inviteToken: string;
}

export interface AssignmentsResponse {
  items: Assignment[];
}
