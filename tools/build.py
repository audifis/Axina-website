#!/usr/bin/env python3
"""Assemble les pages du site : src/pages/*.html + src/partials -> *.html à la racine,
plus sitemap.xml. Données structurées (JSON-LD) générées depuis le contenu des pages.

Usage : python3 tools/build.py
Le site reste 100 % statique ; Vercel sert les fichiers générés tels quels.
"""
import datetime
import hashlib
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SITE = "https://axina.pro/"
PART = {p.stem: p.read_text(encoding="utf-8") for p in (SRC / "partials").glob("*.html")}
VERSION = hashlib.sha1(
    (ROOT / "assets/axina.css").read_bytes() + (ROOT / "assets/axina.js").read_bytes()
).hexdigest()[:8]

ORG = {
    "@type": "Organization",
    "@id": SITE + "#organisation",
    "name": "AXINA",
    "url": SITE,
    "logo": SITE + "assets/img/icon-512.png",
    "description": "Infrastructure financière de confiance pour les entreprises et les cabinets de l'espace OHADA.",
    "areaServed": "Espace OHADA",
    "contactPoint": {"@type": "ContactPoint", "contactType": "customer support",
                     "telephone": "+240222619606", "availableLanguage": ["fr"]},
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "#site", "name": "AXINA", "url": SITE,
           "inLanguage": "fr", "publisher": {"@id": SITE + "#organisation"}}
APP = {
    "@type": "SoftwareApplication",
    "name": "AXINA",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Comptabilité SYSCOHADA",
    "operatingSystem": "Web",
    "url": SITE,
    "publisher": {"@id": SITE + "#organisation"},
    "description": "Comptabilité SYSCOHADA tenue en temps réel, écritures scellées et chaînées, pilotage, dossier bancaire et collaboration avec le cabinet comptable.",
    "offers": {"@type": "AggregateOffer", "priceCurrency": "XOF", "lowPrice": "0", "highPrice": "90000",
               "offerCount": "9"},
}


def text(s: str) -> str:
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", s)).split())


def faq_schema(body: str):
    qa = re.findall(r"<details><summary>(.*?)<span class=\"pm\"[^>]*></span></summary><p>(.*?)</p></details>", body, re.S)
    if not qa:
        return None
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(a)}} for q, a in qa]}


def build(page: pathlib.Path) -> str:
    raw = page.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", raw, re.S)
    meta = {k.strip(): v.strip() for k, v in (l.split(":", 1) for l in m.group(1).splitlines() if ":" in l)}
    body = raw[m.end():]
    canonical = meta.get("canonical", "")
    graph = [ORG, WEBSITE]
    if page.stem == "index":
        graph.append(APP)
    else:
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "AXINA", "item": SITE},
            {"@type": "ListItem", "position": 2, "name": meta.get("crumb", meta["title"]), "item": SITE + canonical}]})
    faq = faq_schema(body)
    if faq:
        graph.append(faq)
    jsonld = '<script type="application/ld+json">' + json.dumps(
        {"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":")) + "</script>"
    fields = {
        "title": meta["title"],
        "description": meta["description"],
        "canonical": canonical,
        "ogtitle": meta.get("ogtitle", meta["title"]),
        "ogimage": meta.get("ogimage", "og-axina.jpg"),
        "ogalt": meta.get("ogalt", "AXINA : comptabilité SYSCOHADA scellée, pilotage et financement"),
    }
    head = PART["head"]
    for k, v in fields.items():
        head = head.replace("{{%s}}" % k, v.replace('"', "&quot;"))
    head = head.replace("{{v}}", VERSION).replace("{{jsonld}}", jsonld)
    out = head + "<body>\n" + PART["nav"] + body + PART["footer"] + PART["modals"] + "</body>\n</html>\n"
    (ROOT / page.name).write_text(out, encoding="utf-8")
    print(f"{page.name}: {len(out.encode()) / 1024:.1f} Ko")
    return canonical


urls = [build(p) for p in sorted((SRC / "pages").glob("*.html"))]
today = datetime.date.today().isoformat()
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in sorted(urls, key=lambda x: (x != "", x)):
    sitemap.append(f"  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod><priority>{'1.0' if u == '' else '0.8'}</priority></url>")
sitemap.append("</urlset>")
(ROOT / "sitemap.xml").write_text("\n".join(sitemap) + "\n", encoding="utf-8")
print("sitemap.xml:", len(urls), "URL")
