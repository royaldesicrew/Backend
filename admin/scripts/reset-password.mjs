import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED_TO_DB');

    const AdminSchema = new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      isActive: Boolean
    }, { strict: false });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    const email = 'royaldesicrew@gmail.com';
    const newPassword = 'Royaldesicrew@2017';
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await Admin.findOneAndUpdate(
      { email },
      { password: hashedPassword, isActive: true },
      { new: true, upsert: true }
    );

    console.log(`SUCCESS: Password reset for ${email}`);
    console.log(`New credentials should be working now.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetPassword();
