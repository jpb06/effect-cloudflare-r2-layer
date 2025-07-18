# effect-cloudflare-r2-layer

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://github.dev/jpb06/effect-cloudflare-r2-layer)
![Last commit](https://img.shields.io/github/last-commit/jpb06/effect-cloudflare-r2-layer?logo=git)
![npm downloads](https://img.shields.io/npm/dw/effect-cloudflare-r2-layer?logo=npm&logoColor=red&label=npm%20downloads)
![npm bundle size](https://img.shields.io/bundlephobia/min/effect-cloudflare-r2-layer)

An effect layer to interact with Cloudware R2 storage service.

<!-- readme-package-icons start -->

<p align="left"><a href="https://docs.github.com/en/actions" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GithubActions-Dark.svg" /></a>&nbsp;<a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp;<a href="https://nodejs.org/en/docs/" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NodeJS-Dark.svg" /></a>&nbsp;<a href="https://bun.sh/docs" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Bun-Dark.svg" /></a>&nbsp;<a href="https://aws.amazon.com/developer/language/javascript/" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/AWS-Dark.svg" /></a>&nbsp;<a href="https://biomejs.dev/guides/getting-started/" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Biome-Dark.svg" /></a>&nbsp;<a href="https://github.com/motdotla/dotenv#readme" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Dotenv-Dark.svg" /></a>&nbsp;<a href="https://vitest.dev/guide/" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Vitest-Dark.svg" /></a>&nbsp;<a href="https://www.effect.website/docs/quickstart" target="_blank"><img height="50" width="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Effect-Dark.svg" /></a></p>

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

| function                               | description                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`createBucket`](#-createbucket)       | Create a bucket                                                                           |
| [`bucketInfos`](#-bucketinfos)         | Get bucket infos                                                                          |
| [`uploadFile`](#-uploadfile)           | Adds a file to the specified bucket                                                       |
| [`deleteFile`](#-deleteFile)           | Removes a file from the specified bucket                                                  |
| [`getFileUrl`](#-getfileurl)           | Gets a pre-signed url to fetch a ressource by its `filename` from the specified `bucket`. |
| [`readAsJson`](#-readasjson)           | Fetches a file, expecting a content extending `Record<string, unknown>`.                  |
| [`readAsText`](#-readastext)           | Fetches a file as a string.                                                               |
| [`readAsRawBinary`](#-readasrawbinary) | Fetches a file as raw binary (ArrayBuffer).                                               |
| [`fileExists`](#-fileexists)           | Checks if a file exists in a bucket                                                       |

### 🔶 `createBucket`

```typescript
type createBucket = (
  input: CreateBucketCommandInput
) => Effect.Effect<
  CreateBucketCommandOutput,
  FileStorageError | ConfigError,
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

const task = pipe(
  Effect.gen(function* () {
    const result = yield* FileStorageLayer.createBucket({
      Bucket: 'test',
      CreateBucketConfiguration: {
        Bucket: {
          Type: 'Directory',
          DataRedundancy: 'SingleAvailabilityZone',
        },
      },
    });

    // ...
  }),
  Effect.provide(CloudflareR2StorageLayerLive)
);
```

### 🔶 `bucketInfos`

```typescript
type BucketInfosInput<TBucket extends string> = {
  Bucket: TBucket;
  ExpectedBucketOwner?: string;
};

type BucketInfosResult = {
  region?: string;
};

type bucketInfos = <TBucket extends string>(
  input: BucketInfosInput<TBucket>
) => Effect.Effect<
  BucketInfosResult,
  ConfigError | FileStorageError | BucketNotFoundError,
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

const task = pipe(
  Effect.gen(function* () {
    const result = yield* FileStorageLayer.bucketInfos<Buckets>({
      Bucket: 'assets',
    });

    // ...
  }),
  Effect.provide(CloudflareR2StorageLayerLive)
);
```

### 🔶 `uploadFile`

Adds a file to the specified bucket.

```typescript
interface UploadFileInput<TBucket extends string> {
  bucketName: TBucket;
  key: string;
  data: Buffer;
  contentType: string | undefined;
}

type uploadFile = <TBucket extends string>(
  input: UploadFileInput<TBucket>
) => Effect.Effect<
  PutObjectCommandOutput,
  FileStorageError | ConfigError,
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

### 🔶 `deleteFile`

Removes a file from the specified bucket.

```typescript
interface DeleteFileInput<TBucket extends string> {
  bucketName: TBucket;
  key: string;
}

type deleteFile = <TBucket extends string>(
  input: DeleteFileInput<TBucket>
) => Effect.Effect<
  DeleteObjectCommandOutput,
  FileStorageError | ConfigError,
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
const fileName = 'yolo.jpg';
const filePath = './assets/yolo.jpg';

const task = pipe(
  Effect.gen(function* () {
    yield* FileStorageLayer.deleteFile<Buckets>({
      bucketName: 'assets',
      documentKey: fileName,
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
  FileStorageError | ConfigError,
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
type readAsJson = <
  TBucket extends string,
  TShape extends Record<string, unknown>
>(
  bucket: TBucket,
  fileName: string
) => Effect.Effect<
  TShape,
  HttpClientError | FileStorageError | ConfigError,
  FileStorage | Scope | HttpClient>
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
    FileStorage | Scope | HttpClient
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
    FileStorage | Scope | HttpClient
  >;
```

#### 🧿 Example

```typescript
import { FetchHttpClient } from '@effect/platform';
import { FileSystem } from '@effect/platform/FileSystem';
import { Effect, Layer, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

type Buckets = 'assets' | 'config';

const task = pipe(
  pipe(
    Effect.gen(function* () {
      const buffer = yield* FileStorageLayer.readAsRawBinary<Buckets>(
        'assets',
        'yolo.jpg'
      );

      const fs = yield* FileSystem;
      const buffer = Buffer.from(data);
      yield* fs.writeFile('./file.jpg', buffer);
    }),
    Effect.scoped,
    Effect.provide(
      Layer.mergeAll(CloudflareR2StorageLayerLive, FetchHttpClient.layer)
    )
  )
);
```

### 🔶 `fileExists`

```typescript
type fileExists = <TBucket extends string>(
  bucket: TBucket,
  fileName: string
) => Effect.Effect<boolean, ConfigError | FileStorageError, FileStorage>;
```

#### 🧿 Example

```typescript
import { Effect, pipe } from 'effect';
import {
  CloudflareR2StorageLayerLive,
  FileStorageLayer,
} from 'effect-cloudflare-r2-layer';

type Bucket = 'assets' | 'config';

const filePath = 'my-app/config.json';

const task = pipe(
  Effect.gen(function* () {
    const exists = yield* FileStorageLayer.fileExists<Bucket>(
      'config',
      filePath
    );

    // ...
  }),
  Effect.provide(CloudflareR2StorageLayerLive)
);
```
