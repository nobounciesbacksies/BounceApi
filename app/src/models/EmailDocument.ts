export enum EmailAddedFrom {
    awsWebhook,
    gcpWebhook,
    azureWebhook,
    userApi,
    userDashboard
}

export interface EmailDocument {
    docID: string,
    email: string,
    createdAt: Date,
    createdBy: string,
    addedFrom: EmailAddedFrom,
    unsubscribed: Boolean
}
