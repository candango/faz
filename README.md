# Candango Faz

Candango Faz is a Web Components toolkit for incremental modernization of legacy applications.

It provides a small substrate for replacing tangled server-rendered UI fragments with reusable custom elements. A common target is an existing PHP or server-rendered application where markup, conditionals, Bootstrap classes, and imperative JavaScript are mixed together. Faz lets teams replace those fragments gradually with focused HTML tags instead of stopping the business for a full rewrite.

## Purpose

Faz is designed for progressive migration:

1. Find a painful legacy UI fragment.
2. Extract its behavior and presentation into a Faz component.
3. Replace the legacy fragment with a custom element tag.
4. Keep the surrounding application running.
5. Repeat safely, one UI island at a time.

The project is intentionally HTML-first. Components should be easy to consume from plain HTML, server-rendered templates, and older Bootstrap-based pages.

## Installation

```bash
npm i faz
```

```bash
pnpm add faz
```

## Package entrypoints

The package exposes built ESM and declaration artifacts through the package export map:

```ts
import {
  FazElement,
  FazFormElement,
  FazPaginator,
  bindReactive,
  randomId,
  toBoolean,
} from "faz";
```

Additional public entrypoints:

```ts
import { bindReactive } from "faz/reactivity";
import { FazPaginator } from "faz/paginator";
```

The `faz/src` entrypoint is still published for compatibility with existing Faz-based packages, but consumers should prefer the built package entrypoints whenever possible.

## Development

This project uses pnpm.

Install dependencies:

```bash
pnpm install
```

Run the full build:

```bash
pnpm run build
```

Run tests:

```bash
pnpm test
```

Run development stylesheet compilation:

```bash
pnpm run lessc:dev
```

Run the showcase watcher:

```bash
pnpm run showcase
```

## Build and distribution

The build generates:

- `dist/js/*` bundled ESM artifacts;
- `dist/types/*` TypeScript declarations;
- `dist/css/*` compiled stylesheets.

The package entrypoint is `dist/js/index.js`, and the public type entrypoint is `dist/types/index.d.ts`.

Before publishing or testing downstream consumers, run:

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm test
pnpm pack
```

## License

Candango Faz was licensed under Apache-2.0 from 2018 to 2025.

Since 2026 it is licensed under the MIT License.
