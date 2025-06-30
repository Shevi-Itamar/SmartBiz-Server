import mongoose from 'mongoose';
import { Document } from 'mongoose';

import bcrypt from 'bcrypt';

const SALT_ROUNDS=process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;

interface IUsers extends Document {
  userPassword: String,
  userName: String,
  userAddress: String,
  userEmail: String,
  userPhone: String,
  role: String
}

const UserSchema = new mongoose.Schema({
  userPassword: { type: String, required: true, maxlength: 10 },
  userName: { type: String, required: true, maxlength: 100 },
  userAddress: { type: String, required: true, maxlength: 100 },
  userEmail: { type: String, required: true, maxlength: 100 },
  userPhone: { type: String, required: true, maxlength: 10 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
  timestamps: false
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.userPassword;
    return ret;
  }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('userPassword')) {
    this.userPassword = await bcrypt.hash(this.userPassword, SALT_ROUNDS);
  }
  next();
});

export default mongoose.model('User', UserSchema);
export { IUsers }
