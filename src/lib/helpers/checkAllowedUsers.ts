import { User } from "@clerk/nextjs/dist/types/server";

export default function checkAllowedUsers(user: User) {
  const allowedUsers = process.env.ALLOWED_USERS?.split(',');

  if(!allowedUsers) return true

  const emails = user.emailAddresses;
  for(let i = 0; i < user.emailAddresses.length; i++) {
    if(emails[i].emailAddress in allowedUsers) return true
  }

  return false;
}