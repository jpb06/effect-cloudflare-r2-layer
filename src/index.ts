import dotenv from 'dotenv';
dotenv.config();

import type { FileStorage } from './layer/file-storage.layer.js';
import { FileStorageLayer } from './layer/file-storage.layer.js';

export { FileStorageLayer };
export type { FileStorage };
export * from './r2/r2-file-storage.layer.js';
