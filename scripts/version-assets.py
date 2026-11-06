"""Refresh content hashes so Cloudflare/browser caches never mix releases."""
from pathlib import Path
import hashlib
import re
import sys

root = Path(__file__).resolve().parents[1] / 'site'
check = '--check' in sys.argv

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]

index = root / 'index.html'
original = index.read_text()
versioned = re.sub(
    r'((?:src|href)=")([^"?#]+\.(?:js|css|webp|svg))(?:\?v=[^"#]*)?(")',
    lambda m: m[1] + m[2] + '?v=' + digest(root / m[2]) + m[3], original)
if check:
    assert original == versioned, 'Run python3 scripts/version-assets.py after changing assets'
else:
    index.write_text(versioned)
