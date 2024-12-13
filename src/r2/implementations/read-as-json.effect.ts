import { Effect, pipe } from 'effect';

import { fetchFile } from './internal/index.js';

export const readAsJson = <
  TBucket extends string,
  TShape extends Record<string, unknown>,
>(
  bucketName: TBucket,
  documentKey: string,
) =>
  pipe(
    fetchFile(bucketName, documentKey),
    Effect.flatMap((response) => response.json),
    Effect.map((json) => json as TShape),
    Effect.withSpan('read-as-json', {
      attributes: { bucketName, documentKey },
    }),
  );
