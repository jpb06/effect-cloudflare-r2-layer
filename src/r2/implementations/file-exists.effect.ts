import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '@errors';
import { cloudflareR2StorageProvider } from '@provider';

export const fileExists = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  pipe(
    cloudflareR2StorageProvider,
    Effect.flatMap((provider) =>
      Effect.tryPromise({
        try: () =>
          provider.send(
            new HeadObjectCommand({
              Bucket: bucketName,
              Key: documentKey,
            }),
          ),
        catch: (e) => new FileStorageError({ cause: e }),
      }),
    ),
    Effect.map(() => true),
    Effect.catchTag('file-storage-error', (e) => {
      if (e.cause instanceof Error && e.cause.name === 'NotFound') {
        return Effect.succeed(false);
      }
      return Effect.fail(new FileStorageError({ cause: e }));
    }),
    Effect.withSpan('file-exists', {
      attributes: { bucketName, documentKey },
    }),
  );
