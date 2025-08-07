const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

process.env.PORT = process.env.PORT || 9000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fillrouge';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const PORT = process.env.PORT;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});