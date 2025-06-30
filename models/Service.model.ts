import mongoose from 'mongoose';
import { Document } from 'mongoose';

interface IService extends Document {
  serviceName: String,
  serviceDescription: String,
  price: Number,
  duration: Number,
  imagePath?: String
}

const ServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true, maxlength: 100 },
  serviceDescription: { type: String, required: true, maxlength: 1000 },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  imagePath: { type: String, required: false, maxlength: 255 }
}, {
  timestamps: false
});

export default mongoose.model('Service', ServiceSchema);
export { IService }
