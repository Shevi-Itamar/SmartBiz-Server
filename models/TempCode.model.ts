import mongoose from 'mongoose';

const TempCodeSchema = new mongoose.Schema({
    email: String,
    code: String,
    expiresAt: Date
  })
  
export default mongoose.model('TempCode', TempCodeSchema);