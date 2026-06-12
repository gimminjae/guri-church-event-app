const REQUIRED_SERVER_ENV_KEYS = [
  "NEXT_PUBLIC_AWS_REGION",
  "NEXT_PUBLIC_AWS_S3_BUCKET_NAME",
  "NEXT_PUBLIC_AWS_ACCESS_KEY_ID",
  "NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
] as const;

export type RequiredServerEnvKey = (typeof REQUIRED_SERVER_ENV_KEYS)[number];

export type ServerEnv = {
  awsAccessKeyId: string;
  awsRegion: string;
  awsS3BucketName: string;
  awsS3PublicBaseUrl: string | null;
  awsSecretAccessKey: string;
  firebaseDatabaseUrl: string;
};

export function getFirebaseDatabaseUrl() {
  return (
    process.env.FIREBASE_DATABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim() ||
    ""
  );
}

export function getMissingServerEnv(): RequiredServerEnvKey[] {
  return REQUIRED_SERVER_ENV_KEYS.filter((key) => {
    const value =
      key === "NEXT_PUBLIC_FIREBASE_DATABASE_URL"
        ? getFirebaseDatabaseUrl()
        : process.env[key];

    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function getServerEnv(): ServerEnv {
  const missingEnvVars = getMissingServerEnv();

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`,
    );
  }

  return {
    awsAccessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!.trim(),
    awsRegion: process.env.NEXT_PUBLIC_AWS_REGION!.trim(),
    awsS3BucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!.trim(),
    awsS3PublicBaseUrl:
      process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BASE_URL?.trim() || null,
    awsSecretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!.trim(),
    firebaseDatabaseUrl: getFirebaseDatabaseUrl(),
  };
}
