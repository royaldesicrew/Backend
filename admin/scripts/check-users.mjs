import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED_TO_DB');

    const AdminSchema = new mongoose.Schema({
      email: String,
      role: String,
      isActive: Boolean
    }, { strict: false });

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    const admins = await Admin.find({});
    console.log('ADMINS_LIST:' + JSON.stringify(admins.map(a => ({
      email: a.email,
      role: a.role,
      isActive: a.isActive
    }))));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
