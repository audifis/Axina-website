#!/usr/bin/env python3
"""Assemble les pages du site : src/pages/*.html + src/partials -> *.html à la racine.

Usage : python3 tools/build.py
Le site reste 100 % statique ; Vercel sert les fichiers générés tels quels.
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PART = {p.stem: p.read_text(encoding="utf-8") for p in (SRC / "partials").glob("*.html")}
VERSION = hashlib.sha1(
    (ROOT / "assets/axina.css").read_bytes() + (ROOT / "assets/axina.js").read_bytes()
).hexdigest()[:8]


def build(page: pathlib.Path) -> None:
    raw = page.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", raw, re.S)
    meta = dict(line.split(":", 1) for line in m.group(1).splitlines() if ":" in line)
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    body = raw[m.end():]
    head = PART["head"]
    for k in ("title", "description", "canonical"):
        head = head.replace("{{%s}}" % k, meta.get(k, "").replace('"', "&quot;"))
    head = head.replace("{{v}}", VERSION)
    nav = PART["nav"].replace("{{navsolid}}", "")
    html = head + "<body>\n" + nav + body + PART["footer"] + PART["modals"] + "</body>\n</html>\n"
    (ROOT / page.name).write_text(html, encoding="utf-8")
    print(f"{page.name}: {len(html.encode()) / 1024:.1f} Ko")


for p in sorted((SRC / "pages").glob("*.html")):
    build(p)
