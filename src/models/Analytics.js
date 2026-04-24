import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['page_view', 'photo_view', 'blog_view', 'discount_used', 'contact_form']
  },
  photoId: mongoose.Schema.Types.ObjectId,
  blogId: mongoose.Schema.Types.ObjectId,
  discountCode: String,
  userAgent: String,
  ipAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
});

export default mongoose.model('Analytics', analyticsSchema);
