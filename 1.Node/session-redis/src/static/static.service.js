import path from 'path';
import fsRef from 'fs';
import fs from 'fs/promises';

fs.constants = fsRef.constants;

export const isExistDirectory = async (requestUrl) => {
  try {
    await fs.access(requestUrl, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

export const readDirectory = async ({ url, volumeRootDir }) => {
  const requestUrl = path.join(volumeRootDir, url);

  if (!(await isExistDirectory(requestUrl)))
    throw new Error('no such file or directory');

  const files = await fs.readdir(requestUrl, { withFileTypes: true });
  const result = files.map((file) => {
    if (file.isDirectory()) {
      file.name = file.name + '/';
    }
    return { ...file, isDirectory: file.isDirectory() };
  });
  return { ls: result, requestUrl: url };
};

export const makeDirectory = async ({ url, volumeRootDir }) => {
  // 같은 경로의 이름으로 파일이 존재하면 안된다.
  const requestUrl = path.join(volumeRootDir, url);
  await fs.mkdir(requestUrl, { recursive: true });
};
