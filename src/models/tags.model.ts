import { model, Schema, Document } from 'mongoose';
import Blog from './blog.model';

export const DOCUMENT_NAME = 'Tag';
export const COLLECTION_NAME = 'tags';

export default interface Tag {
  _id: string;
  name: string;
  blogs?: Blog[] | string[];
}

const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: false,
      index: true,
    },
  ],
});

export const TagModel = model<Tag & Document>(DOCUMENT_NAME, tagSchema, COLLECTION_NAME);
