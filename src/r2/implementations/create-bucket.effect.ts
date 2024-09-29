import {
  CreateBucketCommand,
  CreateBucketCommandInput,
} from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '../../errors/file-storage.error.js';
import { cloudflareR2StorageProvider } from '../providers/r2-file-storage.provider.js';

export const createBucket = (input: CreateBucketCommandInput) =>
  Effect.withSpan('create-bucket', { attributes: { ...input } })(
    pipe(
      cloudflareR2StorageProvider,
      Effect.flatMap((provider) =>
        Effect.tryPromise({
          try: () => provider.send(new CreateBucketCommand(input)),
          catch: (e) => new FileStorageError({ cause: e }),
        }),
      ),
    ),
  );
