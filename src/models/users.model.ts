import { model, Schema, Document } from 'mongoose';

export default interface User {
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

export const UserModel = model<User & Document>('User', userSchema);
