#!/usr/bin/env python3
"""Assemble le site statique.

- src/pages/**/*.html (en-tête YAML)            -> pages au même chemin à la racine
- tools/content.py : MODULES, GLOSSARY          -> entreprises/*.html, cabinets/*.html, ressources/glossaire.html
- src/partials : en-tête, navigation, pied de page, fenêtres
- sitemap.xml ; données structurées JSON-LD générées depuis le contenu.

Usage : python3 tools/build.py   (Vercel sert les fichiers générés, URL propres via cleanUrls)
"""
import datetime
import hashlib
import html
import json
import pathlib
import re
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from content import GLOSSARY, MODULES, STATUS_CLASS  # noqa: E402

SRC = ROOT / "src"
SITE = "https://axina.pro/"
PART = {p.stem: p.read_text(encoding="utf-8") for p in (SRC / "partials").glob("*.html")}
VERSION = hashlib.sha1(
    (ROOT / "assets/axina.css").read_bytes() + (ROOT / "assets/axina.js").read_bytes()
).hexdigest()[:8]
E = html.escape

ORG = {
    "@type": "Organization", "@id": SITE + "#organisation", "name": "AXINA", "url": SITE,
    "logo": SITE + "assets/img/icon-512.png",
    "description": "Infrastructure financière de confiance pour les entreprises et les cabinets de l'espace OHADA.",
    "areaServed": "Espace OHADA",
    "contactPoint": {"@type": "ContactPoint", "contactType": "customer support",
                     "telephone": "+240222619606", "availableLanguage": ["fr"]},
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "#site", "name": "AXINA", "url": SITE,
           "inLanguage": "fr", "publisher": {"@id": SITE + "#organisation"}}
APP = {
    "@type": "SoftwareApplication", "name": "AXINA", "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Comptabilité SYSCOHADA", "operatingSystem": "Web", "url": SITE,
    "publisher": {"@id": SITE + "#organisation"},
    "description": "Comptabilité SYSCOHADA tenue en temps réel, écritures scellées et chaînées, pilotage, dossier bancaire et collaboration avec le cabinet comptable.",
    "offers": {"@type": "AggregateOffer", "priceCurrency": "XOF", "lowPrice": "0", "highPrice": "90000", "offerCount": "9"},
}

# ------------------------------------------------------------------ navigation
EXTRA = {
    "Entreprises": [("/bank-ready", "Dossier bancaire", "Bank Ready, inclus dans Premium")],
    "Cabinets": [("/#tarifs", "Formules Cabinet", "De 5 à 60 entreprises")],
}
RESSOURCES = [
    ("/blog", "Blog", "Fiscalité, réformes, financement"),
    ("/ressources/glossaire", "Glossaire", "La comptabilité en mots simples"),
    ("/ressources/verification-dip", "Vérification DIP", "Vérifier un document par QR code"),
    ("/demo", "Démo", "Du cockpit au dossier bancaire"),
    ("/#faq", "Questions fréquentes", "Avant de commencer"),
]


def menu_groups():
    groups = {}
    for m in MODULES:
        groups.setdefault(m["group"], []).append(("/" + m["slug"], m["menu"], m["menu_hint"]))
    for g, items in EXTRA.items():
        groups[g] += items
    groups["Ressources"] = RESSOURCES
    return groups


def render_menu():
    out = ['<nav class="nav-links" aria-label="Navigation principale">']
    for i, (g, items) in enumerate(menu_groups().items()):
        out.append(f'<div class="dd"><button class="dd-btn" type="button" aria-expanded="false" aria-controls="dd-{i}">{g}'
                   f'<svg aria-hidden="true"><use href="#i-chev"/></svg></button><div class="dd-panel" id="dd-{i}">')
        out += [f'<a href="{u}"><b>{E(n)}</b><span>{E(h)}</span></a>' for u, n, h in items]
        out.append("</div></div>")
    out.append('<a href="/blog">Blog</a><a href="/#tarifs">Tarifs</a></nav>')
    return "".join(out)


def render_mobile_menu():
    out = []
    for g, items in menu_groups().items():
        out.append(f'  <details class="mm-group"><summary>{g}</summary>' +
                   "".join(f'<a href="{u}">{E(n)}</a>' for u, n, _ in items) + "</details>")
    out.append('  <a href="/blog">Blog</a>')
    out.append('  <a href="/#tarifs">Tarifs</a>')
    return "\n".join(out)


# ------------------------------------------------------------------ pages générées
def label_for(slug):
    fixed = {"bank-ready": ("Dossier bancaire", "Bank Ready"),
             "ressources/glossaire": ("Glossaire", "Ressources"),
             "ressources/verification-dip": ("Vérification DIP", "Ressources")}
    if slug in fixed:
        return fixed[slug]
    m = next(x for x in MODULES if x["slug"] == slug)
    return m["menu"], m["group"]


