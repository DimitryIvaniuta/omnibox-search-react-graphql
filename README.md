# Omnibox Search (React + GraphQL)

A production‑grade **React 19 + TypeScript + Vite** SPA implementing a debounced, grouped **Omnibox** search and CRUD UIs for **Contacts, Listings, Transactions**. It uses **Apollo Client (@apollo/client v3)** with generated typed hooks, **GraphQL Code Generator**, and a reusable **SmartTable** with sticky header, range‑select (Shift+click), and persistent selection.

---

## Features

* **Pinned header** with debounced Omnibox search (200–300 ms), cancelation of in‑flight requests, keyboard-friendly UX, and click‑outside to close.
* **Left sidebar** with Contacts / Listings / Transactions.
* **Center grid** per module using `SmartTable` (sticky toolbar + header, compact rows, checkbox selection, Shift-range selection, keyboard a11y, responsive column sizing).
* **Fullscreen editors** (create/edit) with a consistent app shell and back navigation.
* **PriceField** money input: locale grouping, 0–2 fraction digits, caret‑safe formatting, RHF‑controlled; server uses `Money(BigDecimal)`.
* **Action notifications** (top‑right toasts) for CRUD success.
* **GraphQL Codegen** with **client preset** + **typescript‑react‑apollo** to generate typed documents & hooks for **Apollo v3**.
* **Strict TypeScript** config tuned for Vite + React 19.

---

## Tech Stack

* **React 19.2**, **TypeScript 5.9**, **Vite 7**
* **@apollo/client ~3.14** (React hooks API), **graphql 16**
* **graphql-code-generator 6** (`client-preset` + `typescript`, `typescript-operations`, `typescript-react-apollo`)
* **react-hook-form** for forms and field composition (e.g., `PriceField`)
* **Bootstrap 5** (+ Icons) and local SCSS overrides

---

## Backend Contracts

* **Omnibox**: `POST http://localhost:8080/graphql`
* **Write OLTP**: `POST http://localhost:8081/graphql`
* **Headers (both)**: `Content-Type: application/json`, `X-Tenant: demo-tenant`

**Omnibox query**

```graphql
query Omnibox($q: String!, $limitPerGroup: Int = 5) {
  omnibox(q: $q, limitPerGroup: $limitPerGroup) {
    contacts { id title subtitle score contactId }
    listings { id title subtitle score listingId mlsId }
    referrals { id title subtitle score referralId }
    transactions { id title subtitle score transactionId }
    products { id title subtitle score productId }
    mailings { id title subtitle score mailingId }
  }
}
```

> **UX**: debounce input 200–300 ms; cancel previous request on change; render grouped results; hide empty groups; show subtle score bar (0..1).

---

## Getting Started

### 1) Prerequisites

* Node 20+
* **pnpm** 9+ (`npm i -g pnpm`)
* Running backend services (see **Backend Contracts**) with schema available at the URLs.

### 2) Clone & Install

```bash
pnpm install
```

### 3) Environment

Create `.env.local` (Vite reads `VITE_` vars):

```ini
VITE_TENANT=demo-tenant
VITE_OMNIBOX_URL=http://localhost:8080/graphql
VITE_WRITE_OLTP_URL=http://localhost:8081/graphql
```

### 4) Codegen (typed hooks)

Config file `codegen.yml` is included and resolves envs for both schemas.

```bash
pnpm run codegen
```

This generates:

* `src/generated/omnibox/*` — Omnibox typed docs & hooks
* `src/generated/write-oltp/*` — Write‑side typed docs & hooks

> If you hit **maximum query depth** on remote schema, add `?maxDepth=N` server‑side or switch the loader to **introspection JSON** (see **Troubleshooting**).

### 5) Run Dev Server

```bash
pnpm dev
```

Open `http://localhost:5173`.

### 6) Build & Preview

```bash
pnpm build
pnpm preview
```

