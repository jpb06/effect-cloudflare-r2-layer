import { S3Client } from '@aws-sdk/client-s3';
import { Config, Effect, pipe } from 'effect';

const getR2Config = pipe(
  Effect.all([
    Config.string('CLOUDFLARE_ACCOUNT_ID'),
    Config.string('R2_DOCUMENTS_ACCESS_KEY_ID'),
    Config.string('R2_DOCUMENTS_SECRET_ACCESS_KEY'),
  ]),
  Effect.map(([cloudflareAccountId, accessKeyId, secretAccessKey]) => ({
    cloudflareAccountId,
    accessKeyId,
    secretAccessKey,
  })),
);

export const cloudflareR2StorageProvider = pipe(
  getR2Config,
  Effect.flatMap((config) =>
    Effect.succeed(
      new S3Client({
        region: 'auto',
        endpoint: `https://${config.cloudflareAccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      }),
    ),
  ),
);
