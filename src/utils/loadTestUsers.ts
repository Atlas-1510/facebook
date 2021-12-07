import User from "../models/User";
import UserInterface from "../models/UserInterface";

export default async function loadTestUsers() {
  const testUsers: UserInterface[] = [
    {
      firstName: "Steve",
      lastName: "Rogers",
    },
    {
      firstName: "Tony",
      lastName: "Stark",
    },
    {
      firstName: "Peter",
      lastName: "Parker",
    },
    {
      firstName: "Bruce",
      lastName: "Banner",
    },
  ];

  await User.deleteMany({});
  await User.insertMany(testUsers);

  const testUserIds = await User.find({}).distinct("_id");

  return testUserIds;
}
