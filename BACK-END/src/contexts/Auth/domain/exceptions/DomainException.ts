export class DomainException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "DomainException";
    this.statusCode = statusCode;
  }
}
