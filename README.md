# chip8ts

A [CHIP-8](https://en.wikipedia.org/wiki/CHIP-8) emulator wrriten in TypeScript. I've attempted to make it simple to understand by separating logical components of the CHIP-8 device into separate software components.

Currently only running the display in a web browser is supported.

## Developement
Before doing anything, you will need to run `yarn install`.

### Running Tests
Run `yarn tsc` to run TypeScript type-checking.

Run `yarn lint` to run linting.

Run `yarn test` to run unit tests.

Run `yarn prerelease` to run TypeScript type-checking, unit tests, and linting.

### Building
Run `yarn start` to start the development server.

Run `yarn buid` to bundle the code.