import { Document, model, Schema } from 'mongoose';

import { User } from '@/interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
