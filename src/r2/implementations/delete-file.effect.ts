import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '@errors';
import { cloudflareR2StorageProvider } from '@provider';

export interface DeleteFileInput<TBucket extends string> {
  bucketName: TBucket;
  documentKey: string;
}

export const deleteFile = <TBucket extends string>({
  bucketName,
  documentKey,
}: DeleteFileInput<TBucket>) =>
  pipe(
    cloudflareR2StorageProvider,
    Effect.flatMap((provider) =>
      Effect.tryPromise({
        try: () =>
          provider.send(
            new DeleteObjectCommand({
              Key: documentKey,
              Bucket: bucketName,
            }),
          ),
        catch: (e) => new FileStorageError({ cause: e }),
      }),
    ),
    Effect.withSpan('delete-file', {
      attributes: { bucketName, documentKey },
    }),
  );
