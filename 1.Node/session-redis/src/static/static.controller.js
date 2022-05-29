import express from 'express';
import path from 'path';
import { uploadMiddleware } from './static.middleware.js';
import { readDirectory, makeDirectory } from './static.service.js';
const router = express.Router();

const volumeRootDir = process.env.VOLUME_ROOT_DIR
  ? process.env.VOLUME_ROOT_DIR
  : path.join(process.cwd(), '/volume');

// 경로에 파일 리소스가 있는 경우
router.use(
  '/',
  express.static(volumeRootDir, {
    setHeaders: function (res, path) {
      // res.setHeader('Content-Disposition', 'attachment');
    },
  }),
);
// GET
// 경로가 디렉터리인 경우
router.get('/*', async (req, res) => {
  try {
    const result = await readDirectory({ url: req.url, volumeRootDir });
    res.send(result);
  } catch (error) {
    res.send('Cannot Access Directory');
  }
});

const singleUploadContoller = (req, res, next) => {
  const { file, files } = req;
  if (file) {
    return res.send({
      originalname: file.originalname,
      destination: path.join(req.url),
    });
  }
  if (files) {
    return res.send(
      files.map((file) => ({
        originalname: file.originalname,
        destination: path.join(req.url),
      })),
    );
  }
  // file에 관한 처리가 안된 경우, 다음 미들웨어로 넘긴다.
  next();
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

// POST
// 파일을 업로드 한다.
router.post(
  '/*',
  uploadMiddleware({ volumeRootDir }).array('file'),
  /* PASS multpart/form-data || No multpart/form-data */
  singleUploadContoller,
  /* exist multpart/form-data && exist Error */
  singleUploadErrorHandler,
);
// 디렉터리 생성
router.post('/*', async (req, res) => {
  try {
    await makeDirectory({ volumeRootDir, url: req.url });
    return res.send({ ok: true, createdDirectory: req.url });
  } catch (error) {
    return res
      .status(400)
      .send({ log: 'cannot make directory', message: error.message });
  }
});

export default router;
