const mongoose = require('mongoose');

async function checkDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/cms');
        console.log('Connected to MongoDB');

        const UserSchema = new mongoose.Schema({
            email: String,
            role: String,
            joinedClubs: [String]
        }, { collection: 'users' });
        const User = mongoose.model('User', UserSchema);

        const ClubSchema = new mongoose.Schema({
            name: String,
            members: [String],
            memberCount: Number
        }, { collection: 'clubs' });
        const Club = mongoose.model('Club', ClubSchema);

        const users = await User.find({ role: 'student' });
        console.log('\n--- Students ---');
        users.forEach(u => console.log(`${u.email}: ${u.joinedClubs}`));

        const clubs = await Club.find({});
        console.log('\n--- Clubs ---');
        clubs.forEach(c => console.log(`${c.name} (${c._id}): ${c.members.length} members, count=${c.memberCount}`));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDB();
