export class PaymasterError extends Error {
  public readonly errorCode: string;

  constructor(message: string, errorCode = 'GENERAL') {
    super(message);
    this.errorCode = errorCode;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PaymasterError.prototype);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaymasterError);
    }

    this.name = this.constructor.name;
  }
}
