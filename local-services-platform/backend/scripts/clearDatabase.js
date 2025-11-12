require('dotenv').config();
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Service = require('../models/Service');

async function clearDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    console.log('Connected to database successfully.\n');

    // Delete all reviews (ratings)
    const reviewResult = await Review.deleteMany({});
    console.log(`✓ Deleted ${reviewResult.deletedCount} reviews (ratings)`);

    // Delete all bookings (orders)
    const bookingResult = await Booking.deleteMany({});
    console.log(`✓ Deleted ${bookingResult.deletedCount} bookings (orders)`);

    // Delete all services (they depend on providers)
    const serviceResult = await Service.deleteMany({});
    console.log(`✓ Deleted ${serviceResult.deletedCount} services`);

    // Delete all users (both users and providers)
    const userResult = await User.deleteMany({});
    console.log(`✓ Deleted ${userResult.deletedCount} users (including providers)`);

    console.log('\n✅ Database cleared successfully!');
    console.log('All users, providers, bookings, and reviews have been removed.');
    
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

clearDatabase();

