import dotenv from 'dotenv';
dotenv.config();

import type { FileStorage } from './layer/file-storage.layer.js';
import { FileStorageLayer } from './layer/file-storage.layer.js';

export { FileStorageLayer };
export type { FileStorage };
export * from './r2/r2-file-storage.layer.js';

export type {
  PutObjectCommandOutput,
  CreateBucketCommandInput,
  CreateBucketCommandOutput,
} from '@aws-sdk/client-s3';
export type {
  BucketInfosInput,
  BucketInfosResult,
} from './r2/implementations/bucket-infos.effect.js';
export { FileStorageError, BucketNotFoundError } from './errors/index.js';
