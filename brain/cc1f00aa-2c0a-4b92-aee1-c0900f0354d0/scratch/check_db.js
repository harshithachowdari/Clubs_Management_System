const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/clubs_management';

async function checkUser() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema);

    const ClubSchema = new mongoose.Schema({}, { strict: false });
    const Club = mongoose.model('Club', ClubSchema);

    const users = await User.find({ role: 'club_admin' });
    console.log('--- Club Admins ---');
    users.forEach(u => {
      console.log(`Name: ${u.firstName} ${u.lastName}, Email: ${u.email}, ManagedClubs: ${JSON.stringify(u.managedClubs)}`);
    });

    const clubs = await Club.find({});
    console.log('\n--- Clubs ---');
    clubs.forEach(c => {
      console.log(`Name: ${c.name}, ID: ${c._id}, AdminId: ${c.adminId}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();
