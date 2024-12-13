import { Effect, pipe } from 'effect';

import { fetchFile } from './internal/index.js';

export const readAsRawBinary = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  pipe(
    fetchFile(bucketName, documentKey),
    Effect.flatMap((response) => response.arrayBuffer),
    Effect.withSpan('read-as-raw-binary', {
      attributes: { bucketName, documentKey },
    }),
  );
