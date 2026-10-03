import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// In Netlify serverless, only /tmp is writable.
// LAMBDA_TASK_ROOT is set by AWS Lambda (which powers Netlify Functions).
const isNetlify = !!process.env.LAMBDA_TASK_ROOT || !!process.env.NETLIFY;

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'petconnect_super_secret_jwt_key_2026_final_year_project',
  jwtExpiresIn: '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dataDir: isNetlify ? '/tmp/petconnect-data' : path.join(__dirname, '../../data'),
};
