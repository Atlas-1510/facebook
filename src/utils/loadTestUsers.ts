import User from "../models/User";
import { UserInterface } from "../models/User";

export default async function loadTestUsers() {
  const testUsers: UserInterface[] = [
    {
      email: "steve@rogers.com",
      firstName: "Steve",
      lastName: "Rogers",
    },
    {
      email: "tony@stark.com",
      firstName: "Tony",
      lastName: "Stark",
    },
    {
      email: "peter@parker.com",
      firstName: "Peter",
      lastName: "Parker",
    },
    {
      email: "bruce@banner.com",
      firstName: "Bruce",
      lastName: "Banner",
    },
  ];

  await User.deleteMany({});
  await User.insertMany(testUsers);

  const testUserIds = await User.find({}).distinct("_id");

  return testUserIds;
}
