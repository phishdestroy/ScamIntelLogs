/**
 * Keitaro TDS Detection Proxy — Cloudflare Worker
 *
 * Deploy:
 * npm install wrangler -g
 * wrangler deploy worker.js --name keitaro-proxy
 *
 * Usage:
 * GET /?url=https://example.com
 * GET /?url=https://example.com&ua=Googlebot/2.1&referer=https://google.com
 * Returns: { finalUrl, status, contentType, body, bodyLength, cookies[], redirects[], error }
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

// Full Chrome 136 browser fingerprint for "Standard" emulation
const BROWSER_HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

// Minimal headers for bot UAs (bots don't send Sec-Ch-* / Sec-Fetch-*)
function buildHeaders(customUA, customReferer) {
  if (customUA) {
    const h = {
      'User-Agent': customUA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
    };
    if (customReferer) h['Referer'] = customReferer;
    return h;
  }
  const h = { ...BROWSER_HEADERS };
  if (customReferer) h['Referer'] = customReferer;
  return h;
}

// Detect client-side redirects: <meta http-equiv="refresh"> and JS location assignments
function extractClientRedirect(html) {
  if (!html) return null;

  // 1. Meta Refresh
  const meta = html.match(/<meta[^>]+http-equiv=["']?refresh["']?[^>]*content=["']?\d+;\s*url=([^"'>\s]+)/i);
  if (meta) return meta[1].replace(/['"]/g, '').trim();

  // 2. JavaScript redirects (window.location, self.location, location.replace, etc.)
  const jsPatterns = [
    /(?:window|self|top|parent)?\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/i,
    /(?:window|self|top|parent)?\.location\.replace\(['"]([^'"]+)['"]\)/i,
    /(?:window|self|top|parent)?\.location\.assign\(['"]([^'"]+)['"]\)/i
  ];

  for (const pattern of jsPatterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }

  return null;
}

async function fetchWithRedirects(targetUrl, headers) {
  const redirects = [];
  const allCookies = [];
  let currentUrl = targetUrl;

  for (let i = 0; i < 12; i++) {
    let resp;
    try {
      resp = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers
      });
    } catch (e) {
      return { error: `Fetch failed at ${currentUrl}: ${e.message}`, redirects, cookies: allCookies };
    }

    const hdrs = {};
    resp.headers.forEach((v, k) => { hdrs[k] = v; });

    const setCookie = resp.headers.get('set-cookie') || '';
    if (setCookie) allCookies.push(setCookie);

    redirects.push({ url: currentUrl, status: resp.status, headers: hdrs });

    // Handle HTTP Redirects (3xx)
    if (resp.status >= 300 && resp.status < 400) {
      const loc = resp.headers.get('location');
      if (!loc) break;
      try {
        currentUrl = new URL(loc, currentUrl).href;
      } catch {
        currentUrl = loc;
      }
      continue;
    }

    // Handle successful response and check for client-side redirects
    if (resp.status === 200) {
      const ct = resp.headers.get('content-type') || '';
      const body = await resp.text();

      if (ct.toLowerCase().includes('text/html')) {
        const clientTarget = extractClientRedirect(body);
        if (clientTarget) {
          try {
            const nextUrl = new URL(clientTarget, currentUrl).href;
            redirects.push({
              url: nextUrl,
              status: 0,
              headers: {},
              via: 'client'
            });
            currentUrl = nextUrl;
            continue;
          } catch {
            // If URL is invalid, stop and return what we have
          }
        }
      }

      return {
        finalUrl: currentUrl,
        status: resp.status,
        contentType: ct,
        body: body.substring(0, 300000),
        bodyLength: body.length,
        cookies: allCookies,
        redirects,
        error: null,
      };
    } else {
      // 4xx, 5xx etc.
      const body = await resp.text();
      return {
        finalUrl: currentUrl,
        status: resp.status,
        contentType: resp.headers.get('content-type') || '',
        body: body.substring(0, 300000),
        bodyLength: body.length,
        cookies: allCookies,
        redirects,
        error: null,
      };
    }
  }

  return {
    finalUrl: currentUrl,
    status: 0,
    contentType: '',
    body: '',
    bodyLength: 0,
    cookies: allCookies,
    redirects,
    error: 'Too many redirects',
  };
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const customUA = url.searchParams.get('ua');
    const customReferer = url.searchParams.get('referer');
    const headers = buildHeaders(customUA, customReferer);

    const result = await fetchWithRedirects(targetUrl, headers);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  },
};
