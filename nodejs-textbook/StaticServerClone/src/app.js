import '../config/env.js';
import express from 'express';
import process from 'process';
import staticController from './static/static.controller.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/static', staticController);

app.get('/file', (req, res) => {
  res.sendFile();
});

// 404 Not Found
app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

// 500 Server Error
app.use((err, req, res, next) => {
  console.log('[RootHandler] Server Error: ', err);
  res.status(500).send('Server Error');
});

app.listen(PORT, () => {
  console.log(`✨ server is running at http://localhost:${PORT}`);
});
