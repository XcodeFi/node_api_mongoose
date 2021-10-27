import { model, Schema, Document } from 'mongoose';
import Blog from './blog.model';
import User from './users.model';

export const DOCUMENT_NAME = 'Comment';
export const COLLECTION_NAME = 'comments';

export default interface Comments {
  body: string;
  author?: User | string;
}

const commentSchema: Schema = new Schema({
  body: {
    type: String,
    required: true,
    unique: true,
  },
  author: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  ],
});

export const commentModel = model<Comments & Document>(DOCUMENT_NAME, commentSchema, COLLECTION_NAME);
