# Olympus Panel - Crypto Casino Scam Infrastructure

## Overview

**Panel Name:** Olympus (branded as "Syndicate Casino")  
**Type:** Crypto gambling phishing/scam panel  
**Status:** 🔴 ACTIVE  
**Discovery Date:** January 2026  
**Domains:** 16 confirmed  

## Scam Method

1. Victims receive promo codes via Telegram groups (@olympus_invite_bot)
2. Register on fake "Syndicate Casino" sites with "free bonus"
3. Fake "winnings" displayed to build trust
4. "Verification deposit" of $50+ required to withdraw
5. Funds stolen, withdrawal never processed

**Fake verification message used:**
> "A simplified online verification procedure that requires you to make a deposit of %sum_verif% or more. Once the deposit is credited to your balance, verification will be completed."

## Infrastructure

| Component | Domain |
|-----------|--------|
| Admin Panel | olympus-panel.cc |
| API Backend | olympus-api.com |
| CDN | Cloudflare |

### Technical Stack
- **Framework:** Laravel + Livewire v3
- **Frontend:** Hyper Admin Dashboard Theme
- **Database:** MySQL
- **Nameservers:** plato/violet.ns.cloudflare.com

## Panel Configuration

| Setting | Value |
|---------|-------|
| Minimum Deposit | $50 |
| Minimum Withdraw | $100 |
| Worker Share | 70% |
| Chat Bot Name | Alice |
| Super Account Keyword | olympus |
| Auto KYC | After 5 deposits |


## Phishing Domains

```
olympus-panel.cc
olympus-panel.io
olympus-panel.com
olympus-api.com
olympus-pane.com
olympus-invite.com
olympys.free
gambler-partners.is
inclusivebets.com
inclusivebets.fun
rioroyal.sbs
mantrasafe.com
cdsfeedwdrvjfv.com
plinkozaw.com
pipo4kapapki.ru
test-api.com
```

## Telegram

| Handle | Purpose |
|--------|---------|
| @olympus_invite_bot | Invitation bot |
| @olympus_owner | Panel owner contact |
| @olympus_panel_bot | Notifications bot |
| Olympus Panel [Info]🎰 | Info group (ID: 3649385731) |

## Files

### Root
| File | Description |
|------|-------------|
| index.html | Visual report page |
| domains.txt | All phishing domains |
| iocs.json | Machine-readable IOCs |
| README.md | This file |

### /panel/ - Admin Panel Dumps
| File | Description |
|------|-------------|
| dashboard.html | Statistics overview |
| users.html | Victim management |
| deposits.html | Stolen funds tracking |
| payouts.html | Worker payments |
| domains.html | Phishing sites config |
| promos.html | Scam promo codes |
| settings.html | Panel configuration |
| chat.html | Victim live chat |
| logs.html | Activity logging |
| config.json | Extracted settings |

### /chat/ - Telegram Group Export
| File | Description |
|------|-------------|
| messages.html | Visual chat export |
| result.json | Raw JSON data |
| /photos/ | Shared images |
| /video_files/ | Shared videos |

## Recommendations

### For Blocklists
Add all domains to community blocklists and browser safe browsing.

### For Abuse Reports
- Cloudflare (nameservers)
- Domain registrars for each TLD
- Telegram (report @olympus_invite_bot, @olympus_owner)

---

**Collected by [PhishDestroy](https://github.com/phishdestroy) | January 2026**

*This intelligence is provided for defensive purposes only.*
