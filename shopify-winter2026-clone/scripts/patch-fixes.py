#!/usr/bin/env python3
import re

# 1. Patch index.html to inject URL polyfill right after <head>
with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

url_polyfill = """<head><script>
// Polyfill URL constructor to tolerate relative root paths
(function() {
  const OrigURL = window.URL;
  window.URL = function(url, base) {
    if (typeof url === 'string') {
      if (url.startsWith('/')) {
        return new OrigURL(url, base || window.location.origin);
      }
      try {
        return new OrigURL(url, base);
      } catch (e) {
        return new OrigURL(url, window.location.origin);
      }
    }
    return new OrigURL(url, base);
  };
  window.URL.prototype = OrigURL.prototype;
  window.URL.createObjectURL = OrigURL.createObjectURL.bind(OrigURL);
  window.URL.revokeObjectURL = OrigURL.revokeObjectURL.bind(OrigURL);
  if (OrigURL.canParse) window.URL.canParse = OrigURL.canParse.bind(OrigURL);
})();
</script>"""

if "Polyfill URL constructor" not in html:
    html = html.replace("<head>", url_polyfill, 1)
    print("Injected URL polyfill into index.html")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

# 2. Patch index-C9-WQbCX.js to neutralize GTM injection and doubleclick network calls
c9_path = "public/oxygen-assets/index-C9-WQbCX.js"
with open(c9_path, "r", encoding="utf-8", errors="ignore") as f:
    c9 = f.read()

# Replace GTM zn component with null renderer
if "var zn=function(e){var t=e.gtmAccountId" in c9:
    c9 = c9.replace("var zn=function(e){var t=e.gtmAccountId", "var zn=function(e){return null;var t=e.gtmAccountId")
    with open(c9_path, "w", encoding="utf-8") as f:
        f.write(c9)
    print("Neutralized GTM loader in index-C9-WQbCX.js")
elif "zn=function(e){var t=e.gtmAccountId" in c9:
    c9 = c9.replace("zn=function(e){var t=e.gtmAccountId", "zn=function(e){return null;var t=e.gtmAccountId")
    with open(c9_path, "w", encoding="utf-8") as f:
        f.write(c9)
    print("Neutralized GTM loader in index-C9-WQbCX.js (variant 2)")

# 3. Patch server.mjs to redirect / to /editions/winter2026
with open("server.mjs", "r", encoding="utf-8") as f:
    server_code = f.read()

if "res.writeHead(302, { 'Location': '/editions/winter2026' });" not in server_code:
    # Insert right at top of server request handler
    old_snippet = "let filePath = resolveLocalPath(req.url);"
    new_snippet = """const rawPath = req.url.split('?')[0].split('#')[0];
  if (rawPath === '/' || rawPath === '') {
    res.writeHead(302, { 'Location': '/editions/winter2026' });
    res.end();
    return;
  }
  let filePath = resolveLocalPath(req.url);"""
    server_code = server_code.replace(old_snippet, new_snippet, 1)
    with open("server.mjs", "w", encoding="utf-8") as f:
        f.write(server_code)
    print("Added / -> /editions/winter2026 302 redirect in server.mjs")

print("All patches applied.")
