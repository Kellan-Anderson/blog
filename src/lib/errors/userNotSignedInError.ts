export class UserNotSignedInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'userNotSignedIn'
  }
}