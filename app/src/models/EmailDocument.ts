import { DocumentData } from "@google-cloud/firestore";

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
  unsubscribed: Boolean;
}
