export interface accountDocument {
  accountDocId: string;
  email: string;
  username: string;
  password: string;
  blacklists: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: string;
  updatedBy: string;
}
