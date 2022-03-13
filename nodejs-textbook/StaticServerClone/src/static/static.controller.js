import express from 'express';
import path from 'path';
import { uploadMiddleware } from './static.middleware.js';
import { readDirectoryService } from './static.service.js';

const router = express.Router();

const volumeRootDir = process.env.VOLUME_ROOT_DIR
  ? process.env.VOLUME_ROOT_DIR
  : path.join(process.cwd(), '/volume');

const singleUploadMiddleware = uploadMiddleware({ volumeRootDir });
const singleUploadContoller = (req, res) => {
  const { file } = req;
  res.send({
    originalname: file.originalname,
    destination: path.join(req.url),
  });
};
const singleUploadErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(404).send({
      message: err.message,
    });
    return;
  }
  next();
};

// 경로에 파일 리소스가 있는 경우
router.use('/', express.static(volumeRootDir));
// 경로가 디렉터리인 경우
router.get('/*', async (req, res) => {
  try {
    const result = await readDirectoryService({ url: req.url, volumeRootDir });
    res.send(result);
  } catch (error) {
    res.send('Cannot Access Directory');
  }
});

// post 요청은 파일을 업로드 한다.

router.post(
  '/*',
  singleUploadMiddleware,
  singleUploadContoller,
  singleUploadErrorHandler,
);

export default router;
