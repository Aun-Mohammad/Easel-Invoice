# Easel Invoice Maker

Standalone invoice and quotation generator for Easel Outdoor, extracted from the
Vectors n' Scalars admin panel so edits to one never risk the other again.

## What this is

A single-page Next.js app. No login, no database — it generates a PDF client-side
with jsPDF and nothing is saved server-side. Matches how the tool already behaved
inside the old admin panel (the save/load-to-database feature was present in code
but never actually reachable for Easel invoices, so it was dropped entirely here).

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
npm start
```

## Editing business details

Company name, address, phone, terms and conditions all live in
`src/lib/invoiceConstants.js`. The logo is `public/easel.png`.
