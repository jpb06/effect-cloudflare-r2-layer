import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { Effect, pipe } from 'effect';

import { BucketNotFoundError, FileStorageError } from '@errors';
import { cloudflareR2StorageProvider } from '@provider';

type MaybeWithName = { name?: string };

const hasName = (error: unknown): error is Required<MaybeWithName> => {
  return (error as MaybeWithName)?.name !== undefined;
};

export type BucketInfosInput<TBucket extends string> = {
  Bucket: TBucket;
  ExpectedBucketOwner?: string;
};

export type BucketInfosResult = {
  region: string | undefined;
};

export const bucketInfos = <TBucket extends string>(
  input: BucketInfosInput<TBucket>,
) =>
  pipe(
    cloudflareR2StorageProvider,
    Effect.flatMap((provider) =>
      Effect.tryPromise({
        try: () => provider.send(new HeadBucketCommand(input)),
        catch: (e) => {
          if (hasName(e) && e.name === 'NotFound') {
            return new BucketNotFoundError({ cause: e });
          }

          return new FileStorageError({ cause: e });
        },
      }),
    ),
    Effect.map((response) => ({
      region: response.BucketRegion,
    })),
    Effect.withSpan('bucket-infos', { attributes: { ...input } }),
  );
