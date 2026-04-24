import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Photo from "./src/models/Photo.js";

(async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/royal-desi-crew"
    );

    const brokenPhotos = await Photo.find({
      url: { $regex: "^/static/Images" },
    });

    console.log(`Found ${brokenPhotos.length} photos with broken URLs`);

    for (const photo of brokenPhotos) {
      const encodedTitle = encodeURIComponent(photo.title);
      const placeholderUrl = `https://via.placeholder.com/400x300?text=${encodedTitle}`;
      await Photo.findByIdAndUpdate(photo._id, { url: placeholderUrl });
      console.log(`✓ Updated: ${photo.title}`);
    }

    console.log(
      `\n✅ All ${brokenPhotos.length} photos updated with placeholder images!`
    );
    process.exit(0);
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
})();
