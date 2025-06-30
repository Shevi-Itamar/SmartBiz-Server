import mongoose from 'mongoose';
import { Document } from 'mongoose';

interface IBusiness extends Document {
  businessPassword: String,
  businessName: String,
  businessLocation: String,
  email: String,
  targetAudience: String,
  details: String,
  imagePath: String
}


const BusinessSchema = new mongoose.Schema({
  businessPassword: { type: String, required: true, maxlength: 10 },
  businessName: { type: String, required: true, maxlength: 100 },
  businessLocation: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  targetAudience: { type: String, required: true, maxlength: 100 },
  details: { type: String, required: true, maxlength: 1000 },
  imagePath: { type: String }, 
}, {
  timestamps: false 
});

// יצירת המודל
export default mongoose.model('Business', BusinessSchema);
export { IBusiness };
