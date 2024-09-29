import type { S3Client } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Effect } from 'effect';

import { FileStorageError } from '@errors';

const oneHourDuration = 60 * 60;

export const getUrl = <TBucket extends string>(
  provider: S3Client,
  bucketName: TBucket,
  documentKey: TBucket,
) =>
  Effect.withSpan('get-url', { attributes: { bucketName, documentKey } })(
    Effect.tryPromise({
      try: () =>
        awsGetSignedUrl(
          provider,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: documentKey,
          }),
          {
            expiresIn: oneHourDuration,
          },
        ),
      catch: (e) => new FileStorageError({ cause: e }),
    }),
  );
