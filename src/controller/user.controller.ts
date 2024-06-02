import type { Request, Response } from "express";
import logger from "../utils/logger";
import { omit } from "lodash";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>, 
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error: any) {
    logger.error(error);
    /**
     * 409 Conflict: an user with that email has been registered
     */
    return res.status(409).send(error.message);
  }
}
