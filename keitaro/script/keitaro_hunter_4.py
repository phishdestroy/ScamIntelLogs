#!/usr/bin/env python3
"""
Keitaro Hunter v4.1 - Mass TDS Scanner
Interactive mode + CLI support
"""

import json
import re
import sys
import io
import time
import random
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from urllib.parse import urlparse, urljoin, parse_qs, urlencode, urlunparse

import httpx
from faker import Faker
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, IntPrompt
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, BarColumn, TaskProgressColumn, TimeElapsedColumn, TextColumn
from rich import box

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

console = Console(force_terminal=True, legacy_windows=False)
fake = Faker(['en_US', 'en_GB', 'de_DE', 'fr_FR', 'es_ES', 'ru_RU', 'it_IT', 'pt_BR', 'ja_JP', 'ko_KR'])

DOCS = {
    "click_api": "https://docs.keitaro.io/en/development/click-api.html",
    "offer_url": "https://docs.keitaro.io/en/landing-pages-and-offers/offer-url.html",
    "lp_redirect": "https://docs.keitaro.io/en/landing-pages-and-offers/landing-page-redirect.html",
    "tracking": "https://docs.keitaro.io/en/campaign-integrations/tracking-script.html",
    "update_params": "https://docs.keitaro.io/en/landing-pages-and-offers/update-params.html",
}

BANNER = """[bold red]
 █▄▀ █▀▀ █ ▀█▀ ▄▀█ █▀█ █▀█   █ █ █ █ █▄ █ ▀█▀ █▀▀ █▀█
 █ █ ██▄ █  █  █▀█ █▀▄ █▄█   █▀█ █▄█ █ ▀█  █  ██▄ █▀▄[/]
[cyan]v4.1 - Mass TDS Scanner | github.com/phishdestroy[/]
"""


@dataclass
class Evidence:
    name: str
    passed: bool
    details: str
    doc: str


@dataclass 
class ScanResult:
    domain: str
    is_keitaro: bool
    score: int
    evidences: List[Evidence] = field(default_factory=list)
    error: Optional[str] = None


class ProxyRotator:
    def __init__(self, proxy_file: Optional[str] = None):
        self.proxies = []
        if proxy_file and Path(proxy_file).exists():
            self.proxies = self._load(proxy_file)
            console.print(f"[green]✓ Loaded {len(self.proxies)} proxies[/]")
    
    def _load(self, path: str) -> List[str]:
        proxies = []
        for line in Path(path).read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if not line.startswith('http'):
                line = f"http://{line}"
            proxies.append(line)
        return proxies
    
    def get(self) -> Optional[str]:
        return random.choice(self.proxies) if self.proxies else None


