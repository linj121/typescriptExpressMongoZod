import 'dotenv/config';

export default {
  port: 1337,
  dbUri: "mongodb://localhost:27017/rest-api-tutorial",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,
};
