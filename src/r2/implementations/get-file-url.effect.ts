import { Effect, pipe } from 'effect';

import { cloudflareR2StorageProvider } from '../providers/r2-file-storage.provider.js';
import { getUrl } from './internal/get-url.effect.js';

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
