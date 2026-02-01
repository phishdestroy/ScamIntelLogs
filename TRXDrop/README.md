<div align="center">
  <img src="https://i.ibb.co/9kL9fZyx/TRXDrop-Screenshot-1.png" alt="TRXDrop" width="600">

  # TRXDrop — TRON/Solana Wallet Drainer Panel

  **Angel Drainer reseller with fake TRX airdrop pages**

  [![Status](https://img.shields.io/badge/Status-ACTIVE-red?style=for-the-badge)]()
  [![Type](https://img.shields.io/badge/Type-Wallet_Drainer-critical?style=for-the-badge)]()
  [![Quality](https://img.shields.io/badge/Quality-Low_Reseller-yellow?style=for-the-badge)]()
</div>

---

## Overview

**TRXDrop** is a TRON/Solana wallet drainer panel, operating as an Angel Drainer reseller. Deploys fake TRX airdrop pages that drain TRX + USDT via a spoofed Trust Wallet interface with a forced signing loop (50 retries).

**AI-generated code** (likely Claude/GPT-4): boilerplate React CRA, 30+ debug logs in production, placeholder comments. Panel built fast, not built well.

## Scam-the-Scammer Warning

30 TRX auto-commission per drain, worker private keys stored server-side, all transactions built on operator's server — **can redirect funds anytime**. This panel likely steals from its own affiliates.

## Scam Flow

1. Victim lands on fake TRX airdrop page
2. Page loads anti-debug protections + encrypted config
3. Victim clicks Connect Wallet — sees spoofed Trust Wallet modal
4. Wallet connection routed through WalletConnect or deeplinks
5. Backend builds malicious transactions via `/api/buildTransactions`
6. Victim sees fake "Receive 10,000 TRX ($2,200)" message
7. Victim signs transaction (up to 50 forced retries)
8. Signed tx sent to backend via `/api/sendTransaction`
9. TRX + USDT drained from wallet (min $10 / 5 TRX)
10. 30 TRX auto-commission sent to operator
11. Telegram notification to operator

## Infrastructure

| Component | Details |
|-----------|---------|
| Panel Domain | trxdrop.live |
| Backend Domain | trump-drop.world |
| Tech Stack | React (CRA) + Express, JWT HS256 |
| Encryption | XOR cipher with key `TRX_SECURE_2024_PANEL_KEY` |
| WalletConnect | Project ID: fbf5b42d6feed07049dd9e59d888645a |
| CIS Blocking | RU, UA, BY, KZ |
| Drainer Variant | Angel Drainer (level 2 access claimed) |

## Operator

| Handle | Details |
|--------|---------|
| [@STNlRAWbIaFLiH](https://t.me/STNlRAWbIaFLiH) | Panel support/operator (ID: 6823931109, reg. ~Dec 2023) |
| @coronasrobot | Worker contact (Telegram bot) |

## Anti-Analysis

| Technique | Assessment |
|-----------|-----------|
| Debugger traps | Continuous checks every 1s |
| Console hijacking | window.console replaced with empty functions |
| DevTools detection | window.outerWidth check |
| String obfuscation | Array-based tables + XOR + Base64 |
| **Overall** | **Trivial to bypass** |

## Drainer Configuration

| Setting | Value |
|---------|-------|
| Min Balance | $10 USD |
| Drain TRX | Yes (min 5 TRX) |
| Auto Commission | 30 TRX per drain |
| Wait Timeout | 15 seconds |
| Max Funding Attempts | 3 |
| Cooldown | 5 minutes |

## Evidence Files

```
TRXDrop/
├── index.html              # Investigation page
├── iocs.json               # Machine-readable IOCs
├── drainer-tron-core.js    # Core TRX drainer script
├── drainer-loader.js       # Loader with anti-debugging
├── drainer-wallet-modal.js # Fake wallet selection UI
├── panel-config.json       # Panel configuration dump
├── panel-statistics.json   # Statistics dump
└── screenshots/            # Panel screenshots
```

## Related Domains

```
trxdrop.live, trump-drop.world, qlabtrondemo.shop, testoviq.cfd,
aml-scan-wallet.com, qqdemtron.lol, v1-4check.digital,
photon-tiniyastro.icu, tronsscan.net, amltronchecker.com,
gasrefund.pro, amlcleanscan.help, one-aml.com, amlscanner.help,
stakeplus.icu
```

## Wallets

```
TRAGn9E6hbTiQrYG5V4sk1gNv3JaWHSxak
```

## Browse Evidence

- [Investigation Page](https://phishdestroy.github.io/ScamIntelLogs/TRXDrop/)
- [IOCs (JSON)](https://github.com/phishdestroy/ScamIntelLogs/blob/main/TRXDrop/iocs.json)
- [Drainer Core Script](https://github.com/phishdestroy/ScamIntelLogs/blob/main/TRXDrop/drainer-tron-core.js)
- [Loader Script](https://github.com/phishdestroy/ScamIntelLogs/blob/main/TRXDrop/drainer-loader.js)
- [Wallet Modal Script](https://github.com/phishdestroy/ScamIntelLogs/blob/main/TRXDrop/drainer-wallet-modal.js)
- [Panel Screenshots](https://github.com/phishdestroy/ScamIntelLogs/tree/main/TRXDrop/screenshots)

---

*Collected: 2026-01-31 | [PhishDestroy](https://github.com/phishdestroy) Threat Intelligence*
