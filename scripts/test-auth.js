import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

const TEST_COUNSELOR = {
    name: 'Test Counselor',
    email: `test.counselor.${Date.now()}@avcoe.edu`,
    password: 'password123',
    role: 'counselor'
};

let adminToken = '';
let counselorId = '';

async function runTests() {
    console.log('🚀 Starting Authentication Verification...\n');

    try {
        // 1. Test Admin Login
        console.log('1️⃣  Testing Admin Login...');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASS
        });

        if (adminLogin.data && adminLogin.data.role === 'admin') {
            console.log('✅ Admin Login Successful');
            // In a real JWT setup we'd save a token, but here we just verify access
        } else {
            throw new Error('Admin login failed or incorrect role');
        }

        // 2. Test Counselor Registration
        console.log('\n2️⃣  Testing Counselor Registration...');
        const register = await axios.post(`${API_URL}/auth/register`, TEST_COUNSELOR);
        if (register.data.success) {
            console.log('✅ Counselor Registration Successful');
        } else {
            throw new Error('Counselor registration failed');
        }

        // 3. Test Counselor Login (Should FAIL before approval)
        console.log('\n3️⃣  Testing Counselor Login (Pre-Approval)...');
        try {
            await axios.post(`${API_URL}/auth/login`, {
                email: TEST_COUNSELOR.email,
                password: TEST_COUNSELOR.password
            });
            throw new Error('❌ Counselor should NOT be able to login before approval!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Counselor Login blocked as expected (Account pending approval)');
            } else {
                throw err;
            }
        }

        // 4. Test Admin Approving Counselor
        // First, we need to find the user ID. Since we don't have a token system implemented strictly in this mocked server,
        // we assume the API is open or we use the Admin to fetch users.
        // Looking at server.cjs, GET /api/users is unprotected (for simplicity in this project phase)
        console.log('\n4️⃣  Fetching Users to find new Counselor...');
        const users = await axios.get(`${API_URL}/users`);
        const newCounselor = users.data.find(u => u.email === TEST_COUNSELOR.email);

        if (newCounselor) {
            counselorId = newCounselor.id;
            console.log(`✅ Found new counselor ID: ${counselorId}`);

            console.log('🔄 Approving Counselor...');
            await axios.patch(`${API_URL}/users/${counselorId}/status`, { isApproved: true });
            console.log('✅ Counselor Approved by Admin');
        } else {
            throw new Error('Could not find registered counselor in database');
        }

        // 5. Test Counselor Login (Should SUCCEED after approval)
        console.log('\n5️⃣  Testing Counselor Login (Post-Approval)...');
        const counselorLogin = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_COUNSELOR.email,
            password: TEST_COUNSELOR.password
        });

        if (counselorLogin.data && counselorLogin.data.role === 'counselor') {
            console.log('✅ Counselor Login Successful');
        } else {
            throw new Error('Counselor login failed after approval');
        }

        console.log('\n✨ ALL AUTHENTICATION TESTS PASSED ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runTests();
