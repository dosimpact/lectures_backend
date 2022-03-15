import './config/env.js';
import path from 'path';
import process from 'process';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import staticController from './static/static.controller.js';
import contentDisposition from 'content-disposition';
const app = express();
const PORT = process.env.PORT || 4000; // === Common middleware ===

app.use(logger('common'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(helmet()); // === Controller ===

app.use('/api/static', staticController); // === serving client Files ===

const ClientFilePath = path.join(process.cwd(), '/client/build/');
app.use(express.static(ClientFilePath)); // app.get('/*', (req, res) =>
//   res.sendFile(path.join(ClientFilePath, 'index.html')),
// );
// 404 Not Found

app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
}); // 500 Server Error

app.use((err, req, res, next) => {
  console.log('[RootHandler] Server Error: ', err);
  res.status(500).send('Server Error');
});
app.listen(PORT, () => {
  console.log(`✨ server is running at http://localhost:${PORT}`);
});