import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { FileStorageError } from '@errors';
import { cloudflareR2StorageProvider } from '@provider';

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
