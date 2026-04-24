import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../src/models/Photo.js';
import Blog from '../src/models/Blog.js';
import Discount from '../src/models/Discount.js';
import Analytics from '../src/models/Analytics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const API_BASE_URL = 'http://localhost:5000/api';
let adminToken = null;

console.log('\n' + '='.repeat(70));
console.log('🧪 ROYAL DESI CREW - ADMIN PORTAL INTEGRATION TEST');
console.log('='.repeat(70));

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(status, message) {
  if (status === 'pass') {
    console.log(`${colors.green}✅ PASS${colors.reset}  | ${message}`);
  } else if (status === 'fail') {
    console.log(`${colors.red}❌ FAIL${colors.reset}  | ${message}`);
  } else if (status === 'info') {
    console.log(`${colors.cyan}ℹ️  INFO${colors.reset}  | ${message}`);
  } else if (status === 'test') {
    console.log(`\n${colors.blue}━━ ${message}${colors.reset}`);
  }
}

const tests = {
  passed: 0,
  failed: 0,
  skipped: 0
};

async function testDatabaseConnection() {
  log('test', 'Testing MongoDB Connection');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log('pass', 'Connected to MongoDB Atlas');
    tests.passed++;
    return true;
  } catch (err) {
    log('fail', `MongoDB Connection Failed: ${err.message}`);
    tests.failed++;
    return false;
  }
}

async function testAdminLogin() {
  log('test', 'Testing Admin Login API');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, {
      email: 'royaldesicrew@gmail.com',
      password: 'Royaldesicrew@2017'
    });

    if (response.data.token) {
      adminToken = response.data.token;
      log('pass', `Admin login successful (Token: ${adminToken.substring(0, 20)}...)`);
      tests.passed++;
      return true;
    }
  } catch (err) {
    log('fail', `Admin login failed: ${err.response?.data?.error || err.message}`);
    tests.failed++;
    return false;
  }
}

