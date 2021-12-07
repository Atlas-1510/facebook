import User from "../models/User";

export default async function loadTestUsers() {
  await User.deleteMany({});
  await User.insertMany([
    {
      uid: 1,
      firstName: "Steve",
      lastName: "Rogers",
    },
    {
      uid: 2,
      firstName: "Tony",
      lastName: "Stark",
    },
    {
      uid: 3,
      firstName: "Peter",
      lastName: "Parker",
    },
    {
      uid: 4,
      firstName: "Bruce",
      lastName: "Banner",
    },
  ]);
}