---

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "codegen": "graphql-codegen --config codegen.yml"
}
```

---

## Project Structure

```
src/
  components/
    AppShell/
      AppShell.tsx            # Layout (header + sidebar + main)
    Header/
      Header.tsx              # Pinned header with OmniboxSearchBar
      OmniboxSearchBar.tsx    # Debounced omnibox with dropdown, click‑outside
      OmniboxSearchBar.scss
    SmartTable/
      SmartTable.tsx          # Sticky toolbar + header, selection, range select
      SmartTable.scss
    ActionsNotification/
      ActionsNotification.tsx # Top-right toasts provider/hook
    PriceField/
      PriceField.tsx          # RHF-powered money input (caret‑safe formatting)
    pickers/
      ContactPicker.tsx
      ListingPicker.tsx
  pages/
    ContactsPage.tsx
    ContactEditor.tsx
    ListingsPage.tsx
    ListingEditor.tsx
    TransactionsPage.tsx
    TransactionEditor.tsx
  apollo/
    clients.ts                # `omniboxClient`, `writeClient`
  generated/
    omnibox/                  # codegen output (typed docs/hooks)
    write-oltp/
  ops/
    omnibox/omnibox.graphql   # operations feeding codegen
    write-oltp/*.graphql
  styles/
    overrides.scss            # bootstrap overrides (sticky header, scrollbars)
  utils/
    money.ts                  # formatMoney() universal money formatter
App.tsx
main.tsx
```

---

## Key Implementation Notes

### Apollo Clients

* Two separate instances with per‑service base URL and `X-Tenant` header.
* InMemoryCache with reasonable defaults; no auth.

### Codegen

* **client preset** generates `graphql` helper and typed documents.
* **typescript-react-apollo** additionally generates `useXxxQuery/Mutation` hooks targeted for **@apollo/client v3** types (`useQuery`, `QueryResult`, etc.).
* Operations are organized in `src/ops/**` and imported only via generated hooks (no raw `graphql(...)` in app code).

### SmartTable

* Sticky **action toolbar** (Add/Delete) and **header** with a subtle bottom border.
* Virtualization is not required for current volumes; table body scrolls, header stays.
* Range select: click one checkbox, **Shift + click** another to select the interval.
* Selection persistence via `sessionStorage` using a `selectionKey` per grid.

### PriceField

* Controlled by **react-hook-form** via `useController`/`useWatch`.
* Supports pasting, blocks non‑numeric input, enforces up to **2 fraction digits** only after a decimal separator.
* Keeps caret stable while formatting (no blink), never invents decimals.
* Emits `{ amount: string, currency }` to the form; at mutation boundary convert to `Decimal`.

### OmniboxSearchBar

* Debounced `useOmniboxQuery` with `skip: q === ""`.
* Groups: contacts, listings, transactions, etc.; hides empty groups.
* Keyboard nav: ↑/↓ to move, Enter to open, Esc to close.
* Width of dropdown matches input; click‑outside closes.

---

## Usage Examples

### Using a generated query hook

```ts
import { useContactsQuery } from "@/generated/write-oltp/graphql";

const { data, loading, error } = useContactsQuery({ variables: { offset: 0, limit: 50 } });
```

### Submitting money to mutations

```ts
import Decimal from "decimal.js";

await createListing({
  variables: {
    input: {
      title,
      contactId,
      price: {
        amount: new Decimal(form.price.amount),
        currency: form.price.currency,
      },
    },
  },
});
```

### Formatting money in grids

```ts
import { formatMoney } from "@/utils/money";

cell: (r) => formatMoney(r.price, { style: "code" }) // e.g., "45,000 USD"
```

---

## Accessibility

* Landmarks for header/nav/main; skip‑to‑content target on route change.
* Focus management on dialogs/pages; ARIA attributes for menus and toasts.
* High‑contrast focus outlines; keyboard navigation supported in omnibox + tables.

---

## Troubleshooting

### Windows `EPERM: symlink` during `pnpm add`

Run terminal **as Administrator** or set `pnpm config set use-node-version 20` and enable Developer Mode (Windows Settings → For Developers) to allow symlinks for non‑admin shells.

### Codegen: “maximum query depth exceeded”

Your server may cap introspection depth. Solutions:

1. Temporarily relax depth on the server **or**
2. Generate from an **introspection JSON**:

   ```bash
   # 1) export schema
   curl -H "X-Tenant: demo-tenant" -H "Content-Type: application/json" \
     -d '{"query":"{__schema{types{name}}}"}' \
     http://localhost:8080/graphql > schema-omnibox.json
   # 2) point codegen.yml schema to schema-omnibox.json
   ```

### Apollo v3 vs v4 types

This project pins **@apollo/client ~3.14**. Ensure codegen uses `typescript-react-apollo` compatible with v3. If you see missing `useMutation`/`QueryResult` types, remove any v4‑only type imports and re‑generate.

### Sticky header / scrollbar overlaps

`SmartTable.scss` ensures the header covers the table body’s scrollbar; body uses thin scrollbars and the page root hides global scrollbars to avoid gutter gaps.

---

## Conventions

* No raw `fetch` or ad‑hoc GQL strings in components; always use generated hooks.
* Keep operations colocated in `src/ops/**` and fragments reused via codegen.
* Keep components presentational; data loading stays in pages (or feature hooks).

---

## License

MIT (for the frontend code in this repository). Integrations may include third‑party licenses.

---

## Appendix: Useful Endpoints

* **Introspection (Postman)**

    * URL: `http://localhost:8080/graphql`
    * Headers: `Content-Type: application/json`, `X-Tenant: demo-tenant`
    * Body:

      ```json
      { "query": "query { __schema { queryType { name } } }" }
      ```

* **Omnibox dev test**

  ```graphql
  query Omnibox($q:String!, $limitPerGroup:Int=5){
    omnibox(q:$q, limitPerGroup:$limitPerGroup){
      contacts{ id title subtitle score contactId }
      listings{ id title subtitle score listingId mlsId }
      transactions{ id title subtitle score transactionId }
    }
  }
  ```
---

## Contributing

* Keep SQL deterministic and idempotent; prefer explicit index names.
* All new code should include basic unit tests and log timings.
* Avoid leaking counts across tenants; never expose global totals.

---

## License

This project is part of the **search‑platform** stack. License as per repository root (TBD).
