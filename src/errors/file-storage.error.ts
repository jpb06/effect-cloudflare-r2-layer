import { TaggedError } from 'effect/Data';

export class FileStorageError extends TaggedError('file-storage-error')<{
  cause?: unknown;
  message?: string;
}> {}
