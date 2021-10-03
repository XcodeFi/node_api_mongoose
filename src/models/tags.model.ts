import { model, Schema, Document } from 'mongoose';
import { Tag } from '@interfaces/tags.interface';

const tagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const tagModel = model<Tag & Document>('Tag', tagSchema);

export default tagModel;
