# effect-cloudflare-r2-layer

An effect layer to interact with Cloudware R2 storage service.

<!-- readme-package-icons start -->

<p align="left"><a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp;<a href="https://nodejs.org/en/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NodeJS-Dark.svg" /></a>&nbsp;<a href="https://bun.sh/docs" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Bun-Dark.svg" /></a>&nbsp;<a href="https://aws.amazon.com/developer/language/javascript/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/AWS-Dark.svg" /></a>&nbsp;<a href="https://biomejs.dev/guides/getting-started/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Biome-Dark.svg" /></a>&nbsp;<a href="https://github.com/motdotla/dotenv#readme" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Dotenv-Dark.svg" /></a>&nbsp;<a href="https://www.effect.website/docs/quickstart" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Effect-Dark.svg" /></a></p>

<!-- readme-package-icons end -->

## ⚡ Quick start

### 🔶 Install

```bash
npm i effect-cloudflare-r2-layer
# or
pnpm i effect-cloudflare-r2-layer
# or
bun i effect-cloudflare-r2-layer
```

### 🔶 Use the layer

```typescript
import { FetchHttpClient } from '@effect/platform';
import { Effect, Layer, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

const task = pipe(
  FileStorageLayer.readAsText('my-bucket', 'some-file.txt'),
  Effect.scoped,
  Effect.provide(
    Layer.mergeAll(CloudflareR2StorageLayerLive, FetchHttpClient.layer)
  )
);

/* task is of type

  Effect.Effect<
    string, 
    ConfigError | HttpClientError | FileStorageError, 
    never
  >
*/
```

## ⚡ Env variables

The layer requires the following env variables:

```env
CLOUDFLARE_ACCOUNT_ID=""
R2_DOCUMENTS_ACCESS_KEY_ID=""
R2_DOCUMENTS_SECRET_ACCESS_KEY=""
```

## ⚡ API

| function                                          | description                                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`uploadFile`](./README.md#-uploadfile)           | Adds a file to the specified bucket                                                       |
| [`getFileUrl`](./README.md#-getfileurl)           | Gets a pre-signed url to fetch a ressource by its `filename` from the specified `bucket`. |
| [`readAsJson`](./README.md#-readasjson)           | Fetches a file, expecting a content extending `Record<string, unknown>`.                  |
| [`readAsText`](./README.md#-readastext)           | Fetches a file as a string.                                                               |
| [`readAsRawBinary`](./README.md#-readasrawbinary) | Fetches a file as raw binary (ArrayBuffer).                                               |

### 🔶 `uploadFile`

Adds a file to the specified bucket.

```typescript
interface UploadFileInput<TBucket extends string> {
  bucketName: TBucket;
  key: string;
  data: Buffer;
  contentType: string | undefined;
}

type uploadFile = <TBucket extends string>({
  bucketName,
  documentKey,
  data,
  contentType,
}: UploadFileInput<TBucket>) => Effect.Effect<
  PutObjectCommandOutput,
  FileStorageError | ConfigError,
  never
>;
```

#### 🧿 Example

```typescript
import { Effect, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';
import { readFile } from 'fs-extra';

type Buckets = 'assets' | 'config';
const fileName = 'yolo.jpg';
const filePath = './assets/yolo.jpg';

const task = pipe(
  Effect.gen(function* () {
    const fileData = yield* Effect.tryPromise({
      try: () => readFile(filePath),
      catch: (e) => new FsError({ cause: e  }),
    });

    yield* FileStorageLayer.uploadFile<Buckets>({
      bucketName: 'assets',
      documentKey: fileName,
      data: fileData,
      contentType: 'image/jpeg',
    });

    // ...
  }),
  Effect.provide(CloudflareR2StorageLayerLive);
);
```

### 🔶 `getFileUrl`

Gets a pre-signed url to fetch a ressource by its `filename` from the specified `bucket`.

```typescript
type getFileUrl = <TBucket extends string>(
  bucket: TBucket
  fileName: string,
) => Effect.Effect<
  string,
  FileStorageError | ConfigError.ConfigError,
  FileStorage
>;
```

#### 🧿 Example

```typescript
import { Effect, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

type Buckets = 'assets' | 'config';
const filename = 'yolo.jpg';

const task = pipe(
  Effect.gen(function* () {
    const url = yield* FileStorageLayer.getFileUrl<Buckets>('assets', filename);

    // ...
  }),
  Effect.provide(CloudflareR2StorageLayerLive);
);
```

### 🔶 `readAsJson`

Fetches a file, expecting a content extending `Record<string, unknown>`.

```typescript
readAsJson: <TBucket extends string, TShape extends Record<string, unknown>>(
  bucketName: TBucket,
  documentKey: string
) =>
  Effect.Effect<
    TShape,
    ConfigError | HttpClientError | FileStorageError,
    Scope | HttpClient.HttpClient.Service
  >;
```

#### 🧿 Example

```typescript
import { FetchHttpClient } from '@effect/platform';
import { Effect, Layer, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

type Buckets = 'assets' | 'config';

type JsonData = {
  cool: boolean;
  yolo: string;
};

const task = pipe(
  pipe(
    Effect.gen(function* () {
      const json = yield* FileStorageLayer.readAsJson<Buckets, JsonData>(
        'config',
        'app-config.json'
      );

      // json is of type JsonData ...
    }),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(CloudflareR2StorageLayerLive, FetchHttpClient.layer)
    )
  )
);
```

### 🔶 `readAsText`

Fetches a file as a string.

```typescript
readAsText: <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string
) =>
  Effect.Effect<
    string,
    ConfigError | HttpClientError | FileStorageError,
    Scope | HttpClient.HttpClient.Service
  >;
```

#### 🧿 Example

```typescript
import { FetchHttpClient } from '@effect/platform';
import { Effect, Layer, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

type Buckets = 'assets' | 'config';

const task = pipe(
  pipe(
    Effect.gen(function* () {
      const text = yield* FileStorageLayer.readAsText<Buckets>(
        'assets',
        'content.txt'
      );

      // ...
    }),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(CloudflareR2StorageLayerLive, FetchHttpClient.layer)
    )
  )
);
```

### 🔶 `readAsRawBinary`

Fetches a file as raw binary.

```typescript
readAsRawBinary: <TBucket extends string>(
  bucketName: TBucket,
  documentKey: string
) =>
  Effect.Effect<
    ArrayBuffer,
    ConfigError | HttpClientError | FileStorageError,
    Scope | HttpClient.HttpClient.Service
  >;
```

#### 🧿 Example

```typescript
import { FetchHttpClient } from '@effect/platform';
import { Effect, Layer, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';
import fs from 'fs-extra';
import { TaggedError } from 'effect/Data';

export class FsError extends TaggedError('FsError')<{
  cause?: unknown;
}> {}

type Buckets = 'assets' | 'config';

const task = pipe(
  pipe(
    Effect.gen(function* () {
      const buffer = yield* FileStorageLayer.readAsRawBinary<Buckets>(
        'assets',
        'yolo.jpg'
      );

      yield* Effect.tryPromise({
        try: () =>
          fs.writeFile('./file.jpg', Buffer.from(buffer), {
            encoding: 'utf-8',
          }),
        catch: (e) => new FsError({ cause: e }),
      });
    }),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(CloudflareR2StorageLayerLive, FetchHttpClient.layer)
    )
  )
);
```
