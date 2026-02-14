import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'counselor'], default: 'counselor' },
    isApproved: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = process.env.ADMIN_EMAIL;
        const pass = process.env.ADMIN_PASS;

        console.log(`Checking Admin: ${email}`);

        const user = await User.findOne({ email });

        if (user) {
            console.log('Admin found. Updating password...');
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(pass, salt);
            user.password = hashed;
            await user.save();
            console.log('✅ Admin password updated successfully!');
        } else {
            console.log('❌ Admin not found! Seeding needed.');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

resetAdmin();
