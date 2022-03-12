import dotenv from 'dotenv';
import path from 'path';
import process from 'process';

dotenv.config({ path: path.join(process.cwd(), '.env.dev') });
