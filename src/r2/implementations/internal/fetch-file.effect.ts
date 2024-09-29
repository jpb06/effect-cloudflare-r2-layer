import { HttpClient } from '@effect/platform';
import { Effect } from 'effect';

import { cloudflareR2StorageProvider } from '@provider';

import { getUrl } from './get-url.effect.js';

export const fetchFile = (bucketName: string, documentKey: string) =>
  Effect.gen(function* () {
    const provider = yield* cloudflareR2StorageProvider;
    const url = yield* getUrl(provider, bucketName, documentKey);

    const client = yield* HttpClient.HttpClient;
    return yield* client.get(url);
  });
