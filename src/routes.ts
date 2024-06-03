import type { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import { 
  createUserSessionHandler, 
  getUserSessionsHandler,
  deleteSessionHandler
} from "./controller/session.controller";
import {
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler
} from "./controller/product.controller"
import validateResource from "./middleware/validateResource";
import requireUser from "./middleware/requireUser";
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
import {
  getProductSchema, 
  createProductSchema,
  updateProductSchema,
  deleteProductSchema
} from "./schema/product.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  /**
   * create new user with email and password
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  
  /**
   * user session management: register new session, get session by user, delete current session
   * session ids are contained in JWT and will be sent in Auth Bearer
   */
  app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHandler);

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  /**
   * products CRUD
   */
  app.get("/api/products/:productId", validateResource(getProductSchema), getProductHandler);

  app.post("/api/products", [requireUser, validateResource(createProductSchema)], createProductHandler);

  app.put("/api/products/:productId", [requireUser, validateResource(updateProductSchema)], updateProductHandler);

  app.delete("/api/products/:productId", [requireUser, validateResource(deleteProductSchema)], deleteProductHandler);
}

export default routes;
