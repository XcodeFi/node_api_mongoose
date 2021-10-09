import { model, Schema, Document } from 'mongoose';
export default interface Tag {
  _id: string;
  name: string;
}

const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const TagModel = model<Tag & Document>('Tag', tagSchema);
