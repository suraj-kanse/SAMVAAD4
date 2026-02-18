/**
 * Seed Admin Script
 * Creates the initial admin user in MongoDB.
 * Reads ADMIN_EMAIL and ADMIN_PASS from .env
 *
 * Usage: node scripts/seed-admin.cjs
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../server/models.cjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/samvaad';

async function seedAdmin() {
    if (!ADMIN_EMAIL || !ADMIN_PASS) {
        console.error('❌ ADMIN_EMAIL and ADMIN_PASS must be set in .env file.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });

        if (existing) {
            // Update existing admin's password and ensure role/status are correct
            existing.password = await bcrypt.hash(ADMIN_PASS, 12);
            existing.role = 'admin';
            existing.status = 'approved';
            existing.name = ADMIN_NAME;
            await existing.save();
            console.log(`✅ Admin updated: ${ADMIN_EMAIL}`);
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(ADMIN_PASS, 12);
            const admin = new User({
                email: ADMIN_EMAIL.toLowerCase().trim(),
                password: hashedPassword,
                name: ADMIN_NAME,
                role: 'admin',
                status: 'approved'
            });
            await admin.save();
            console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
        }

        console.log('✅ Seed complete!');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAdmin();
