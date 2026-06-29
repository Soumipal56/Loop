import app from './src/app.js';
import connectDB from './src/config/db.js';
import { config } from './src/config/config.js';

// Connect to MongoDB
connectDB();

app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});
