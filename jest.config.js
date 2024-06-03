/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "/home/josh/playground/REST-API-Tutorial-Updated",
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  /**
   * report test during the run
   */
  verbose: true,
  /**
   * exit event there is pending handlers
   */
  forceExit: true,
  /**
   * clear mocks (eg. functions) between tests,
   * so that the number of times getting called of each mock
   * is isolated and not accumulated and affecting each other
   */
  clearMocks: true,
  /**
   * ?
   */
  resetMocks: true,
  /**
   * ?
   */
  restoreMocks: true,
};