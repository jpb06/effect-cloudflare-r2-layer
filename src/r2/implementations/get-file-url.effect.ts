import { Effect, pipe } from 'effect';

import { cloudflareR2StorageProvider } from '@provider';

import { getUrl } from './internal/index.js';

export const getFileUrl = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  Effect.withSpan('get-file-url', { attributes: { bucketName, documentKey } })(
    pipe(
      cloudflareR2StorageProvider,
      Effect.flatMap((provider) => getUrl(provider, bucketName, documentKey)),
    ),
  );