def module_body(m):
    grp_url = "/#cabinets" if m["group"] == "Cabinets" else "/#solutions"
    does = "".join(f"<div><dt>{E(t)}</dt><dd>{E(d)}</dd></div>" for t, d in m["does"])
    steps = ""
    if m["steps"]:
        steps = ('<section class="sec"><div class="wrap"><h2 class="h-sec" style="margin-bottom:28px">Comment ça marche.</h2><ol class="steps">' +
                 "".join(f"<li><div><h4>{E(t)}</h4><p>{E(d)}</p></div></li>" for t, d in m["steps"]) + "</ol></div></section>")
    status = "".join(f'<li><span>{E(t)}</span><span class="st st-{STATUS_CLASS[s]}">{E(s)}</span></li>' for t, s in m["status"])
    faq = "".join(f'<details><summary>{E(q)}<span class="pm" aria-hidden="true"></span></summary><p>{E(a)}</p></details>' for q, a in m["faq"])
    rel = ""
    for s in m["related"]:
        name, grp = label_for(s)
        rel += f'<a class="rel" href="/{s}"><span>{E(grp)}</span><b>{E(name)}</b></a>'
    return f"""<main id="main">
<section class="page-hero">
  <div class="hero-glow"></div>
  <div class="wrap mod-hero">
    <div>
      <div class="crumbs"><a href="/">AXINA</a> / <a href="{grp_url}">{m['group']}</a> / {E(m['menu'])}</div>
      <h1 class="h-hero" style="font-size:clamp(38px,5.2vw,68px)">{E(m['h1'])}</h1>
      <p class="lead" style="margin:22px 0 32px">{E(m['lead'])}</p>
      <div class="hero-ctas">
        <button class="btn btn-seal" type="button" data-open="m-contact" data-preset="{'Tester AXINA Cabinet (comptable)' if m['group'] == 'Cabinets' else 'Créer mon compte AXINA'}">{'Tester AXINA Cabinet' if m['group'] == 'Cabinets' else 'Créer mon compte gratuit'}</button>
        <a class="btn btn-ghost" href="/#tarifs">Voir les tarifs</a>
      </div>
    </div>
    <div class="status-card">
      <b>Où en est ce module</b>
      <ul>{status}</ul>
    </div>
  </div>
</section>
<section class="sec white"><div class="wrap">
  <h2 class="h-sec">Ce que vous y faites.</h2>
  <dl class="fund-grid">{does}</dl>
</div></section>
{steps}
<section class="sec white"><div class="wrap">
  <h2 class="h-sec" style="margin-bottom:28px">Questions fréquentes.</h2>
  <div class="faq">{faq}</div>
</div></section>
<section class="sec-tight"><div class="wrap">
  <h2 class="h-card" style="margin-bottom:16px">Explorez aussi</h2>
  <div class="rels">{rel}</div>
</div></section>
<section class="sec dark on-dark final"><div class="wrap"><div class="final-inner">
  <h2>Essayez avec vos propres chiffres.</h2>
  <div class="final-side"><p>Essentiel est gratuit. Business commence à 5 000 FCFA par mois, Cabinet Start à 15 000 FCFA.</p>
  <div class="hero-ctas"><button class="btn btn-seal" type="button" data-open="m-contact" data-preset="Créer mon compte AXINA">Demander l'accès</button><a class="btn btn-ghost" href="/demo">Voir la démo</a></div></div>
</div></div></section>
</main>
"""


def base(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()


def glossary_body():
    letters = sorted({base(t[0][0]).upper() for t in GLOSSARY})
    idx = "".join(f'<a href="#l-{l}">{l}</a>' for l in letters)
    items, cur = [], None
    for term, d in sorted(GLOSSARY, key=lambda x: base(x[0]).lower()):
        l = base(term[0]).upper()
        if l != cur:
            items.append(f'<h2 class="gl-letter" id="l-{l}">{l}</h2>')
            cur = l
        anchor = re.sub(r"[^a-z0-9]+", "-", base(term).lower()).strip("-")
        items.append(f'<div class="gl-item" id="{anchor}"><dt>{E(term)}</dt><dd>{E(d)}</dd></div>')
    return f"""<main id="main">
<section class="page-hero">
  <div class="hero-glow"></div>
  <div class="wrap">
    <div class="crumbs"><a href="/">AXINA</a> / Ressources / Glossaire</div>
    <h1 class="h-hero" style="font-size:clamp(40px,5.6vw,72px);max-width:16ch">La comptabilité OHADA, en mots simples.</h1>
    <p class="lead" style="margin-top:22px">Les termes que vous croisez dans AXINA, chez votre comptable ou à la banque, expliqués sans jargon.</p>
  </div>
</section>
<section class="sec white"><div class="wrap">
  <nav class="gl-index" aria-label="Lettres">{idx}</nav>
  <dl class="gl">{''.join(items)}</dl>
</div></section>
</main>
"""


# ------------------------------------------------------------------ assemblage
def text(s):
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", s)).split())


def faq_schema(body):
    qa = re.findall(r'<details><summary>(.*?)<span class="pm"[^>]*></span></summary><p>(.*?)</p></details>', body, re.S)
    if not qa:
        return None
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(a)}} for q, a in qa]}


