import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  url: {
    type: String,
    required: true
  },
  publicId: String, // for Cloudinary
  category: {
    type: String,
    default: 'gallery'
  },
  views: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Photo', photoSchema);
