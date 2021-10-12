import { model, Schema, Document } from 'mongoose';


export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document{
  _id: string;
  email: string;
  password: string;
  profilePicUrl?: string;
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  profilePicUrl: {
    type: Schema.Types.String,
    trim: true,
  },
  verified: {
    type: Schema.Types.Boolean,
    default: false,
  },
  status: {
    type: Schema.Types.Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
    select: false,
  },
  updatedAt: {
    type: Date,
    select: false,
  },
});

export const UserModel = model<User>(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
