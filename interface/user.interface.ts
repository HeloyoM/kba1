import { FieldValue } from "firebase/firestore";

export default interface IUser {
    id: string;
    name: string | null;
    familyName: string | null;
    givenName: string | null;
    email: string;
    photoUrl: string | null;
    createdAt: FieldValue;
    isPaying: boolean;
    last_login: FieldValue;
    phone: string;
    role: string;
    subscriptionExpires: number;
    uid?: string;
    location?: string;
    birthday?: string;
}