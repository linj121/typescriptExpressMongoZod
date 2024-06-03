import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import createServer from "../utils/server";
import mongoose from "mongoose";
import supertest from "supertest";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe"
}

export const userInput = {
  email: "jane.doe@example.com",
  name: "Jane Doe",
  password: "Password123",
  passwordConfirmation: "Password123"
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe("user", () => {
  describe("user registration", () => {

    describe("given the user name and password are valid", () => {
      it("should return the user payload", async () => {
        /**
         * https://medium.com/javascript-journal-unlocking-project-potential/jest-fn-vs-jest-spyon-understanding-the-differences-for-effective-testing-0f5928f7a411
         * This is a mock `createUser` service that will return `userPayload` when getting called
         */
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(userInput);
          
        expect(statusCode).toBe(200);
        expect(body).toStrictEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given the passwords do not match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send({...userInput, passwordConfirmation: "114514"});

        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given the user service throws", () => {
      it("should return a 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          .mockRejectedValue("oh no :(");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe("create user session", () => {

    describe("given the username and password are valid", () => {
      it("should return a signed accessToken and refreshToken", async () => {

        /**
         * without super test
         */
        jest.spyOn(UserService, "validatePassword")
          // @ts-ignore
          .mockReturnValue(userPayload);

        jest.spyOn(SessionService, "createSession")
          // @ts-ignore
          .mockReturnValue(sessionPayload);
        
        const req = {
          get: () => "Mock User Agent",
          body: {
            email: "jane.doe@example.com",
            password: "Password123",
          }
        }

        const send = jest.fn();

        const res = {
          send
        };
        
        // @ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String), 
          refreshToken: expect.any(String)
        });

      });
    });

  });
});