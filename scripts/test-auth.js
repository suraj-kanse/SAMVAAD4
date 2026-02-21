import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

const TEST_COUNSELLOR = {
    name: 'Test Counsellor',
    email: `test.counsellor.${Date.now()}@avcoe.edu`,
    password: 'password123',
    role: 'counsellor'
};

let adminToken = '';
let counsellorId = '';

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

        // 2. Test Counsellor Registration
        console.log('\n2️⃣  Testing Counsellor Registration...');
        const register = await axios.post(`${API_URL}/auth/register`, TEST_COUNSELLOR);
        if (register.data.success) {
            console.log('✅ Counsellor Registration Successful');
        } else {
            throw new Error('Counsellor registration failed');
        }

        // 3. Test Counsellor Login (Should FAIL before approval)
        console.log('\n3️⃣  Testing Counsellor Login (Pre-Approval)...');
        try {
            await axios.post(`${API_URL}/auth/login`, {
                email: TEST_COUNSELLOR.email,
                password: TEST_COUNSELLOR.password
            });
            throw new Error('❌ Counsellor should NOT be able to login before approval!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Counsellor Login blocked as expected (Account pending approval)');
            } else {
                throw err;
            }
        }

        // 4. Test Admin Approving Counsellor
        // First, we need to find the user ID. Since we don't have a token system implemented strictly in this mocked server,
        // we assume the API is open or we use the Admin to fetch users.
        // Looking at server.cjs, GET /api/users is unprotected (for simplicity in this project phase)
        console.log('\n4️⃣  Fetching Users to find new Counsellor...');
        const users = await axios.get(`${API_URL}/users`);
        const newCounsellor = users.data.find(u => u.email === TEST_COUNSELLOR.email);

        if (newCounsellor) {
            counsellorId = newCounsellor.id;
            console.log(`✅ Found new counsellor ID: ${counsellorId}`);

            console.log('🔄 Approving Counsellor...');
            await axios.patch(`${API_URL}/users/${counsellorId}/status`, { isApproved: true });
            console.log('✅ Counsellor Approved by Admin');
        } else {
            throw new Error('Could not find registered counsellor in database');
        }

        // 5. Test Counsellor Login (Should SUCCEED after approval)
        console.log('\n5️⃣  Testing Counsellor Login (Post-Approval)...');
        const counsellorLogin = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_COUNSELLOR.email,
            password: TEST_COUNSELLOR.password
        });

        if (counsellorLogin.data && counsellorLogin.data.role === 'counsellor') {
            console.log('✅ Counsellor Login Successful');
        } else {
            throw new Error('Counsellor login failed after approval');
        }

        // 6. Test Google Auth Endpoint (Availability Check)
        console.log('\n6️⃣  Testing Google Auth Endpoint (Expect 401)...');
        try {
            await axios.post(`${API_URL}/auth/google`, { token: 'fake_token' });
            throw new Error('Should have failed with 401');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('✅ Google Auth Endpoint is active (Correctly rejected fake token)');
            } else {
                throw new Error(`Google Auth Endpoint returned unexpected status: ${err.response ? err.response.status : err.message}`);
            }
        }

        console.log('\n✨ ALL AUTHENTICATION TESTS PASSED ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runTests();
