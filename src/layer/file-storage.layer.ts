import { HttpClientError } from '@effect/platform/HttpClientError';
import type { ConfigError, Effect } from 'effect';
import { Context } from 'effect';

import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { HttpClient } from '@effect/platform';
import { Scope } from 'effect/Scope';
import type { FileStorageError } from '../errors/file-storage.error.js';
import type { UploadFileInput } from '../r2/implementations/index.js';
import { tapLayer } from './../effects/tapLayer.effect.js';

export interface FileStorage {
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
    Scope | HttpClient.HttpClient.Service
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
    Scope | HttpClient.HttpClient.Service
  >;
  readonly readAsText: <TBucket extends string>(
    bucketName: TBucket,
    documentKey: string,
  ) => Effect.Effect<
    string,
    ConfigError.ConfigError | HttpClientError | FileStorageError,
    Scope | HttpClient.HttpClient.Service
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
}

export const FileStorageLayerContext =
  Context.GenericTag<FileStorage>('file-storage');

export const FileStorageLayer = {
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
};
