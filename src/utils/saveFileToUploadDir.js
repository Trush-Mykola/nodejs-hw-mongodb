import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../constants/constants.js';
import { env } from 'node:process';

export const saveFileToUploadDir = async (file) => {
  const content = await fs.readFile(file.path);
  const newPath = path.join(UPLOAD_DIR, file.filename);
  await fs.writeFile(newPath, content);
  await fs.unlink(file.path);

  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