def get_headers() -> Dict[str, str]:
    return {
        "User-Agent": fake.chrome(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": f"{fake.locale().replace('_', '-')},en-US;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
    }


def normalize_domain(domain: str) -> str:
    domain = re.sub(r'^https?://', '', domain.lower().strip())
    return domain.split('/')[0]


def build_url_with_params(base: str, params: dict) -> str:
    p = urlparse(base)
    q = parse_qs(p.query, keep_blank_values=True)
    for k, v in params.items():
        q[k] = [v]
    return urlunparse((p.scheme, p.netloc, p.path, p.params, urlencode(q, doseq=True), p.fragment))


def extract_client_redirect(html: str) -> Optional[str]:
    m = re.search(r'<meta[^>]+http-equiv=["\']?\s*refresh[^>]*content=["\']?\s*\d+\s*;\s*url=([^"\'>\s]+)', html or "", flags=re.I)
    if m:
        return m.group(1)
    for pat in [r"window\.location\.href\s*=\s*['\"]([^'\"]+)['\"]", r"window\.location\s*=\s*['\"]([^'\"]+)['\"]",
                r"location\.href\s*=\s*['\"]([^'\"]+)['\"]", r"location\.replace\(\s*['\"]([^'\"]+)['\"]\s*\)"]:
        m = re.search(pat, html or "", flags=re.I)
        if m:
            return m.group(1)
    return None


class ChainFetcher:
    def __init__(self, timeout: float = 10.0, max_hops: int = 10, proxy: Optional[str] = None):
        self.timeout = timeout
        self.max_hops = max_hops
        self.proxy = proxy
    
    def fetch(self, url: str) -> Dict:
        result = {"url": url, "final_url": url, "status": 0, "content_type": "", "cookies": [], "body": "", "body_len": 0, "error": None}
        
        try:
            kw = {"headers": get_headers(), "timeout": httpx.Timeout(self.timeout, connect=5.0), "follow_redirects": False, "verify": False}
            if self.proxy:
                kw["proxy"] = self.proxy
            
            with httpx.Client(**kw) as client:
                current_url = url
                for _ in range(self.max_hops):
                    if "/admin" in urlparse(current_url).path.lower():
                        break
                    r = client.get(current_url)
                    result["status"] = r.status_code
                    result["final_url"] = str(r.url)
                    result["content_type"] = r.headers.get("content-type", "")
                    try:
                        result["cookies"].extend(r.headers.get_list("set-cookie"))
                    except:
                        if sc := r.headers.get("set-cookie"):
                            result["cookies"].append(sc)
                    try:
                        result["body"] = r.text[:5000] if r.text else ""
                        result["body_len"] = len(r.content) if r.content else 0
                    except:
                        pass
                    if r.status_code in (301, 302, 303, 307, 308) and (loc := r.headers.get("location")):
                        current_url = urljoin(str(r.url), loc)
                        continue
                    if "text/html" in result["content_type"].lower() and (target := extract_client_redirect(result["body"])):
                        current_url = urljoin(str(r.url), target)
                        continue
                    break
        except httpx.TimeoutException:
            result["error"] = "timeout"
        except httpx.ConnectError:
            result["error"] = "connect"
        except httpx.ProxyError:
            result["error"] = "proxy"
        except Exception as e:
            result["error"] = str(e)[:30]
        return result


class KeitaroScanner:
    def __init__(self, timeout: float = 10.0, proxy_rotator: Optional[ProxyRotator] = None):
        self.timeout = timeout
        self.proxy_rotator = proxy_rotator
    
    def scan(self, domain: str) -> ScanResult:
        domain = normalize_domain(domain)
        result = ScanResult(domain=domain, is_keitaro=False, score=0)
        proxy = self.proxy_rotator.get() if self.proxy_rotator else None
        fetcher = ChainFetcher(timeout=self.timeout, proxy=proxy)
        
        origin = f"https://{domain}"
        chains = {}
        chains["MAIN"] = fetcher.fetch(origin)
        
        if chains["MAIN"]["error"]:
            origin = f"http://{domain}"
            chains["MAIN"] = fetcher.fetch(origin)
            if chains["MAIN"]["error"]:
                result.error = chains["MAIN"]["error"]
                return result
        
        chains["OFFER_TEST"] = fetcher.fetch(build_url_with_params(origin, {"_lp": "1", "_token": "invalid"}))
        chains["CLICK_API"] = fetcher.fetch(f"{origin}/click_api/v3?token=invalid&info=1&log=1")
        chains["UPDATE_TOKENS"] = fetcher.fetch(f"{origin}/?_update_tokens=1&sub_id=invalid&sub_id_1=TEST")
        
        evidences = [
            self._check_click_api(chains),
            self._check_offer_reaction(chains),
            self._check_update_tokens(chains),
            self._check_offer_params(chains),
            self._check_subid_cookie(chains),
            self._check_html_markers(chains),
            self._check_landing_params(chains),
        ]
        
        result.evidences = evidences
        result.score = sum(1 for e in evidences if e.passed)
        result.is_keitaro = result.score >= 2
        return result
    
    def _check_click_api(self, chains: Dict) -> Evidence:
        r = chains.get("CLICK_API", {})
        status, ct, body = r.get("status", 0), r.get("content_type", "").lower(), r.get("body", "").strip()[:200]
        jsonish = "json" in ct or body.startswith("{") or body.startswith("[")
        ok = status not in (0, 404) and jsonish
        details = f"ClickAPI:{status}" + (" KeitaroError" if ok and ("maintenance" in body.lower() or "error" in body.lower()) else "")
        return Evidence("Click API", ok, details, DOCS["click_api"])
    
    def _check_offer_reaction(self, chains: Dict) -> Evidence:
        base, test = chains.get("MAIN", {}), chains.get("OFFER_TEST", {})
        if not base.get("status") or not test.get("status"):
            return Evidence("Offer Reaction", False, "no response", DOCS["offer_url"])
        reacted = test["status"] != base["status"] or test.get("content_type") != base.get("content_type") or abs(test.get("body_len", 0) - base.get("body_len", 0)) > 100
        return Evidence("Offer Reaction", reacted, f"_lp:{base['status']}→{test['status']}" if reacted else "no change", DOCS["offer_url"])
    
    def _check_update_tokens(self, chains: Dict) -> Evidence:
        base, test = chains.get("MAIN", {}), chains.get("UPDATE_TOKENS", {})
        if not base.get("status") or not test.get("status"):
            return Evidence("Update Tokens", False, "no response", DOCS["update_params"])
        reacted = test["status"] != base["status"] or test.get("content_type") != base.get("content_type") or abs(test.get("body_len", 0) - base.get("body_len", 0)) > 100
        return Evidence("Update Tokens", reacted, f"_update:{base['status']}→{test['status']}" if reacted else "no change", DOCS["update_params"])
    
    def _check_offer_params(self, chains: Dict) -> Evidence:
        for c in chains.values():
            q = parse_qs(urlparse(c.get("final_url", "")).query)
            if "_lp" in q and ("_token" in q or "token" in q):
                return Evidence("Offer Params", True, "found", DOCS["offer_url"])
        return Evidence("Offer Params", False, "not found", DOCS["offer_url"])
    
    def _check_landing_params(self, chains: Dict) -> Evidence:
        for c in chains.values():
            q = parse_qs(urlparse(c.get("final_url", "")).query)
            if "_subid" in q and ("_token" in q or "token" in q):
                return Evidence("Landing Params", True, "found", DOCS["lp_redirect"])
        return Evidence("Landing Params", False, "not found", DOCS["lp_redirect"])
    
    def _check_subid_cookie(self, chains: Dict) -> Evidence:
        for c in chains.values():
            for cookie in c.get("cookies", []):
                if re.search(r'\bsubid=', cookie, re.I):
                    return Evidence("Subid Cookie", True, "Cookie", DOCS["tracking"])
        return Evidence("Subid Cookie", False, "not found", DOCS["tracking"])
    
    def _check_html_markers(self, chains: Dict) -> Evidence:
        for c in chains.values():
            body = c.get("body", "")
            for pat, name in [(r'\bKTracking\b', "KTracking"), (r'\{subid\}', "{subid}"), (r'\{offer\}', "{offer}"), (r'keitaro', "keitaro")]:
                if re.search(pat, body, re.I):
                    return Evidence("HTML Markers", True, f"HTML {name}", DOCS["tracking"])
        return Evidence("HTML Markers", False, "not found", DOCS["tracking"])


class KeitaroHunter:
    def __init__(self, workers: int = 50, timeout: float = 10.0, proxy_rotator: Optional[ProxyRotator] = None):
        self.workers = workers
        self.scanner = KeitaroScanner(timeout=timeout, proxy_rotator=proxy_rotator)
        self.found_count = self.scanned_count = self.errors_count = 0
    
    def hunt(self, domains: List[str], output_file: Path):
        found = []
        start = time.perf_counter()
        
        with Progress(SpinnerColumn("dots12"), TextColumn("[bold cyan]Hunting...[/]"), BarColumn(40, complete_style="green"),
                      TextColumn("[bold]{task.percentage:>3.0f}%[/]"), TextColumn("[green]{task.fields[found]}[/] found"),
                      TimeElapsedColumn(), console=console, refresh_per_second=10) as progress:
            task = progress.add_task("", total=len(domains), found=0)
            
            with ThreadPoolExecutor(max_workers=self.workers) as ex:
                futures = {ex.submit(self.scanner.scan, d): d for d in domains}
                for future in as_completed(futures):
                    self.scanned_count += 1
                    try:
                        r = future.result()
                        if r.is_keitaro:
                            self.found_count += 1
                            found.append(r)
                            ev = " ".join([e.details for e in r.evidences if e.passed][:3])
                            progress.console.print(f"[green]🎯[/] [white]{r.domain}[/] [cyan]({r.score}/7)[/] {ev}")
                            self._save(found, output_file)
                        elif r.error:
                            self.errors_count += 1
                    except:
                        self.errors_count += 1
                    progress.update(task, advance=1, found=self.found_count)
        
        elapsed = time.perf_counter() - start
        table = Table(box=box.ROUNDED, border_style="cyan", show_header=False)
        table.add_column("", style="white")
        table.add_column("", style="bold")
        table.add_row("🎯 Found", f"[green]{self.found_count}[/]")
        table.add_row("📊 Scanned", f"{self.scanned_count:,}")
        table.add_row("❌ Errors", f"[red]{self.errors_count}[/]")
        table.add_row("⏱ Speed", f"{len(domains)/max(elapsed,1):.0f} d/s")
        table.add_row("💾 Output", f"[cyan]{output_file}[/]")
        console.print("\n", table)
        
        if found:
            console.print(f"\n[bold green]TOP KEITARO:[/]")
            for r in sorted(found, key=lambda x: -x.score)[:20]:
                console.print(f"  [white]{r.domain}[/] [dim]({r.score}/7) [{', '.join(e.name for e in r.evidences if e.passed)}][/]")
    
    def _save(self, found: List[ScanResult], path: Path):
        path.write_text(json.dumps({
            "timestamp": datetime.now().isoformat(), "count": len(found),
            "keitaro": [{"domain": r.domain, "score": r.score, "evidences": [e.name for e in r.evidences if e.passed],
                         "details": {e.name: e.details for e in r.evidences if e.passed}} for r in found]
        }, indent=2, ensure_ascii=False), encoding='utf-8')


def load_domains(source: str) -> List[str]:
    path = Path(source)
    if path.exists():
        content = path.read_text(encoding='utf-8')
        if path.suffix == '.json':
            data = json.loads(content)
            raw = data if isinstance(data, list) else data.get('domains', data.get('urls', []))
        else:
            raw = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith('#')]
    else:
        raw = [source]
    return list(set(normalize_domain(str(d)) for d in raw if normalize_domain(str(d)) and '.' in normalize_domain(str(d))))


