export enum EmailAddedFrom {
  awsWebhook,
  gcpWebhook,
  azureWebhook,
  userApi,
  userDashboard,
}

export interface EmailDocument {
  createdAt: Date;
  createdBy: string;
  addedFrom: EmailAddedFrom;
  unsubscribed: boolean;
  complaintFeedbackType?: string;
}
