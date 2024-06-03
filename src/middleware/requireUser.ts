import type { NextFunction, Request, Response } from "express";

/**
 * Check if user is authorized by checking 
 * whether user payload is decoded into `res.locals.user` by deserializer
 * @param req 
 * @param res 
 * @param next 
 * @returns 403 Unauthorized if `res.locals.user` is not presented
 */
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  next();
}

export default requireUser;