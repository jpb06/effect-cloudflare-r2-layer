import { Layer } from 'effect';

import { FileStorageLayerContext } from '../layer/file-storage.layer.js';
import {
  createBucket,
  getFileUrl,
  readAsJson,
  readAsRawBinary,
  readAsText,
  uploadFile,
} from './implementations/index.js';

export const CloudflareR2StorageLayerLive = Layer.succeed(
  FileStorageLayerContext,
  FileStorageLayerContext.of({
    createBucket,
    getFileUrl,
    uploadFile,
    readAsText,
    readAsJson,
    readAsRawBinary,
  }),
);
