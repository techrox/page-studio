# Security policy

Thanks for helping keep Page Studio and its users safe.

## Supported versions

Page Studio ships as four coordinated packages under `@techrox/page-studio*`.
Security fixes land on the latest published minor of each package. Older
minors are not backported — upgrade to the current release to stay covered.

## Reporting a vulnerability

Please report security issues privately. **Do not open a public issue or
pull request** for anything security-sensitive.

Email **security@sdev.in** with:

- A short description of the issue and the impact you expect.
- The package and version (`@techrox/page-studio-blocks@x.y.z`, etc.).
- Steps to reproduce — a minimal repro or proof of concept helps a lot.
- Any suggested fix, if you have one.

You'll get an acknowledgement within **3 business days**. We'll keep you
posted as we confirm the issue, work a fix, and prepare a release. Once a
fix is out, we're happy to credit you in the release notes — let us know
if you'd prefer to stay anonymous.

## Scope

In scope: the four published packages and the editor → renderer data path
(saved Puck JSON, the SSR-safe renderer, host-context primitives).

Out of scope: vulnerabilities in upstream dependencies (Puck, Ant Design,
React, TipTap) — report those to their maintainers. The `examples/showcase`
app is a demo tour, not a production surface; please flag issues there only
if they reveal a problem in the packages themselves.
