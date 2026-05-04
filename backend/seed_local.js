const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/clubs_management';

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: String,
  rollNumber: String,
  department: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: String,
  adminId: String,
  presidentId: String,
  logo: String,
  coverImage: String,
  members: [String],
  isActive: { type: Boolean, default: true },
  memberCount: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  clubId: String,
  organizerId: String,
  startDate: Date,
  endDate: Date,
  location: String,
  type: String,
  status: { type: String, default: 'upcoming' },
  poster: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Club = mongoose.model('Club', ClubSchema);
const Event = mongoose.model('Event', EventSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to local MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    
    // 1. Create Admin & Faculty User
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await User.create({
      email: 'admin@vignan.edu',
      password: hashedPassword,
      firstName: 'College',
      lastName: 'Admin',
      role: 'admin',
      rollNumber: 'ADMIN001',
      department: 'Management'
    });

    const faculty = await User.create({
      email: 'faculty@vignan.edu',
      password: hashedPassword,
      firstName: 'Dr. John',
      lastName: 'Doe',
      role: 'faculty',
      rollNumber: 'FAC001',
      department: 'CSE'
    });

    const studentAdmin = await User.create({
      email: 'student@vignan.edu',
      password: hashedPassword,
      firstName: 'Sam',
      lastName: 'Smith',
      role: 'student',
      rollNumber: '21CS001',
      department: 'CSE'
    });

    console.log('Users created');

    // 2. Create Clubs from User's List
    const clubsData = [
      { name: 'SAAC', category: 'social' },
      { name: 'NSS', category: 'social' },
      { name: 'NCC', category: 'social' },
      { name: 'E-Cell', category: 'technical' },
      { name: 'Sports', category: 'sports' },
      { name: 'Cultural', category: 'cultural' },
      { name: 'Coding Club', category: 'technical' }
    ];

    const clubs = clubsData.map(c => ({
      ...c,
      description: `Official ${c.name} organization at Vignan University.`,
      adminId: faculty._id.toString(),
      presidentId: studentAdmin._id.toString(),
      memberCount: Math.floor(Math.random() * 200) + 50,
      isActive: true
    }));

    const createdClubs = await Club.insertMany(clubs);
    console.log('Clubs created');

    // 3. Create a few events
    const codingClub = createdClubs.find(c => c.name === 'Coding Club');
    const sportsClub = createdClubs.find(c => c.name === 'Sports');

    const events = [
      {
        title: 'Kickoff Meeting',
        description: 'First meeting of the semester.',
        clubId: codingClub._id.toString(),
        organizerId: studentAdmin._id.toString(),
        startDate: new Date('2024-10-15T10:00:00'),
        endDate: new Date('2024-10-15T12:00:00'),
        location: 'Hall A',
        type: 'meeting',
        status: 'upcoming'
      },
      {
        title: 'Sports Trials',
        description: 'Selection for university team.',
        clubId: sportsClub._id.toString(),
        organizerId: studentAdmin._id.toString(),
        startDate: new Date('2024-11-05T08:00:00'),
        endDate: new Date('2024-11-05T17:00:00'),
        location: 'Sports Ground',
        type: 'competition',
        status: 'upcoming'
      }
    ];

    await Event.insertMany(events);
    console.log('Events created');

    console.log('Seeding completed successfully with specific club names!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
