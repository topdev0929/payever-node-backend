export enum ProcessorErrorKind {
  FetchFailed = 'fetch-failed',
  ParsingFailed = 'parsing-failed',
  ValidationFailed = 'validation-failed',
}

export class FileProcessorException extends Error {
  constructor(
    readonly kind: ProcessorErrorKind,
    readonly message: string, readonly data: { },
    readonly originalError?: Error,
  ) {
    super(message);
  }
}
