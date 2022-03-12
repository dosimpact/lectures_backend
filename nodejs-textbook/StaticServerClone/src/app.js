import '../config/env.js';
import express from 'express';

console.log('MAINTAINER', process.env.MAINTAINER);
const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✨ server is running at http://localhost:${PORT}`);
});
