import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envPath });

console.log('✅ Environment variables loaded from:', envPath);
console.log('☁️ Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Defined' : 'UNDEFINED');
