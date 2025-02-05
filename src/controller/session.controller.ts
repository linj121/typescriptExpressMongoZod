import type { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  /** 
   * Validate user password
   */
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send("invalid email or password");

  /**
   * Create a session
   */
  const session = await createSession(user._id, req.get("user-agent") || "");

  /**
   * Create an access token
   */
  const accessToken = signJwt(    
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("accessTokenTtl") // 15 minutes
    }
  );

  /**
   * Create a refresh token
   */
  const refreshToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("refreshTokenTtl") // 1 year
    }
  );

  /**
   * Return access + refresh tokens
   */
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user?._id;
  console.log(`[session.controller] got userId ${userId}`);

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null
  })
}