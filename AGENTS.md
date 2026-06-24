# AGENTS.md

## Project Identity

Candango Faz is a Web Components toolkit for incremental modernization of legacy applications.

This repository is not primarily an application. It is a substrate for building reusable custom elements that can be embedded into existing systems, including legacy PHP applications, server-rendered pages, and mixed frontend stacks.

The strategic goal is to let teams replace tangled combinations of business logic, control flow, markup, Bootstrap classes, and imperative JavaScript with focused HTML tags that encapsulate UI behavior and presentation.

## Core Mission

Faz exists to support gradual migration, not big-bang rewrites.

A typical target environment may contain legacy PHP templates with conditionals, echoes, inline markup, duplicated Bootstrap snippets, and procedural JavaScript. Faz should make it possible to replace those fragments incrementally with reusable custom elements, one screen or one UI island at a time.

The intended migration pattern is:

1. Identify a painful legacy UI fragment.
2. Extract the behavior and presentation into a Faz component.
3. Replace the legacy fragment with a single custom element tag.
4. Keep the surrounding legacy system running.
5. Repeat until the system becomes easier to maintain.

This avoids the common failure mode where a team disappears for months attempting a full rewrite and returns with an incomplete proof of concept while the legacy system remains unchanged.

## Architectural Implications

Agents working in this repository must preserve the following priorities:

- **HTML-first integration:** Components must be easy to consume from plain HTML and server-rendered templates.
- **Attribute-driven APIs:** Public component APIs should work naturally through HTML attributes and properties.
- **Legacy compatibility:** Do not assume a clean SPA environment. Components may be mounted inside old pages with existing CSS and JavaScript.
- **Incremental adoption:** Changes should support partial replacement of legacy UI, not require full application rewrites.
- **Reusable UI islands:** Components should encapsulate behavior, state, and presentation cleanly enough to be reused across legacy screens.
- **Bootstrap-aware presentation:** Faz builds on Bootstrap conventions and should cooperate with Bootstrap-based layouts.
- **Small blast radius:** Prefer changes that can be adopted component-by-component without forcing consumers to reorganize their whole frontend.

## Development Guidance

When designing or changing APIs, ask:

- Can this be used from a legacy PHP template with a simple tag?
- Does the component expose enough behavior through attributes/properties?
- Does this require consumers to adopt a full frontend runtime architecture?
- Can this replace a small legacy fragment without rewriting the whole page?
- Will this behave predictably when embedded into an existing Bootstrap page?

Avoid designs that only make sense in a modern greenfield SPA.

## Release Smoke Testing with Local Tarballs

Before publishing a new Faz version to npm, validate the exact package artifact that would be published.

Recommended flow:

1. Build and pack Faz locally:

   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   pnpm test
   npm pack
   ```

2. Install the generated tarball in a downstream consumer such as `faz-bootstrap`.

   For Yarn 4 consumers, prefer the explicit `file:` protocol:

   ```bash
   yarn add faz@file:/home/fpiraz/source/candango/faz/faz-0.6.1.tgz
   ```

   Alternatively, edit the consumer dependency temporarily:

   ```json
   "faz": "file:/home/fpiraz/source/candango/faz/faz-0.6.1.tgz"
   ```

3. Run the consumer validation:

   ```bash
   yarn install
   yarn build
   ```

4. Validate browser behavior, not only TypeScript/build output.

Tarball smoke checklist:

- The tarball `package.json` contains the intended version.
- `dist/js/index.js` does not bundle shared runtimes such as `solid-js`; it should preserve imports for consumer resolution.
- Every declared public export has matching generated JavaScript and type files.
- Imports from the public package root, such as `from "faz"`, work in the consumer.
- Runtime browser interactions, including click/reactivity behavior, still work.

This validates the packed artifact before npm publication. It does not validate npm registry metadata or registry installation behavior. After publishing, repeat the downstream smoke using the published version, for example:

```bash
yarn add faz@0.6.1
```

Do not commit generated `.tgz` files unless there is an explicit release-artifact policy requiring it.

## Security and Build Hardening TODOs

The current build and CI setup needs supply-chain hardening before release automation becomes trusted.

TODO:

- Keep the pnpm install flow reproducible.
  - GitHub Actions and Travis CI should use the committed `pnpm-lock.yaml` with `pnpm install --frozen-lockfile`.
  - Do not reintroduce mutable install scripts that delete and regenerate lockfiles during CI.
- Add explicit least-privilege permissions to GitHub Actions.
  - The test workflow should start with `permissions: contents: read` unless a job needs more.
- Decide whether to pin GitHub Actions by SHA.
  - Current workflow uses tag references such as `actions/checkout@v7`, `actions/setup-node@v6`, and `pnpm/action-setup@v6`.
  - Pinning by SHA reduces tag-compromise risk.
- Decide whether Travis CI is still required.
  - `.travis.yml` is modernized for pnpm and current Node.js versions, but should be removed if Travis is no longer used.
- Decide release sourcemap policy.
  - `build.mjs` currently emits sourcemaps into `dist/js`.
  - Keep them intentionally for open-source/debuggability or disable them for release builds.
- Review bundled legal comment handling.
  - `build.mjs` uses `legalComments: "none"`.
  - Consider `legalComments: "eof"` or another policy that preserves required dependency notices.
- Audit legacy `eval()` usage before exposing related code paths.
  - `input/filterbox.js` contains callback evaluation via `eval(...)`.
  - If that code is still reachable, replace it with an explicit callback registry or allowlist.

## Working Definition

Candango Faz is a toolkit for replacing legacy UI fragments with reusable Web Components, enabling progressive modernization without stopping the business for a rewrite.