def scan_single(domain: str, timeout: float = 10.0):
    console.print(f"\n[bold]Scanning:[/] [cyan]{domain}[/]\n")
    result = KeitaroScanner(timeout=timeout).scan(domain)
    
    if result.error:
        console.print(f"[red]Error: {result.error}[/]")
        return
    
    table = Table(title="Detection Results", box=box.ROUNDED, border_style="cyan")
    table.add_column("Check", style="white")
    table.add_column("Status", justify="center")
    table.add_column("Details", style="dim")
    for ev in result.evidences:
        table.add_row(ev.name, "[green]✓ PASS[/]" if ev.passed else "[red]✗ FAIL[/]", ev.details)
    console.print(table)
    
    if result.is_keitaro:
        console.print(f"\n[bold green]✓ KEITARO CONFIRMED[/] [dim]({result.score}/7)[/]")
    else:
        console.print(f"\n[bold yellow]✗ NOT KEITARO[/] [dim]({result.score}/7, need ≥2)[/]")


def interactive_mode():
    console.print(BANNER)
    
    while True:
        console.print("\n[bold cyan]═══ MENU ═══[/]")
        console.print("[1] Scan single domain")
        console.print("[2] Mass scan from file")
        console.print("[0] Exit\n")
        
        choice = Prompt.ask("[cyan]►[/]", choices=["0", "1", "2"], default="1")
        
        if choice == "0":
            break
        elif choice == "1":
            domain = Prompt.ask("\n[cyan]Domain/URL[/]")
            if domain:
                scan_single(domain)
        elif choice == "2":
            source = Prompt.ask("\n[cyan]Domains file[/]", default="domains.txt")
            if not Path(source).exists():
                console.print(f"[red]Not found: {source}[/]")
                continue
            
            domains = load_domains(source)
            console.print(f"[green]✓ Loaded {len(domains):,} domains[/]")
            
            workers = IntPrompt.ask("[cyan]Workers[/]", default=50)
            timeout = IntPrompt.ask("[cyan]Timeout[/]", default=10)
            proxy_file = Prompt.ask("[cyan]Proxy file[/]", default="")
            output = Prompt.ask("[cyan]Output[/]", default=f"keitaro_{datetime.now():%Y%m%d_%H%M%S}.json")
            
            proxy_rotator = ProxyRotator(proxy_file) if proxy_file else None
            console.print()
            KeitaroHunter(workers, timeout, proxy_rotator).hunt(domains, Path(output))


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Keitaro Hunter v4.1")
    parser.add_argument("target", nargs="?", help="Domain or file (interactive if empty)")
    parser.add_argument("-o", "--output", type=Path)
    parser.add_argument("-w", "--workers", type=int, default=50)
    parser.add_argument("-t", "--timeout", type=float, default=10.0)
    parser.add_argument("-p", "--proxy", help="Proxy file")
    parser.add_argument("-l", "--limit", type=int)
    args = parser.parse_args()
    
    if not args.target:
        interactive_mode()
        return 0
    
    if not Path(args.target).exists() and '.' in args.target:
        scan_single(args.target, args.timeout)
        return 0
    
    domains = load_domains(args.target)
    console.print(BANNER)
    console.print(f"[green]✓ Loaded {len(domains):,} domains[/]")
    if args.limit:
        domains = domains[:args.limit]
    
    output = args.output or Path(f"keitaro_{datetime.now():%Y%m%d_%H%M%S}.json")
    proxy_rotator = ProxyRotator(args.proxy) if args.proxy else None
    KeitaroHunter(args.workers, args.timeout, proxy_rotator).hunt(domains, output)
    return 0


if __name__ == "__main__":
    import warnings
    warnings.filterwarnings("ignore")
    import urllib3
    urllib3.disable_warnings()
    sys.exit(main())
