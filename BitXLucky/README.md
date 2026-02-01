<div align="center">
  <img src="https://i.ibb.co/SDWLdPdm/Bit-XLucky-horwex-front.png" alt="BitXLucky" width="600">

  # BitXLucky — Scam Casino Panel

  **Lowest-quality fake casino & sportsbook panel**

  [![Status](https://img.shields.io/badge/Status-ACTIVE-red?style=for-the-badge)]()
  [![Type](https://img.shields.io/badge/Type-Fake_Casino-purple?style=for-the-badge)]()
</div>

---

## Overview

**BitXLucky** is a low-quality scam casino & sportsbook panel. Typos everywhere in the admin interface: "saport", "Logi", "Postsuk", "Warkers". Russian mixed with English throughout the codebase.

## Steals From Workers

We registered a victim via worker promo code — **registration never appeared in panel (Users: 0)**. The platform steals traffers' (affiliates') registrations, routing all stolen funds to the operator.

## Panel Configuration

| Setting | Value |
|---------|-------|
| Worker Payout | 70% |
| Commission | 1% |
| Min Deposit | 100 USDT |
| Auto KYC | 30s delay |
| Withdrawal | "Flagged as high-risk, make confirmation deposit" |

## Infrastructure

| Component | Details |
|-----------|---------|
| Panel Domains | bitxlucky.com, bitxlucky.vip |
| Tech Stack | Next.js (Turbopack) + NestJS |
| Auth | JWT HS256 |
| CDN | Cloudflare |
| Monitoring | Sentry |
| IPs | 77.110.103.90, 176.46.152.13:3000, 77.221.151.196 |

## Evidence Files

```
BitXLucky/
├── iocs.json                           # Machine-readable IOCs
├── index.html                          # Investigation page
├── d0a382000d_202601311006.csv         # Extracted data
├── user-6684395748-messages.html       # Operator messages
└── user-6684395748-groups.json         # Operator groups
```

## IOCs

- **Domains:** bitxlucky.com, bitxlucky.vip
- **IPs:** 77.110.103.90, 176.46.152.13:3000, 77.221.151.196
- **User ID:** 6684395748

## Browse Evidence

- [Investigation Page](https://phishdestroy.github.io/ScamIntelLogs/BitXLucky/)
- [IOCs (JSON)](https://github.com/phishdestroy/ScamIntelLogs/blob/main/BitXLucky/iocs.json)
- [Screenshots](https://github.com/phishdestroy/ScamIntelLogs/tree/main/BitXLucky/screen)

---

*Collected by [PhishDestroy](https://github.com/phishdestroy) | January 2026*
