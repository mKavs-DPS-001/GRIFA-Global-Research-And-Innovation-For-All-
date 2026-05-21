import 'dotenv/config';

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to Database
    await connectDB();
    
    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
