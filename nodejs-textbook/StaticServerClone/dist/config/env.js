import dotenv from 'dotenv';
import path from 'path';
import process from 'process';
process.env.NODE_ENV === 'development' ? dotenv.config({
  path: path.join(process.cwd(), '.env.dev')
}) : dotenv.config({
  path: path.join(process.cwd(), '.env.prod')
});