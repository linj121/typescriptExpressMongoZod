import deserializeUser from "../middleware/deserializeUser";
import express from "express";
import routes from "../routes";
import type { Express, Request, Response } from "express";
import { restResponseTimeHistogram } from "../utils/metrics";
import responseTime from "response-time";

function createServer() {
  const app: Express = express();

  app.use(express.json());

  app.use(deserializeUser);

  app.use(
    responseTime((req: Request, res: Response, time: number) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        );
      }
    })
  );

  routes(app);

  return app;
}

export default createServer;