import { declareExportDeclaration } from "@babel/types";

export interface accountDocument {
    accountDocId: string,
    email: string,
    username: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    createdBy: string,
    updatedBy: string,
    password: string
}