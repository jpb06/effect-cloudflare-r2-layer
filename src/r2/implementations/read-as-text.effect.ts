import { HttpClient } from '@effect/platform';
import { Effect } from 'effect';

import { cloudflareR2StorageProvider } from '../providers/r2-file-storage.provider.js';
import { getUrl } from './get-url.effect.js';

export const readAsText = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  Effect.withSpan('read-as-text', {
    attributes: { bucketName, documentKey },
  })(
    Effect.gen(function* () {
      const provider = yield* cloudflareR2StorageProvider;
      const url = yield* getUrl(provider, bucketName, documentKey);

      const client = yield* HttpClient.HttpClient;
      const response = yield* client.get(url);

      return yield* response.text;
    }),
  );
