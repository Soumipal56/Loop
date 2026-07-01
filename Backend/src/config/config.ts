import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'PORT', 'NODE_ENV', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Required environment variable ${envVar} is missing.`);
    process.exit(1);
  }
});

export const config = {
  mongodbUri: process.env.MONGODB_URI as string,
  port: parseInt(process.env.PORT as string, 10) || 5000,
  nodeEnv: process.env.NODE_ENV as string,
  jwtSecret: process.env.JWT_SECRET as string,
  emailUser: process.env.EMAIL_USER as string,
  emailPass: process.env.EMAIL_PASS as string,
  frontendUrl: process.env.FRONTEND_URL as string || 'http://localhost:5173',
};