LANGS = ("fr", "en", "es")
LOCALE = {"fr": "fr_FR", "en": "en_US", "es": "es_ES"}
NOT_TRANSLATED = re.compile(r'href="/(?!assets/|favicon|site\.webmanifest|sitemap|blog|en/|es/)([^"]*)"(?! hreflang=)')
from i18n import Translator, segments  # noqa: E402
TR = {l: Translator(ROOT, l) for l in LANGS if l != "fr"}
SEGMENTS = []


def page_url(lang, canonical):
    return SITE + ("" if lang == "fr" else lang + "/") + canonical


def lang_switch(langs, canonical, cur):
    out = []
    for l in LANGS:
        href = "/" + ("" if l == "fr" else l + "/") + (canonical if l in langs else "")
        cls = ' aria-current="true"' if l == cur else ""
        out.append(f'<a href="{href}" hreflang="{l}" lang="{l}"{cls}>{l.upper()}</a>')
    return '<div class="lang" role="navigation" aria-label="Langue">' + "".join(out) + "</div>"


def write(rel_path, meta, body, extra_graph=None, langs=LANGS):
    canonical = meta.get("canonical", "")
    head0 = PART["head"]
    fields = {
        "title": meta["title"], "description": meta["description"],
        "ogtitle": meta.get("ogtitle", meta["title"]), "ogimage": meta.get("ogimage", "og-axina.jpg"),
        "ogalt": meta.get("ogalt", "AXINA : comptabilité SYSCOHADA scellée, pilotage et financement"),
    }
    for k, v in fields.items():
        head0 = head0.replace("{{%s}}" % k, E(v, quote=True))
    alts = "".join(f'<link rel="alternate" hreflang="{l}" href="{page_url(l, canonical)}">\n' for l in langs)
    alts += f'<link rel="alternate" hreflang="x-default" href="{page_url("fr", canonical)}">'
    nav0 = PART["nav"].replace("{{navsolid}}", "").replace("{{menu}}", render_menu()).replace("{{mobilemenu}}", render_mobile_menu())
    done = []
    for lang in langs:
        tr = TR.get(lang)
        t = tr.t if tr else (lambda x: x)
        head = (head0.replace("{{lang}}", lang).replace("{{locale}}", LOCALE[lang]).replace("{{alternates}}", alts)
                .replace("{{canonicalurl}}", page_url(lang, canonical)).replace("{{v}}", VERSION))
        nav = nav0.replace("{{langs}}", lang_switch(langs, canonical, lang))
        page = head + "<body>\n" + nav + body + PART["footer"] + PART["modals"] + "</body>\n</html>\n"
        if lang == "fr":
            SEGMENTS.extend(segments(page))
        else:
            page = tr.html(page)
            page = NOT_TRANSLATED.sub(lambda m: f'href="/{lang}/{m.group(1)}"', page)
        # données structurées, construites dans la langue de la page
        org = dict(ORG, description=t(ORG["description"]))
        graph = [org, dict(WEBSITE, inLanguage=lang)]
        if rel_path == "index.html":
            graph.append(dict(APP, description=t(APP["description"]), url=page_url(lang, "")))
        else:
            crumbs = [{"@type": "ListItem", "position": 1, "name": "AXINA", "item": page_url(lang, "")}]
            if meta.get("group"):
                crumbs.append({"@type": "ListItem", "position": 2, "name": t(meta["group"]),
                               "item": page_url(lang, "#cabinets" if meta["group"] == "Cabinets" else "#solutions")})
            crumbs.append({"@type": "ListItem", "position": len(crumbs) + 1, "name": t(meta.get("crumb", meta["title"])),
                           "item": page_url(lang, canonical)})
            graph.append({"@type": "BreadcrumbList", "itemListElement": crumbs})
        bstart = page.index('<main id="main">') if '<main id="main">' in page else 0
        faq = faq_schema(page[bstart:page.index("</main>")] if "</main>" in page else body)
        if faq:
            graph.append(faq)
        if extra_graph:
            g = json.loads(json.dumps(extra_graph))
            if g.get("@type") == "DefinedTermSet":
                g["name"] = t(g["name"]); g["url"] = page_url(lang, canonical)
                for d in g["hasDefinedTerm"]:
                    d["name"], d["description"] = t(d["name"]), t(d["description"])
            graph.append(g)
        jsonld = '<script type="application/ld+json">' + json.dumps(
            {"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>"
        page = page.replace("{{jsonld}}", jsonld)
        dest = ROOT / ("" if lang == "fr" else lang) / rel_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(page, encoding="utf-8")
        done.append((lang, canonical))
    print(f"{rel_path}: {'/'.join(langs)} {len(page.encode()) / 1024:.1f} Ko")
    return done


urls = []
for page in sorted((SRC / "pages").rglob("*.html")):
    raw = page.read_text(encoding="utf-8")
    mm = re.match(r"---\n(.*?)\n---\n", raw, re.S)
    meta = {k.strip(): v.strip() for k, v in (l.split(":", 1) for l in mm.group(1).splitlines() if ":" in l)}
    urls.extend(write(str(page.relative_to(SRC / "pages")), meta, raw[mm.end():]))

for m in MODULES:
    meta = {"title": m["title"], "description": m["description"], "canonical": m["slug"],
            "crumb": m["menu"], "group": m["group"], "ogtitle": f"AXINA — {m['h1']}"}
    urls.extend(write(m["slug"] + ".html", meta, module_body(m)))

terms = {"@type": "DefinedTermSet", "name": "Glossaire AXINA de la comptabilité OHADA", "url": SITE + "ressources/glossaire",
         "hasDefinedTerm": [{"@type": "DefinedTerm", "name": t, "description": d} for t, d in GLOSSARY]}
urls.extend(write("ressources/glossaire.html", {
    "title": "Glossaire de la comptabilité OHADA et SYSCOHADA en mots simples | AXINA",
    "description": "Balance, grand livre, extourne, liasse, DSF, TVA collectée, visa : les termes de la comptabilité OHADA expliqués simplement.",
    "canonical": "ressources/glossaire", "crumb": "Glossaire",
    "ogtitle": "La comptabilité OHADA, en mots simples"}, glossary_body(), terms))

# ------------------------------------------------------------------ blog
import blog  # noqa: E402
posts = blog.load(ROOT)
urls.extend(write("blog.html", {
    "title": "Blog AXINA : comptabilité, fiscalité et financement dans l'espace OHADA",
    "description": "Réformes, facture électronique, TVA, crédit bancaire, métier du cabinet : des articles courts et sourcés pour les dirigeants et comptables de l'espace OHADA.",
    "canonical": "blog", "crumb": "Blog", "ogtitle": "Blog AXINA — la comptabilité OHADA, chaque semaine"}, blog.list_body(posts),
    {"@type": "Blog", "name": "Blog AXINA", "url": SITE + "blog", "inLanguage": "fr"}, langs=("fr",)))
for i, p in enumerate(posts):
    nxt = posts[i - 1] if i > 0 else None          # plus récent
    prev = posts[i + 1] if i + 1 < len(posts) else None  # plus ancien
    urls.extend(write(f"blog/{p['slug']}.html", {
        "title": p["title"] + " | Blog AXINA", "description": p["description"], "canonical": f"blog/{p['slug']}",
        "crumb": p["title"], "ogtitle": p["title"]}, blog.post_body(p, prev, nxt, SITE, label_for), blog.schema(p, SITE), langs=("fr",)))
(ROOT / "blog").mkdir(exist_ok=True)
(ROOT / "blog/feed.xml").write_text(blog.feed(posts, SITE), encoding="utf-8")

today = datetime.date.today().isoformat()
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
by_url = {}
for l, u in urls:
    by_url.setdefault(u, set()).add(l)
for u in sorted(by_url, key=lambda x: (x != "", x)):
    ls = [l for l in LANGS if l in by_url[u]]
    links = "".join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{page_url(x, u)}"/>' for x in ls) if len(ls) > 1 else ""
    for l in ls:
        sm.append(f"  <url><loc>{page_url(l, u)}</loc>{links}<lastmod>{today}</lastmod><priority>{'1.0' if u == '' else '0.8'}</priority></url>")
sm.append("</urlset>")
(ROOT / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
print("sitemap.xml:", len(sm) - 3, "URL")

# segments à traduire (référence) et phrases manquantes par langue
seen, uniq = set(), []
for x in SEGMENTS:
    if x not in seen:
        seen.add(x); uniq.append(x)
(ROOT / "tools/i18n").mkdir(exist_ok=True)
(ROOT / "tools/i18n/_segments_fr.json").write_text(json.dumps(uniq, ensure_ascii=False, indent=0), encoding="utf-8")
for l, tr in TR.items():
    miss = sorted(tr.missing)
    (ROOT / f"tools/i18n/_missing_{l}.json").write_text(json.dumps(miss, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"{l}: {len(miss)} phrase(s) sans traduction")
