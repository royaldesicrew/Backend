import Photo from '../models/Photo.js';
import Blog from '../models/Blog.js';
import Discount from '../models/Discount.js';
import Analytics from '../models/Analytics.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalPhotos = await Photo.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalDiscounts = await Discount.countDocuments();
    const activeDiscounts = await Discount.countDocuments({
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    const analyticsData = await Analytics.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalVisitors = analyticsData.find(a => a._id === 'page_view')?.count || 0;

    res.json({
      totalPhotos,
      totalBlogs,
      totalDiscounts,
      activeDiscounts,
      totalVisitors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPhotosStats = async (req, res) => {
  try {
    const stats = await Photo.aggregate([
      {
        $group: {
          _id: null,
          totalPhotos: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    res.json(stats[0] || { totalPhotos: 0, totalViews: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogsStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: ['$published', 1, 0] }
          },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    res.json(stats[0] || { totalBlogs: 0, publishedBlogs: 0, totalViews: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const trackEvent = async (req, res) => {
  try {
    const { eventType, photoId, blogId, discountCode } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const analytics = new Analytics({
      eventType,
      photoId,
      blogId,
      discountCode,
      userAgent,
      ipAddress
    });

    await analytics.save();
    res.status(201).json({ message: 'Event tracked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
