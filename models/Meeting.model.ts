import mongoose from 'mongoose';
import { Document } from 'mongoose';

interface IMeeting extends Document {
  meetDate: Date;
  clientID: mongoose.Types.ObjectId;
  serviceID: mongoose.Types.ObjectId;
}

const MeetingSchema = new mongoose.Schema({
  meetDate: { type: Date, required: true },
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceID: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
}, {
  timestamps: false
});

export default mongoose.model('Meeting', MeetingSchema);
export { IMeeting };
