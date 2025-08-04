import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/tutor_web';
    
    if (!mongoUri) {
      console.error('MongoDB URI not found in environment variables');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to MongoDB Database: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error in MongoDB Connection: ${error.message}`);
    console.log('💡 Make sure you have:');
    console.log('   1. Created a .env file with MONGODB_URI');
    console.log('   2. Set up MongoDB Atlas or local MongoDB');
    console.log('   3. Network access is configured correctly');
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
