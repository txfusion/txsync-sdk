export class TsukoError extends Error {
  public readonly errorCode: string;

  constructor(message: string, errorCode = 'GENERAL') {
    super(message);
    this.errorCode = errorCode;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TsukoError.prototype);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TsukoError);
    }

    this.name = this.constructor.name;
  }
}
