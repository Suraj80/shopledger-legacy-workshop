# Repository Guidelines

## Stack

This repository uses Node.js with Express 4 and body-parser for the server, plain HTML/CSS/browser JavaScript for the UI, and a JSON file (`data/db.json`) for persistence. Dependencies are declared in `package.json` and locked in `package-lock.json`.

## Module Map

- `server.js` serves `public/`, mounts API routes, and serves printable invoices.
- `routes/` contains the products, orders, customers, and reports endpoints.
- `lib/` contains order, inventory, pricing, tax, coupon, ledger, invoice, report, date, and JSON-store logic.
- `public/` contains the app page, browser code, and styles.
- `config.js` contains shop, tax, inventory, and coupon settings.
- `data/db.json` contains the app's stored records.

## Commands

- `npm start` starts the server using `node server.js` (port 3000 unless `PORT` is set).
- `npm test` currently prints “no test specified” and exits with an error; no test suite is configured.

## Change and Test Rules

- Before changing behavior, write characterization tests that capture the current behavior relevant to the ticket.
- Change only the module the ticket is about. Avoid unrelated cleanup or edits elsewhere.
- Tests must never read from or write to `data/db.json`; use isolated test data instead.
- Do not add dependencies.
