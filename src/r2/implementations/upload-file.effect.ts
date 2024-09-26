import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '../../errors/file-storage.error.js';
import { cloudflareR2StorageProvider } from '../providers/r2-file-storage.provider.js';

export interface UploadFileInput<TBucket extends string> {
  bucketName: TBucket;
  documentKey: string;
  data: Buffer;
  contentType: string | undefined;
}

export const uploadFile = <TBucket extends string>({
  bucketName,
  documentKey,
  data,
  contentType,
}: UploadFileInput<TBucket>) =>
  Effect.withSpan('upload-file', {
    attributes: { bucketName, documentKey, contentType },
  })(
    pipe(
      cloudflareR2StorageProvider,
      Effect.flatMap((provider) =>
        Effect.tryPromise({
          try: () =>
            provider.send(
              new PutObjectCommand({
                Body: data,
                ContentType: contentType as string,
                Key: documentKey,
                Bucket: bucketName,
              }),
            ),
          catch: (e) => new FileStorageError({ cause: e }),
        }),
      ),
    ),
  );
