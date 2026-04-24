#!/usr/bin/env node

import axios from 'axios';

console.log('\n' + '='.repeat(70));
console.log('🔍 LOGIN TROUBLESHOOTING DIAGNOSTIC');
console.log('='.repeat(70) + '\n');

const BACKEND_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'royaldesicrew@gmail.com';
const ADMIN_PASSWORD = 'Royaldesicrew@2017';

async function checkBackendConnection() {
  console.log('1️⃣  Checking Backend Server Connection...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/admin/verify`, {
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });
    
    if (response.status === 401) {
      console.log('   ✅ Backend is RUNNING (returns 401 without token - expected)');
      return true;
    } else if (response.status === 500) {
      console.log('   ⚠️  Backend is running but has an error');
      console.log('   Error:', response.data);
      return true;
    } else {
      console.log('   ⚠️  Backend responded with status:', response.status);
      return true;
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('   ❌ Backend is NOT RUNNING on port 5000');
      console.log('   Error: Connection refused');
      console.log('   Solution: Run "npm run backend" or "npm start"');
      return false;
    } else if (err.message.includes('timeout')) {
      console.log('   ❌ Backend connection timeout');
      console.log('   Solution: Check if backend is running and port 5000 is accessible');
      return false;
    } else {
      console.log('   ❌ Error:', err.message);
      return false;
    }
  }
}

async function testLogin() {
  console.log('\n2️⃣  Testing Login with Credentials...');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    }, {
      timeout: 5000
    });

    if (response.data.token) {
      console.log('   ✅ Login SUCCESSFUL');
      console.log('   Token Generated:', response.data.token.substring(0, 50) + '...');
      console.log('   User:', response.data.user);
      return true;
    }
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('   ❌ Login FAILED - Invalid credentials');
      console.log('   Error:', err.response.data.error);
      console.log('   Check if email/password are correct');
      return false;
    } else if (err.response?.status === 400) {
      console.log('   ❌ Bad Request');
      console.log('   Error:', err.response.data.error);
      return false;
    } else if (err.code === 'ECONNREFUSED') {
      console.log('   ❌ Cannot connect to backend on port 5000');
      console.log('   Backend is not running');
      return false;
    } else {
      console.log('   ❌ Error:', err.message);
      if (err.response?.data) {
        console.log('   Response:', err.response.data);
      }
      return false;
    }
  }
}

async function checkAdminPanel() {
  console.log('\n3️⃣  Checking Admin Panel...');
  try {
    const response = await axios.get('http://localhost:3001/admin', {
      timeout: 5000,
      maxRedirects: 5
    });
    console.log('   ✅ Admin panel is RUNNING on port 3001');
    return true;
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('   ⚠️  Admin panel NOT running on port 3001');
      console.log('   Solution: Run "npm run admin" from root directory');
      return false;
    } else {
      console.log('   ⚠️  Admin panel check inconclusive');
      return false;
    }
  }
}

async function runDiagnostics() {
  const backendOk = await checkBackendConnection();
  
  if (!backendOk) {
    console.log('\n' + '='.repeat(70));
    console.log('❌ BACKEND IS NOT RUNNING');
    console.log('='.repeat(70));
    console.log('\n🔧 Fix:');
    console.log('   Open a terminal and run:');
    console.log('   cd e:\\marcosh2002.github.io-main');
    console.log('   npm run backend');
    console.log('\n   OR run both together:');
    console.log('   npm start');
    process.exit(1);
  }

  const loginOk = await testLogin();
  const adminOk = await checkAdminPanel();

  console.log('\n' + '='.repeat(70));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(70));

  if (backendOk && loginOk && adminOk) {
    console.log('\n✅ Everything is working!');
    console.log('   Backend: ✅ Running on port 5000');
    console.log('   Login: ✅ Credentials verified');
    console.log('   Admin Panel: ✅ Running on port 3001');
    console.log('\n   Open browser: http://localhost:3001/admin');
    console.log('   Login should now work! 🎉\n');
  } else {
    console.log('\n⚠️  Issues found:');
    if (!backendOk) console.log('   ❌ Backend server not running');
    if (!loginOk) console.log('   ❌ Login failed');
    if (!adminOk) console.log('   ⚠️  Admin panel not running');
    
    console.log('\n🔧 Solutions:');
    console.log('   1. Make sure backend is running: npm run backend');
    console.log('   2. Make sure admin is running: npm run admin');
    console.log('   3. Check browser console (F12) for errors');
    console.log('   4. Verify credentials are correct\n');
  }

  console.log('='.repeat(70) + '\n');
  process.exit(loginOk ? 0 : 1);
}

runDiagnostics();