async function testPhotoAPIs() {
  log('test', 'Testing Photos APIs');

  try {
    // GET all photos
    const getAllResponse = await axios.get(`${API_BASE_URL}/photos`);
    const photoCount = getAllResponse.data.photos?.length || 0;
    log('pass', `GET /api/photos - Retrieved ${photoCount} photos`);
    tests.passed++;

    // POST new photo (requires auth)
    if (adminToken) {
      const newPhoto = {
        title: 'Test Photo ' + new Date().getTime(),
        description: 'Test photo for integration testing',
        url: 'https://via.placeholder.com/300x300?text=Test+Photo'
      };

      const uploadResponse = await axios.post(
        `${API_BASE_URL}/photos/upload`,
        newPhoto,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (uploadResponse.data.photo) {
        const photoId = uploadResponse.data.photo._id;
        log('pass', `POST /api/photos/upload - Created photo (ID: ${photoId})`);
        tests.passed++;

        // DELETE the test photo
        try {
          await axios.delete(`${API_BASE_URL}/photos/${photoId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          log('pass', `DELETE /api/photos/:id - Deleted test photo`);
          tests.passed++;
        } catch (err) {
          log('fail', `DELETE /api/photos/:id - ${err.message}`);
          tests.failed++;
        }
      }
    }
  } catch (err) {
    log('fail', `Photos API Error: ${err.message}`);
    tests.failed++;
  }
}

async function testBlogAPIs() {
  log('test', 'Testing Blogs APIs');

  try {
    // GET all blogs
    const getAllResponse = await axios.get(`${API_BASE_URL}/blogs`);
    const blogCount = getAllResponse.data.blogs?.length || 0;
    log('pass', `GET /api/blogs - Retrieved ${blogCount} blogs`);
    tests.passed++;

    // POST new blog (requires auth)
    if (adminToken) {
      const newBlog = {
        title: 'Test Blog ' + new Date().getTime(),
        content: 'This is a test blog for integration testing',
        author: 'Test Admin'
      };

      const createResponse = await axios.post(
        `${API_BASE_URL}/blogs`,
        newBlog,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (createResponse.data.blog) {
        const blogId = createResponse.data.blog._id;
        log('pass', `POST /api/blogs - Created blog (ID: ${blogId})`);
        tests.passed++;

        // DELETE the test blog
        try {
          await axios.delete(`${API_BASE_URL}/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          log('pass', `DELETE /api/blogs/:id - Deleted test blog`);
          tests.passed++;
        } catch (err) {
          log('fail', `DELETE /api/blogs/:id - ${err.message}`);
          tests.failed++;
        }
      }
    }
  } catch (err) {
    log('fail', `Blogs API Error: ${err.message}`);
    tests.failed++;
  }
}

async function testDiscountAPIs() {
  log('test', 'Testing Discounts APIs');

  try {
    // GET all discounts (requires auth)
    if (adminToken) {
      const getAllResponse = await axios.get(`${API_BASE_URL}/discounts`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const discountCount = getAllResponse.data.discounts?.length || 0;
      log('pass', `GET /api/discounts - Retrieved ${discountCount} discounts`);
      tests.passed++;

      // POST new discount
      const newDiscount = {
        code: 'TEST' + Date.now(),
        percentage: 15,
        description: 'Test discount for integration testing',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const createResponse = await axios.post(
        `${API_BASE_URL}/discounts`,
        newDiscount,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (createResponse.data.discount) {
        const discountId = createResponse.data.discount._id;
        log('pass', `POST /api/discounts - Created discount (Code: ${newDiscount.code})`);
        tests.passed++;

        // DELETE the test discount
        try {
          await axios.delete(`${API_BASE_URL}/discounts/${discountId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          log('pass', `DELETE /api/discounts/:id - Deleted test discount`);
          tests.passed++;
        } catch (err) {
          log('fail', `DELETE /api/discounts/:id - ${err.message}`);
          tests.failed++;
        }
      }
    }
  } catch (err) {
    log('fail', `Discounts API Error: ${err.message}`);
    tests.failed++;
  }
}

async function testDatabaseCounts() {
  log('test', 'Verifying Database Collections');

  try {
    const photosCount = await Photo.countDocuments();
    log('info', `Photos in database: ${photosCount}`);

    const blogsCount = await Blog.countDocuments();
    log('info', `Blogs in database: ${blogsCount}`);

    const discountsCount = await Discount.countDocuments();
    log('info', `Discounts in database: ${discountsCount}`);

    const analyticsCount = await Analytics.countDocuments();
    log('info', `Analytics records: ${analyticsCount}`);

    tests.passed += 4;
  } catch (err) {
    log('fail', `Database count verification failed: ${err.message}`);
    tests.failed += 4;
  }
}

async function runAllTests() {
  try {
    // Test backend connectivity
    log('test', 'Testing Backend Server Connectivity');
    try {
      const health = await axios.get('http://localhost:5000/api/admin/verify');
      log('info', 'Backend server is reachable (no token yet)');
    } catch (err) {
      if (err.response?.status === 401) {
        log('pass', 'Backend server is running (returns 401 without token - expected)');
        tests.passed++;
      } else {
        log('fail', `Backend server not responding: ${err.message}`);
        tests.failed++;
      }
    }

    // Run sequential tests
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      log('fail', 'Cannot continue without database connection');
      process.exit(1);
    }

    const loginSuccess = await testAdminLogin();
    if (!loginSuccess) {
      log('fail', 'Cannot continue without admin login');
      process.exit(1);
    }

    await testPhotoAPIs();
    await testBlogAPIs();
    await testDiscountAPIs();
    await testDatabaseCounts();

    // Disconnect from MongoDB
    await mongoose.disconnect();

  } catch (err) {
    log('fail', `Test suite error: ${err.message}`);
  } finally {
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`${colors.green}✅ Passed: ${tests.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${tests.failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${tests.skipped}${colors.reset}`);

    const total = tests.passed + tests.failed;
    const percentage = total > 0 ? ((tests.passed / total) * 100).toFixed(0) : 0;
    console.log(`\n${colors.blue}Overall Success Rate: ${percentage}%${colors.reset}`);

    if (tests.failed === 0) {
      console.log(`\n${colors.green}🎉 ALL TESTS PASSED - ADMIN PORTAL IS FULLY OPERATIONAL!${colors.reset}`);
      console.log('\n📝 Admin Panel URL: http://localhost:3000/admin');
      console.log('📧 Email: royaldesicrew@gmail.com');
      console.log('🔑 Password: Royaldesicrew@2017\n');
    } else {
      console.log(`\n${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
    }

    console.log('='.repeat(70) + '\n');
    process.exit(tests.failed > 0 ? 1 : 0);
  }
}

// Run all tests
runAllTests();
