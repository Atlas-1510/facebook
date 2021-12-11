import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { UserInterface } from "../../models/User";

const getAllUsers = async (req: any, res: any, next: any) => {
  const users = await User.find();
  return res.send(users);
};

const createNewUser = async (req: any, res: any, next: any) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    res.status(201);
    return res.send(newUser);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: any, res: any, next: any) => {
  const { uid } = req.params;
  if (!isValidObjectId(uid)) {
    console.log("invalid UID");
    return next(createHttpError(400));
  } else {
    console.log("valid UID");
    const user = await User.findById(uid);
    if (!user) {
      return next(createHttpError(404));
    }
    return res.send(user);
  }
};

const updateUser = async (req: any, res: any, next: any) => {
  const { uid } = req.params;

  if (!isValidObjectId(uid)) {
    return next(createHttpError(400));
  }
  const user = await User.findById(uid);
  if (!user) {
    return next(createHttpError(404));
  }
  Object.keys(req.body).forEach((key) => {
    user[key as keyof UserInterface] = req.body[key];
  });

  const updatedDocument = await user.save();

  return res.send(updatedDocument);
};

export { getAllUsers, createNewUser, getUser, updateUser };
