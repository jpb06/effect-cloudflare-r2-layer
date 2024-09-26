import { Layer } from 'effect';

import { FileStorageLayerContext } from '../layer/file-storage.layer.js';
import { getFileUrl, uploadFile } from './implementations/index.js';
import { readAsJson } from './implementations/read-as-json.effect.js';
import { readAsRawBinary } from './implementations/read-as-raw-binary.effect.js';
import { readAsText } from './implementations/read-as-text.effect.js';

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
