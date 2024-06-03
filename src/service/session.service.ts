import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { verifyJwt } from "../utils/jwt.utils";
import { findUser } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON<typeof session>();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>, 
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken(
  { refreshToken }:
  { refreshToken: string}
): Promise<false | string> {
  const { decoded } = verifyJwt(refreshToken);
  
  if (!decoded || !get(decoded, "session")) {
    console.log(`[session.service] decoded or decoded.session not exist ${JSON.stringify(decoded)}`);
    return false;
  }
  console.log(`[session.service] decoded: ${JSON.stringify(decoded)}`);
  console.log(`[session.service] decoded.session: ${get(decoded, "session")}`);
  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) {
    console.log(`[session.service] session not exists or session invalid`);
    console.log(`[session.service] session: ${JSON.stringify(session)}`);
    return false;
  }
  const user = await findUser({ _id: session.user });

  if (!user) {
    console.log(`[session.service] user not exists`);
    return false;
  }
  const accessToken = signJwt(    
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("refreshTokenTtl") // 1yr
    }
  );

  return accessToken;
}