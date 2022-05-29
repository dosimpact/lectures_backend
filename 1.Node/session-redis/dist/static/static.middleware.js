import multer from 'multer';
import path from 'path';
import { isExistDirectory } from './static.service.js';
export const uploadMiddleware = ({
  volumeRootDir
}) => multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const destDir = path.join(volumeRootDir, req.url); // 해당 디렉터리가 존재하지 않는경우 ?

      if (!(await isExistDirectory(destDir))) {
        cb(new Error('no such file or directory~'));
      }

      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      // 동일한 파일 이름이 있는 경우 ?
      // - 덮어쓰기가 된다.
      cb(null, file.originalname);
    }
  }),
  limits: {
    fileSize: 200 * 1024 * 1024
  }
});