# NiceCrypto Drainer - Threat Intelligence Package

## Overview

NiceCrypto is a cryptocurrency wallet drainer service targeting TRON network. Operates as affiliate program offering up to 80% revenue share to partners. Launched December 2025, actively developed through January 2026.

## Scam Method

1. Victim visits phishing landing page (fake AML check, airdrop, etc.)
2. Modal window prompts wallet connection via WalletConnect or direct
3. User signs malicious approval transaction
4. Drainer monitors wallet for incoming funds
5. Auto-withdraws when balance exceeds configured threshold
6. Affiliate receives 80% cut, operators keep 20%

## IOCs

### Telegram Infrastructure
| Type | Identifier |
|------|------------|
| Setup Bot | @NCsetup_bot |
| Support | @NiceCrypto_Support |
| Chat | https://t.me/+nwjXjH4qPNhmYWRk |
| Info RUS | Channel ID: 3522562902 |
| Info ENG | Channel ID: 3605815564 |
| Payments | Channel ID: 3462761505 |

### Web Infrastructure
- Documentation: `wiki.nicecrypto.forum`
- Forum: `wwh2club.to` (thread 290536)

## Package Contents

```
nicecrypto/
├── guide/              # GitBook documentation export
│   ├── index.html      # Main page
│   ├── 1/              # Bot settings guide
│   └── 2/              # Manuals section
├── NC Info ENG/        # English info channel export
│   ├── result.json     # Messages data
│   ├── messages.html   # HTML export
│   └── photos/         # 5 images
├── NC Info RUS/        # Russian info channel export
│   ├── result.json     # Messages data
│   ├── messages.html   # HTML export
│   └── photos/         # 8 images
├── NC Payments/        # Payment proofs channel
│   ├── result.json     # Messages data
│   └── photos/         # 6 payment screenshots
├── NC Designs/         # Landing page designs
│   ├── result.json     # Messages data
│   └── photos/         # 13 design screenshots
├── iocs.json           # Structured IOCs
├── README.md           # This file
└── index.html          # Evidence browser
```

## Timeline

- **2025-12-22**: Channels created
- **2025-12-28**: Renamed to "NC Info | ENG"
- **2026-01-04**: GitBook docs published, first designs
- **2026-01-07**: Forum topic on WWH
- **2026-01-08-28**: Active payments to affiliates

## Landing Pages (from NC Designs)

| ID | Theme |
|----|-------|
| ByBitAML | Bybit AML Verification |
| Various | Additional templates in photos |

## Technical Details

- TRON network focus (SOL, EVM, TON planned)
- WalletConnect protocol abuse
- Customizable modal windows
- Real-time balance monitoring
- Automated withdrawal system

## Evidence Files

- 32 photos across channels
- 4 Telegram channel exports
- Complete GitBook documentation
- Payment proof screenshots

---
*Collected: 2026-01-31 | PhishDestroy Threat Intelligence*
