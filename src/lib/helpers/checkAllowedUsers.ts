import { User } from "@clerk/nextjs/dist/types/server";

export default function checkAllowedUsers(user: User) {
  const allowedUsers = process.env.ALLOWED_USERS?.split(',');

  if(!allowedUsers) throw new Error('No admin users specified');

  const emails = user.emailAddresses;
  for(let i = 0; i < user.emailAddresses.length; i++) {
    const email = emails[i].emailAddress;
    if(allowedUsers.indexOf(email) !== -1) return true
  }

  return false;
}