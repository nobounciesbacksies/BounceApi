export enum EmailAddedFrom {
    awsWebhook,
    gcpWebhook,
    azureWebhook,
    userApi,
    userDashboard
}

export interface EmailDocument {
    email: string,
    createdAt: Date,
    createdBy: string,
    addedFrom: EmailAddedFrom,
    unsubscribed: Boolean
}
