import { TaggedError } from 'effect/Data';

export class BucketNotFoundError extends TaggedError('bucket-not-found-error')<{
  cause?: unknown;
  message?: string;
}> {}
