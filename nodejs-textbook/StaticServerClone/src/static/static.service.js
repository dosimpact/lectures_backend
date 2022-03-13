import express from 'express';
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

export const readDirectoryService = async ({ url, volumeRootDir }) => {
  const requestUrl = path.join(volumeRootDir, url);
  if (!isExistDirectory(requestUrl))
    throw new Error('no such file or directory');
  const files = await fs.readdir(requestUrl, { withFileTypes: true });
  const result = files.map((file) => {
    return { ...file, isDirectory: file.isDirectory() };
  });
  return { ls: result, requestUrl: url };
};
