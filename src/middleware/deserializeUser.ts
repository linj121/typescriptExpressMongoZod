import { get } from "lodash";
import type { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  console.log(`[deserializeUser] got accessToken ${accessToken}`);

  const refreshToken = get(req, "headers.x-refresh");
  console.log(`[deserializeUser] got refreshToken ${refreshToken}`);
  // const refreshToken = req.headers["x-refresh"];

  if (!accessToken) {
    return next()
  }

  const { decoded, expired } = verifyJwt(accessToken);
  console.log(`[deserializeUser] got decoded: ${JSON.stringify(decoded)}`);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  console.log(`[deserializeUser] expired ${expired} type ${typeof refreshToken}`);
  if (expired && refreshToken && typeof refreshToken === "string") {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    console.log(`[deserializeUser] newAccessToken ${newAccessToken}`);
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    if (typeof newAccessToken === "string") {
      const result = verifyJwt(newAccessToken);
      res.locals.user = result.decoded;
      console.log(`[deserializeUser] newAccessToken verification result: ${JSON.stringify(result)}`);
      return next();
    }
  }

  return next();
}

export default deserializeUser;