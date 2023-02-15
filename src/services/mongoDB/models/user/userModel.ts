import { Schema, model } from 'mongoose';
import { IUser } from './types';

const userSchema = new Schema<IUser>(
  {
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
