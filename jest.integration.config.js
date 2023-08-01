/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/integration-tests/**/*.test.(ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/integration-tests/setup.ts"],
};
