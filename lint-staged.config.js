const prettierCmd = "prettier --config ./.prettierrc.js --write";
const eslintCmd = "eslint --ext=jsx,js,ts,tsx --fix src";

module.exports = {
    "src/**/*.{json,css,scss,md}": [prettierCmd],
    "src/**/*.{js,jsx,ts,tsx}": [prettierCmd, eslintCmd],
};
