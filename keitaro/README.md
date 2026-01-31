# Keitaro TDS - Detection Toolkit

## ⚠️ Disclaimer

**We are not claiming all Keitaro users are criminals.** However, despite extensive research, we have been unable to find a single legitimate use case for this tool. Every instance we've encountered involves malware distribution, phishing, scams, or ad fraud.

**We do not block anything.** This repository provides detection tools for security researchers, abuse teams, and ad fraud investigators to identify Keitaro-cloaked websites.

**Our tools are non-invasive.** They only use publicly documented Keitaro API endpoints to detect the presence of cloaking. No exploitation, no attacks, just detection.

---

## What is Keitaro?

Keitaro is a **Traffic Distribution System (TDS)** - software designed to:
- Show different content to different visitors based on their characteristics
- Hide "real" landing pages from moderators, crawlers, and security scanners
- Bypass advertising platform policies and security reviews
- Cloak malicious content behind innocent-looking pages

### The Cloaking Problem

When you visit a Keitaro-powered site:
- **Moderators/Bots see:** Legitimate content (news, blogs, empty pages)
- **Real victims see:** Scams, phishing, malware, fake shops

This is why platforms like Google Ads, Facebook, and others explicitly ban cloaking - it exists solely to deceive.

---

## Why We Believe Keitaro Cannot Be Legitimate

### 1. Core Purpose is Deception
The entire product is built around showing fake content to reviewers while showing real (malicious) content to victims. There's no legitimate business need for this.

### 2. Direct Ties to Cybercrime Infrastructure
- **AVCheck integration**: Keitaro has documented connections to AVCheck, a service used to test malware against antivirus products
- **Malware campaigns**: Multiple threat intelligence reports link Keitaro to malspam campaigns, banking trojans, and ransomware distribution
- **Underground marketing**: Keitaro is heavily advertised on Russian-speaking cybercrime forums

### 3. Our Research Findings
After analyzing 1,500+ Keitaro panels, we found:
- Crypto scams and fake investment platforms
- Phishing pages impersonating banks, exchanges, government services
- Malware distribution (fake software updates, cracked software)
- Fake e-commerce stores
- Dating/romance scams
- Illegal gambling promotion

**We found ZERO legitimate use cases.**

### 4. Corporate Structure Designed for Obfuscation
The company operates through:
- Russian-origin developers
- Estonian legal entity (EU jurisdiction shopping)
- Infrastructure spread across bulletproof hosting providers

This structure exists to complicate takedowns and legal action, not for legitimate business reasons.

---

## Repository Contents

```
keitaro/
├── README.md           # This file
├── index.html          # Evidence browser
├── panels.csv          # 1,500+ discovered Keitaro admin panels
├── script/
│   ├── keitaro_hunter_4.py  # Detection script
│   └── README.md            # Script documentation
└── script.jpg          # Script screenshot
```

---

## Detection Script

### What It Does
The `keitaro_hunter` script checks if a website uses Keitaro TDS by:
1. Testing official Keitaro API endpoints (`/click_api/v3`)
2. Checking for characteristic URL parameters (`_lp`, `_token`, `_subid`)
3. Looking for Keitaro cookies and HTML markers
4. Analyzing response differences (cloaking detection)

### What It Does NOT Do
- Does not exploit any vulnerabilities
- Does not attack or harm target websites
- Does not bypass any security measures
- Only uses documented, public Keitaro functionality

### Installation
```bash
pip install httpx faker rich
```

### Usage
```bash
# Single domain
python keitaro_hunter_4.py suspicious-site.com

# Mass scan
python keitaro_hunter_4.py domains.txt -w 100 -o results.json

# With proxies
python keitaro_hunter_4.py domains.txt -p proxies.txt
```

---

## Admin Panels Dataset

The `panels.csv` contains 1,500+ Keitaro admin panel URLs discovered through:
- Shodan/Censys scanning for Keitaro signatures
- Analysis of malware campaign infrastructure
- Threat intelligence sharing

### CSV Format
```
host,ip,port,protocol,title,domain,country,city,link,org
```

### Geographic Distribution
Top hosting countries for Keitaro panels:
- 🇺🇸 USA (DigitalOcean, Vultr, Cloudflare)
- 🇳🇱 Netherlands (bulletproof hosting)
- 🇩🇪 Germany (Hetzner, various VPS)
- 🇷🇺 Russia (various providers)
- 🇬🇧 UK (various providers)
- 🇭🇰 Hong Kong (Femo IT Solutions - major cluster)

---

## For Security Researchers

### Identifying Keitaro Cloaking
Signs a site uses Keitaro:
1. `/admin` or `/admin/` redirects to Keitaro login ("Welcome!")
2. URLs contain `_lp=1`, `_token=`, `_subid=` parameters
3. Cookies named `subid` or similar tracking cookies
4. Different content when accessing from datacenter IPs vs residential
5. `/click_api/v3` endpoint returns JSON (even if error)

### Reporting Keitaro Abuse
When reporting cloaked sites to ad platforms:
1. Document the cloaking behavior (screenshots of both versions)
2. Include evidence of Keitaro usage
3. Provide the actual malicious content URL
4. Note: Many platforms now specifically look for TDS signatures

---

## Legal Notice

This toolkit is provided for:
- Security research
- Abuse team investigations  
- Ad fraud detection
- Threat intelligence

We do not encourage or condone any illegal activities. Use responsibly and within applicable laws.

---

## Contributing

If you discover Keitaro panels or have threat intelligence to share:
- Submit via Issues
- Contact: [security@phishdestroy.com]

---

*PhishDestroy Threat Intelligence | 2026*
