const dotenv = require('dotenv');
const path = require('path');
const process = require('process');

process.env.NODE_ENV === 'development'
  ? dotenv.config({ path: path.join(process.cwd(), '.env.dev') })
  : dotenv.config({ path: path.join(process.cwd(), '.env.prod') });

