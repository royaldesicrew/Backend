import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/Admin.js';

dotenv.config({ path: '.env.local' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED_TO_DB');

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
