import { model, Schema, Document } from 'mongoose';
import Blog from './blog.model';
import User from './users.model';

export const DOCUMENT_NAME = 'Comment';
export const COLLECTION_NAME = 'comments';

export default interface Comments extends Document {
  body: string,
  author: User | string,
  blog: Blog | string,
  createdAt?: Date,
  updatedAt?: Date,
}

const commentSchema: Schema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    select: true,
  },
  updatedAt: {
    type: Date,
    select: true,
  }
});
// .pre<Comments>('save', function(next) {
//   if (this._id) {
//     this.updatedAt = new Date();
//   } else {
//     this.createdAt = new Date();
//   }
//   next();
// });

export const CommentModel = model<Comments>(DOCUMENT_NAME, commentSchema, COLLECTION_NAME);
