import Photo from '../models/Photo.js';
import cloudinary from 'cloudinary';

// Cloudinary configuration function
const configureCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Cloudinary Error: API Key is missing in environment variables!');
    return false;
  }
  return true;
};

/**
 * Helper function to upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'royal-desi-crew/photos',
        resource_type: 'auto',
        quality: 'auto:best',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`📸 Fetched ${photos.length} photos from MongoDB`);
    
    res.json({ 
      success: true,
      photos: photos.map(photo => ({
        _id: photo._id,
        title: photo.title,
        description: photo.description,
        url: photo.url,
        publicId: photo.publicId,
        category: photo.category,
        views: photo.views,
        uploadedBy: photo.uploadedBy,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt
      }))
    });
  } catch (err) {
    console.error('❌ Error fetching photos:', err);
    res.status(500).json({ error: err.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    configureCloudinary();
    const { title, category, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Photo file required' });
    }

    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const result = await uploadToCloudinary(req.file.buffer);
    console.log('✅ Cloudinary upload successful:', result.secure_url);

    const photo = new Photo({
      title,
      category: category || 'Luxury Weddings',
      description,
      url: result.secure_url,
      publicId: result.public_id,
      uploadedBy: req.admin.id
    });

    await photo.save();
    console.log('💾 Photo saved to database');

    res.status(201).json({ 
      success: true,
      photo, 
      message: 'Photo uploaded successfully',
      url: result.secure_url
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    configureCloudinary();
    const { id } = req.params;
    const { title, category, description } = req.body;

    let photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const updateData = { 
      title: title || photo.title, 
      category: category || photo.category,
      description: description || photo.description,
      updatedAt: new Date() 
    };

    // Check if a new file is being uploaded
    if (req.file) {
      console.log('🔄 Re-uploading image to Cloudinary...');
      
      // Delete old image from Cloudinary if it exists
      if (photo.publicId) {
        try {
          await cloudinary.v2.uploader.destroy(photo.publicId);
          console.log(`🗑️ Deleted old image ${photo.publicId} from Cloudinary`);
        } catch (cloudinaryErr) {
          console.warn('⚠️ Could not delete old image from Cloudinary:', cloudinaryErr.message);
        }
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer);
      console.log('✅ New image uploaded to Cloudinary:', result.secure_url);
      
      updateData.url = result.secure_url;
      updateData.publicId = result.public_id;
    }

    photo = await Photo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.json({ 
      success: true,
      photo, 
      message: 'Photo updated successfully' 
    });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    configureCloudinary();
    const { id } = req.params;

    const photo = await Photo.findByIdAndDelete(id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete from Cloudinary if publicId exists
    if (photo.publicId) {
      try {
        await cloudinary.v2.uploader.destroy(photo.publicId);
        console.log(`🗑️ Deleted ${photo.publicId} from Cloudinary`);
      } catch (err) {
        console.error(`❌ Failed to delete ${photo.publicId} from Cloudinary:`, err.message);
      }
    }

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPhotoStats = async (req, res) => {
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

