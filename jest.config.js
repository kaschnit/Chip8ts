const baseConfig = require("./jest.config.base.js");

module.exports = {
    ...baseConfig,
    coverageDirectory: "<rootDir>/coverage/",
};
