# Keitaro Hunter v4.1

Mass scanner for Keitaro TDS detection based on official documentation.

## Install

```bash
pip install httpx faker rich
```

## Usage

### Interactive Mode (just run without args)
```bash
python keitaro_hunter.py
```
![menu](https://i.imgur.com/menu.png)

### Single Domain
```bash
python keitaro_hunter.py example.com
python keitaro_hunter.py https://tracker.com/path
```

### Mass Scan
```bash
python keitaro_hunter.py domains.txt
python keitaro_hunter.py domains.txt -w 100 -t 15 -o results.json
python keitaro_hunter.py domains.json -p proxies.txt --limit 5000
```

## Arguments

| Arg | Description | Default |
|-----|-------------|---------|
| `target` | Domain or file path | interactive |
| `-o` | Output JSON | auto timestamp |
| `-w` | Workers | 50 |
| `-t` | Timeout (sec) | 10 |
| `-p` | Proxy file | none |
| `-l` | Limit domains | all |

## Proxy Format

```
ip:port
user:pass@ip:port
http://ip:port
socks5://ip:port
```

## Detection (7 checks)

| Check | Based on |
|-------|----------|
| Click API | `/click_api/v3` endpoint |
| Offer Reaction | `_lp + _token` params |
| Update Tokens | `_update_tokens=1` |
| Offer Params | URL contains `_lp + _token` |
| Subid Cookie | `Set-Cookie: subid=` |
| HTML Markers | KTracking, {subid}, {offer} |
| Landing Params | `_subid + _token` in URL |

**Verdict:** ≥2 evidences = Keitaro CONFIRMED

## Output

```json
{
  "timestamp": "2025-01-26T15:30:00",
  "count": 42,
  "keitaro": [
    {
      "domain": "tracker.com",
      "score": 4,
      "evidences": ["Click API", "Offer Reaction", "Update Tokens", "HTML Markers"],
      "details": {"Click API": "ClickAPI:401 KeitaroError", ...}
    }
  ]
}
```
