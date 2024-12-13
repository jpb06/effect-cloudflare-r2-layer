import {
  CreateBucketCommand,
  CreateBucketCommandInput,
} from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '@errors';
import { cloudflareR2StorageProvider } from '@provider';

export const createBucket = (input: CreateBucketCommandInput) =>
  pipe(
    cloudflareR2StorageProvider,
    Effect.flatMap((provider) =>
      Effect.tryPromise({
        try: () => provider.send(new CreateBucketCommand(input)),
        catch: (e) => new FileStorageError({ cause: e }),
      }),
    ),
    Effect.withSpan('create-bucket', { attributes: { ...input } }),
  );
