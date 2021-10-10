import { model, Schema, Document } from 'mongoose';


export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document{
  _id: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model<User>(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
