export class UserNotAllowedToPostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotAllowedToPostError';
  }
}