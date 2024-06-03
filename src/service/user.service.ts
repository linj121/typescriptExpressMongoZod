import type { FilterQuery } from "mongoose";
import { omit } from "lodash"
import UserModel, { UserInput, UserDocument } from "../models/user.model";
import logger from "../utils/logger";

export async function createUser(
  input: UserInput
) {
  try {
    return await UserModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function validatePassword(
  {email, password}: 
  {email: string, password: string}
) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    logger.info(`failed to find user with the email ${email}`);
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    logger.info(`password does not match`);
    return false;
  }

  return omit(user.toJSON<typeof user>(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}