module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/test/transformer.js"
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.cache/"],
  setupTestFrameworkScriptFile: "<rootDir>test/jest-setup.js",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleFileExtensions: ["jsx", "js"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.js"
  },
  collectCoverage: true,
  coverageReporters: ["lcov", "text", "html"]
};
