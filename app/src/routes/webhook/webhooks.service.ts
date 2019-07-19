import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../services/firestore.service';
import { EmailDocument, EmailAddedFrom } from 'src/models/EmailDocument';

@Injectable()
export class WebhooksService {
  firestoreClient: FirebaseFirestore.Firestore;

  constructor(firestoreService: FirestoreService) {
    this.firestoreClient = firestoreService.getClient();
  }

  async recieveHook(jsonInfo, webhookId: string): Promise<any> {
    const querysnapshot = await this.firestoreClient.collection('blacklist').where('webhookId', '==', webhookId).get();
    const blacklistId = querysnapshot.docs[1].id;
    if (jsonInfo.eventType === 'Complaint') {
      await this.handleComplaint(jsonInfo, blacklistId);
    }
    if (jsonInfo.eventType === 'Bounce') {
      await this.handleBounce(jsonInfo, blacklistId);
    }
    return;
  }

  async handleComplaint(jsonInfo, blacklistId: string): Promise<any> {
    const email = jsonInfo.bounce.bouncedRecipients.emailAddress;
    const emailCollectionRef = this.firestoreClient.collection('blacklist').doc(blacklistId).collection('emails');
    const emailDoc = await emailCollectionRef.doc(email).get();
    if (!emailDoc.exists) {
      const newEmail: EmailDocument = {
        addedFrom: EmailAddedFrom.awsWebhook,
        createdAt: new Date(),
        createdBy: 'bounce',
        unsubscribed: false,
      };
      await emailCollectionRef.doc(email).set(newEmail);
    }
    return;
  }

  async handleBounce(jsonInfo, blacklistId: string): Promise<string> {
    const email = jsonInfo.complaint.complainedRecipients.emailAddress;
    const feedbackType = jsonInfo.complaint.complaintFeedbackType;
    const emailCollectionRef = this.firestoreClient.collection('blakclist').doc(blacklistId).collection('emails');
    const emailDoc = await emailCollectionRef.doc(email).get();
    if (!emailDoc.exists) {
      const newEmail: EmailDocument = {
        addedFrom: EmailAddedFrom.awsWebhook,
        createdAt: new Date(),
        createdBy: 'complaint',
        unsubscribed: false,
        complaintFeedbackType: feedbackType,
      };
      await emailCollectionRef.doc(email).set(newEmail);
      return;
    }
    await emailCollectionRef.doc(email).update({createdBy: 'complaint', complaintFeedbackType: feedbackType});
    return;
  }
}
