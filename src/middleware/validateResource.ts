import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

/**
 * Currying / Closure
 * so that we can pass a function with valid signature for express router callback
 */
const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
};

export default validate;
