import {
  CreateBucketCommandInput,
  CreateBucketCommandOutput,
  DeleteObjectCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { HttpClientError } from '@effect/platform/HttpClientError';
import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';
import { Scope } from 'effect/Scope';

import { HttpClient } from '@effect/platform/HttpClient';
import { tapLayer } from '@effects';
import type { BucketNotFoundError, FileStorageError } from '@errors';
import type {
  BucketInfosInput,
  BucketInfosResult,
  DeleteFileInput,
  UploadFileInput,
} from '@implementation';

export interface FileStorage {
  readonly createBucket: (
    input: CreateBucketCommandInput,
  ) => Effect.Effect<
    CreateBucketCommandOutput,
    ConfigError.ConfigError | FileStorageError,
    never
  >;
  readonly bucketInfos: <TBucket extends string>(
    input: BucketInfosInput<TBucket>,
  ) => Effect.Effect<
    BucketInfosResult,
    ConfigError.ConfigError | FileStorageError | BucketNotFoundError,
    never
  >;
  readonly getFileUrl: <TBucket extends string>(
    fileName: string,
    bucket: TBucket,
  ) => Effect.Effect<string, FileStorageError | ConfigError.ConfigError>;
  readonly readAsRawBinary: <TBucket extends string>(
    bucketName: TBucket,
    documentKey: string,
  ) => Effect.Effect<
    ArrayBuffer,
    ConfigError.ConfigError | HttpClientError | FileStorageError,
    HttpClient | Scope
  >;
  readonly readAsJson: <
    TBucket extends string,
    TShape extends Record<string, unknown>,
  >(
    bucketName: TBucket,
    documentKey: string,
  ) => Effect.Effect<
    TShape,
    ConfigError.ConfigError | HttpClientError | FileStorageError,
    HttpClient | Scope
  >;
  readonly readAsText: <TBucket extends string>(
    bucketName: TBucket,
    documentKey: string,
  ) => Effect.Effect<
    string,
    ConfigError.ConfigError | HttpClientError | FileStorageError,
    HttpClient | Scope
  >;
  readonly uploadFile: <TBucket extends string>({
    bucketName,
    documentKey,
    data,
    contentType,
  }: UploadFileInput<TBucket>) => Effect.Effect<
    PutObjectCommandOutput,
    ConfigError.ConfigError | FileStorageError,
    never
  >;
  readonly deleteFile: <TBucket extends string>({
    bucketName,
    documentKey,
  }: DeleteFileInput<TBucket>) => Effect.Effect<
    DeleteObjectCommandOutput,
    ConfigError.ConfigError | FileStorageError,
    never
  >;
}

export const FileStorageLayerContext =
  Context.GenericTag<FileStorage>('file-storage');

export const FileStorageLayer = {
  createBucket: (input: CreateBucketCommandInput) =>
    tapLayer(FileStorageLayerContext, ({ createBucket }) =>
      createBucket(input),
    ),
  bucketInfos: <TBucket extends string>(input: BucketInfosInput<TBucket>) =>
    tapLayer(FileStorageLayerContext, ({ bucketInfos }) => bucketInfos(input)),
  getFileUrl: <TBucket extends string>(bucket: TBucket, fileName: string) =>
    tapLayer(FileStorageLayerContext, ({ getFileUrl }) =>
      getFileUrl(bucket, fileName),
    ),
  readAsRawBinary: <TBucket extends string>(
    bucket: TBucket,
    fileName: string,
  ) =>
    tapLayer(FileStorageLayerContext, ({ readAsRawBinary }) =>
      readAsRawBinary(bucket, fileName),
    ),
  readAsJson: <TBucket extends string, TShape extends Record<string, unknown>>(
    bucket: TBucket,
    fileName: string,
  ) =>
    tapLayer(FileStorageLayerContext, ({ readAsJson }) =>
      readAsJson<TBucket, TShape>(bucket, fileName),
    ),
  readAsText: <TBucket extends string>(bucket: TBucket, fileName: string) =>
    tapLayer(FileStorageLayerContext, ({ readAsText }) =>
      readAsText(bucket, fileName),
    ),
  uploadFile: <TBucket extends string>(input: UploadFileInput<TBucket>) =>
    tapLayer(FileStorageLayerContext, ({ uploadFile }) => uploadFile(input)),
  deleteFile: <TBucket extends string>(input: DeleteFileInput<TBucket>) =>
    tapLayer(FileStorageLayerContext, ({ deleteFile }) => deleteFile(input)),
};
