# Domain Analysis Tool

A TypeScript library and demo web application for analyzing domains for potential security vulnerabilities, specifically focused on dangling domain takeover risks.

## Features

- Domain vulnerability analysis
- FQDN (Fully Qualified Domain Name) checking
- Heuristic analysis for potential security issues
- Web interface for scanning domains
- User management system with domain tracking
- Rate limiting for API endpoints

## Installation

```shell
$ npm install
```

## Run all tests

```shell
$ npm test # Run all tests
$ npx mocha test/parser.test.ts # Run specific test file
```

## Run Webserver Demo with Docker:

```shell
$ docker compose up --build # Start server
$ docker compose down # Stop server
```

The web interface will be available at http://localhost:3000

## Run Webserver Demo manually:

```shell
$ cd demo/webserver/
$ npm install
$ npm run dev
```

## Format code:

```shell
$ npm install prettier --global # Prerequisite

$ npx prettier --check "**/*.{js,ts}" # Check code formatting
$ npx prettier --write . # Fix formatting for all files
$ npx prettier --write src/**/*.js # Fix formatting for specific file
```

## Project Structure

```
src/                      # Core library code
├── parsertld.ts          # Domain parsing utilities
├── heuristic_analysis.ts # Domain vulnerability detection
├── fqdm_analysis.ts      # FQDN analysis
└── fingerprints.json     # Vulnerability patterns database

demo/                     # Demo webserver application
└── webserver/            # Express.js web server
  └── src/
      ├── index.ts        # Main server code
      ├── database.ts     # SQLite database handler
      └── public/         # Static web assets

test/                     # Test files
├── parser.test.ts        # Parser unit tests
├── heuristic_analysis.test.ts # Analysis tests
└── fqdm_analysis.test.ts # FQDN tests
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
