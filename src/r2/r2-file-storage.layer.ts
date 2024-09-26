import { Layer } from 'effect';

import { FileStorageLayerContext } from '../layer/file-storage.layer.js';
import {
  getFileUrl,
  readAsJson,
  readAsRawBinary,
  readAsText,
  uploadFile,
} from './implementations/index.js';

export const CloudflareR2StorageLayerLive = Layer.succeed(
  FileStorageLayerContext,
  FileStorageLayerContext.of({
    getFileUrl,
    uploadFile,
    readAsText,
    readAsJson,
    readAsRawBinary,
  }),
);
