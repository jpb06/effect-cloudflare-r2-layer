import { Effect, pipe } from 'effect';

import { fetchFile } from './internal/index.js';

export const readAsText = <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string,
) =>
  Effect.withSpan('read-as-text', {
    attributes: { bucketName, documentKey },
  })(
    pipe(
      fetchFile(bucketName, documentKey),
      Effect.flatMap((response) => response.text),
    ),
  );
