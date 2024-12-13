import { Layer } from 'effect';

import {
  bucketInfos,
  createBucket,
  deleteFile,
  getFileUrl,
  readAsJson,
  readAsRawBinary,
  readAsText,
  uploadFile,
} from '@implementation';

import { FileStorageLayerContext } from '../layer/file-storage.layer.js';

export const CloudflareR2StorageLayerLive = Layer.succeed(
  FileStorageLayerContext,
  FileStorageLayerContext.of({
    createBucket,
    bucketInfos,
    getFileUrl,
    uploadFile,
    deleteFile,
    readAsText,
    readAsJson,
    readAsRawBinary,
  }),
);
