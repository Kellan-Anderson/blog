export class UserNotOwnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotOwnerError'
  }
}