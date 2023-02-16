import { Schema, model } from 'mongoose';
import { IUser } from './types';

const userSchema = new Schema<IUser>(
  {
    publicId: { type: String, required: [true, 'Please provide public ID'] },
    name: { type: String, required: [true, 'Please add name'] },
    email: {
      type: String,
      required: [true, 'Please add email'],
      unique: true,
    },
    password: { type: String, required: [true, 'Please add password'] },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
