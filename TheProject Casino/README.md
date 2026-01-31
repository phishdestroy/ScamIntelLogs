# OFEDREX / WinSystems - Crypto Casino Scam Panel

**Discovered:** January 2026  
**Status:** 🔴 ACTIVE  
**Type:** Fake Crypto Casino / Investment Scam  
**Panel URL:** `ofedrex.com`  
**Brand:** WinSystems  

---

## 📊 Overview

| Metric | Value |
|--------|-------|
| Phishing Domains | **22** |
| Total Victims | **383** |
| Countries Affected | **30+** |
| First Activity | September 2025 |
| Panel Backend | Laravel PHP |

---

## 🎯 Scam Method

1. Victims receive promo codes via social media/Telegram
2. Register on fake casino sites (spacema.bet, lurexcoin.com, etc.)
3. Fake "winnings" displayed to build trust
4. Required to deposit crypto for "withdrawal verification"
5. Funds stolen, withdrawal never processed

---

## 🌐 Phishing Domains (22)

| Domain | Victims | Status |
|--------|---------|--------|
| spacema.bet | 130 | Active |
| lurexcoin.com | 76 | Active |
| ofedrex.com | 74 | Panel |
| money-king.bet | 20 | Active |
| mogulbet.vip | 15 | Active |
| xwebet.com | 7 | Active |
| axidex.com | 5 | Active |
| sho.mom | 5 | Active |
| bitfirefx.com | 4 | Active |
| infocryptox.com | 4 | Active |
| merbibet.com | 3 | Active |
| greencasino.bet | 2 | Active |
| goldix.bet | 3 | Active |
| bolterex.com | - | Active |
| evbobet.top | - | Active |
| explay.bet | - | Active |
| fortexo.top | - | Active |
| inclusivebets.fun | - | Active |
| luckberry.run | - | Active |
| testpet.icu | - | Test |
| www.casinopro.fit | - | Active |
| www.spacema.bet | - | Alias |

Full list: [domains.txt](domains.txt)

---

## 👥 Victim Statistics

### By Country (Top 10)
| Country | Victims | % |
|---------|---------|---|
| 🇮🇳 India | 77 | 20.1% |
| 🇭🇺 Hungary | 45 | 11.7% |
| 🇵🇱 Poland | 40 | 10.4% |
| 🇷🇴 Romania | 25 | 6.5% |
| 🇺🇸 United States | 24 | 6.3% |
| 🇳🇱 Netherlands | 24 | 6.3% |
| 🇩🇪 Germany | 21 | 5.5% |
| 🇮🇩 Indonesia | 12 | 3.1% |
| 🇫🇮 Finland | 11 | 2.9% |
| 🇫🇷 France | 9 | 2.3% |

### Promo Codes Used
| Code | Users | Likely Source |
|------|-------|---------------|
| DREAM | 115 | Social media campaign |
| LRX774 | 61 | Telegram promotion |
| SEAL | 9 | Unknown |
| NEW26 | 8 | Unknown |
| BEP201 | 5 | Crypto communities |
| ELON | 5 | Twitter/X scam |

---

## 🔧 Technical Details

### Panel Infrastructure
```
Backend: Laravel PHP
Path: /var/www/casino-backend
Debug Mode: ENABLED (exposes stack traces)
Admin Path: /adm_panel
API Base: /backend-api/
CDN: Cloudflare
```

### Discovered API Endpoints
```
/backend-api/auth/me
/backend-api/worker/users/list
/backend-api/admin/users/list
/backend-api/admin/deposits
/backend-api/admin/settings
/backend-api/admin/logs
```

### Panel Configuration
```json
{
  "min_deposit": 5,
  "required_deposit": 5,
  "default_percent": 85,
  "super_account_keyword": "ximerawork",
  "global_support_id": 72
}
```

---

## 🔑 Leaked Credentials

### Worker Account
```
Email: lancerbuy777@project.com
Password: holabol1337
Role: worker
User ID: 228
Commission: 85%
```

### Keywords/Identifiers
- Super account trigger: `ximerawork`
- Brand name: `WinSystems`
- Telegram contact: `@project`

---

## 🛡️ IOCs (Indicators of Compromise)

See [iocs.json](iocs.json) for machine-readable format.

### Domains
```
ofedrex.com
spacema.bet
lurexcoin.com
money-king.bet
mogulbet.vip
xwebet.com
axidex.com
bitfirefx.com
infocryptox.com
[...full list in domains.txt]
```

### Infrastructure
- Backend framework: Laravel
- Server path: `/var/www/casino-backend`
- Uses Cloudflare for CDN/protection

---

## 📁 Files

| File | Description |
|------|-------------|
| [domains.txt](domains.txt) | All 22 phishing domains |
| [iocs.json](iocs.json) | Machine-readable IOCs |
| [panel_config.json](panel_config.json) | Panel settings dump |
| [victim_stats.json](victim_stats.json) | Aggregated victim statistics |
| [victim_emails.txt](victim_emails.txt) | 383 victim email addresses |

---

## 🚨 Recommended Actions

1. **Add domains to blocklists** - All 22 domains should be blocked
2. **Report to registrars** - File abuse reports with domain registrars
3. **Cloudflare abuse report** - CDN takedown request
4. **Monitor promo codes** - DREAM, LRX774, SEAL for new domains

---

## ⚠️ Disclaimer

This intelligence is provided for defensive purposes only. Data collected through authorized security research and open source intelligence methods.

---

**Collected by:** [PhishDestroy](https://github.com/phishdestroy)  
**Repository:** [ScamIntelLogs](https://github.com/phishdestroy/ScamIntelLogs)
