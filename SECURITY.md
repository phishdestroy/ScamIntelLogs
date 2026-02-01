# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in our tools (checker, scanner scripts, worker.js), please report it responsibly:

- **Email:** security@phishdestroy.io
- **Telegram:** [@PhishDestroy_bot](https://t.me/PhishDestroy_bot)
- **GitHub:** Open a [security advisory](https://github.com/phishdestroy/ScamIntelLogs/security/advisories/new)

We will respond within 48 hours and work with you to resolve the issue.

## Scope

### In Scope
- Vulnerabilities in detection scripts (`keitaro_hunter_4.py`, `checker.html`)
- Security issues in `worker.js` (Cloudflare Worker proxy)
- XSS, injection, or data exposure in `index.html` pages
- Authentication/authorization bypasses in any tool

### Out of Scope
- Intelligence data accuracy (this is archived evidence, not live data)
- Social engineering of PhishDestroy team members
- Denial of service attacks
- Issues in third-party services we link to

## Responsible Disclosure

- Do **not** publicly disclose vulnerabilities before we've had a chance to fix them
- Do **not** access, modify, or delete data beyond what's necessary to demonstrate the vulnerability
- We do **not** pursue legal action against researchers acting in good faith

## Data Handling

This repository contains sensitive intelligence data. If you find:

- **Unredacted victim PII** that should be removed → open an issue or contact us
- **Active infrastructure** that poses immediate danger → contact us immediately via Telegram
- **Your own data** included without consent → contact us for removal

## Supported Versions

| Component | Version | Supported |
|-----------|---------|-----------|
| Keitaro Checker | Latest | Yes |
| Keitaro Hunter (Python) | v4.x | Yes |
| Worker.js | Latest | Yes |
| Index pages | Latest | Yes |
