import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: String,
  expiryDate: {
    type: Date,
    required: true
  },
  maxUses: Number,
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

export default mongoose.model('Discount', discountSchema);
