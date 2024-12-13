import { Effect, pipe } from 'effect';

import { fetchFile } from './internal/index.js';

export const readAsText = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  pipe(
    fetchFile(bucketName, documentKey),
    Effect.flatMap((response) => response.text),
    Effect.withSpan('read-as-text', {
      attributes: { bucketName, documentKey },
    }),
  );
