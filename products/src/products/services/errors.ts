export enum ServiceErrorKind {
  Internal,
  DuplicateKey,
}

export class ServiceError extends Error {
  constructor(
    public readonly kind: ServiceErrorKind,
    public readonly message: string,
    public readonly originalError?: Error,
    public readonly info?: { [key: string]: string },
  ) {
    super(message);
  }
}
