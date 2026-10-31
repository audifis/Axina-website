"""Blog : content/blog/*.md -> blog.html (liste + recherche), blog/<slug>.html, blog/feed.xml.

Format d'un article (front matter simple, une clé par ligne) :
---
title: ...
description: ... (150 caractères environ, sert pour Google et le partage)
date: AAAA-MM-JJ
category: Fiscalité | Comptabilité | Financement | Cabinets | Actualité
tags: mot, mot
related: chemin/de/page (ex. entreprises/facturation, bank-ready)
---
Corps en Markdown. Terminer par une section « ## Sources » (une source par ligne : titre : URL).
"""
import datetime
import html
import json
import pathlib
import re

import markdown

E = html.escape
MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


def fr_date(d):
    return f"{d.day} {MONTHS[d.month - 1]} {d.year}"


def load(root):
    posts = []
    for f in sorted((root / "content/blog").glob("[0-9][0-9][0-9][0-9]-*.md")):
        raw = f.read_text(encoding="utf-8")
        m = re.match(r"---\n(.*?)\n---\n", raw, re.S)
        meta = {k.strip(): v.strip() for k, v in (l.split(":", 1) for l in m.group(1).splitlines() if ":" in l)}
        body_md = raw[m.end():]
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", f.stem)
        # liens bruts des sources rendus cliquables
        body_md = re.sub(r"(?<![\(<])(https?://[^\s)<]+)", r"<\1>", body_md)
        body = markdown.markdown(body_md, extensions=["tables", "sane_lists"])
        body = body.replace('<a href="http', '<a rel="noopener" target="_blank" href="http')
        words = len(re.sub(r"<[^>]+>", " ", body).split())
        posts.append({
            "slug": slug, "title": meta["title"], "description": meta["description"],
            "date": datetime.date.fromisoformat(meta["date"]), "category": meta.get("category", "Actualité"),
            "tags": [t.strip() for t in meta.get("tags", "").split(",") if t.strip()],
            "related": meta.get("related", ""), "body": body, "minutes": max(2, round(words / 200)), "file": f.name,
        })
    posts.sort(key=lambda p: (p["date"], p["file"]), reverse=True)
    return posts


def share_links(url, title):
    from urllib.parse import quote
    u, t = quote(url, safe=""), quote(title, safe="")
    return (f'<a href="https://www.linkedin.com/sharing/share-offsite/?url={u}" target="_blank" rel="noopener">LinkedIn</a>'
            f'<a href="https://x.com/intent/post?url={u}&amp;text={t}" target="_blank" rel="noopener">X</a>'
            f'<a href="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener">Facebook</a>'
            f'<a href="https://wa.me/?text={t}%20{u}" target="_blank" rel="noopener">WhatsApp</a>')


def card(p):
    return (f'<a class="post-card" href="/blog/{p["slug"]}" data-search="{E((p["title"] + " " + p["description"] + " " + " ".join(p["tags"]) + " " + p["category"]).lower())}" data-cat="{E(p["category"])}">'
            f'<span class="post-meta"><b>{E(p["category"])}</b>{fr_date(p["date"])} · {p["minutes"]} min</span>'
            f'<h3>{E(p["title"])}</h3><p>{E(p["description"])}</p></a>')


def list_body(posts):
    cats = sorted({p["category"] for p in posts})
    chips = '<button type="button" class="chip" aria-pressed="true" data-cat="">Tous</button>' + "".join(
        f'<button type="button" class="chip" aria-pressed="false" data-cat="{E(c)}">{E(c)}</button>' for c in cats)
    return f"""<main id="main">
<section class="page-hero" style="padding-bottom:70px">
  <div class="hero-glow"></div>
  <div class="wrap">
    <div class="crumbs"><a href="/">AXINA</a> / Blog</div>
    <h1 class="h-hero" style="font-size:clamp(40px,5.6vw,72px);max-width:17ch">La comptabilité OHADA, chaque semaine.</h1>
    <p class="lead" style="margin-top:22px">Réformes, fiscalité, financement, métier du cabinet. Des articles courts, sourcés, écrits pour les dirigeants et les comptables de l'espace OHADA.</p>
  </div>
</section>
<section class="sec-tight">
  <div class="wrap">
    <div class="blog-tools">
      <label class="search"><svg aria-hidden="true"><use href="#i-search"/></svg><span class="sr-only">Rechercher un article</span><input id="blog-q" type="search" placeholder="Rechercher : TVA, facture électronique, crédit…" autocomplete="off"></label>
      <div class="chips" role="group" aria-label="Catégories">{chips}</div>
    </div>
    <p class="small muted" id="blog-count" aria-live="polite">{len(posts)} articles</p>
    <div class="post-grid" id="blog-list">{"".join(card(p) for p in posts)}</div>
    <p class="muted" id="blog-empty" hidden>Aucun article ne correspond. Essayez un autre mot, ou <a class="link" href="/ressources/glossaire">le glossaire</a>.</p>
    <p class="small muted" style="margin-top:30px">Nos articles expliquent, ils ne remplacent pas le conseil de votre cabinet. Chaque règle citée porte sa source. <a class="link" href="/blog/feed.xml">Flux RSS</a></p>
  </div>
</section>
</main>
"""


def post_body(p, prev, nxt, site, label_for):
    url = f"{site}blog/{p['slug']}"
    tags = "".join(f"<span>{E(t)}</span>" for t in p["tags"])
    rel = ""
    if p["related"]:
        try:
            name, grp = label_for(p["related"])
            rel = f'<a class="rel" href="/{p["related"]}"><span>{E(grp)}</span><b>{E(name)}</b></a>'
        except StopIteration:
            rel = ""
    nav = '<nav class="post-nav" aria-label="Articles">'
    nav += (f'<a href="/blog/{prev["slug"]}"><span>Article précédent</span><b>{E(prev["title"])}</b></a>' if prev else "<span></span>")
    nav += (f'<a class="next" href="/blog/{nxt["slug"]}"><span>Article suivant</span><b>{E(nxt["title"])}</b></a>' if nxt else "<span></span>")
    nav += "</nav>"
    return f"""<main id="main">
<article>
<header class="page-hero post-hero">
  <div class="hero-glow"></div>
  <div class="wrap narrow">
    <div class="crumbs"><a href="/">AXINA</a> / <a href="/blog">Blog</a> / {E(p['category'])}</div>
    <h1>{E(p['title'])}</h1>
    <p class="lead" style="margin-top:18px">{E(p['description'])}</p>
    <p class="post-by">Équipe AXINA · <time datetime="{p['date'].isoformat()}">{fr_date(p['date'])}</time> · {p['minutes']} min de lecture</p>
  </div>
</header>
<div class="sec-tight white"><div class="wrap narrow">
  <div class="prose">{p['body']}</div>
  <div class="post-tags">{tags}</div>
  <div class="share"><b>Partager</b>{share_links(url, p['title'])}</div>
  {('<h2 class="h-card" style="margin:36px 0 14px">Pour aller plus loin</h2><div class="rels" style="grid-template-columns:1fr">' + rel + '</div>') if rel else ''}
  {nav}
</div></div>
</article>
<section class="sec dark on-dark final"><div class="wrap"><div class="final-inner">
  <h2>Une comptabilité qui tient la route, toute l'année.</h2>
  <div class="final-side"><p>Essentiel est gratuit. Business à 5 000 FCFA par mois, avec votre cabinet connecté.</p>
  <div class="hero-ctas"><button class="btn btn-seal" type="button" data-open="m-contact" data-preset="Créer mon compte AXINA">Créer mon compte gratuit</button><a class="btn btn-ghost" href="/blog">Tous les articles</a></div></div>
</div></div></section>
</main>
"""


def feed(posts, site):
    items = "".join(
        f"<item><title>{E(p['title'])}</title><link>{site}blog/{p['slug']}</link><guid>{site}blog/{p['slug']}</guid>"
        f"<pubDate>{datetime.datetime.combine(p['date'], datetime.time(8)).strftime('%a, %d %b %Y %H:%M:%S +0000')}</pubDate>"
        f"<category>{E(p['category'])}</category><description>{E(p['description'])}</description></item>" for p in posts)
    return ('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Blog AXINA</title>'
            f"<link>{site}blog</link><description>La comptabilité OHADA, chaque semaine.</description><language>fr</language>{items}</channel></rss>\n")


def schema(p, site):
    return {"@type": "BlogPosting", "headline": p["title"], "description": p["description"],
            "datePublished": p["date"].isoformat(), "dateModified": p["date"].isoformat(), "inLanguage": "fr",
            "mainEntityOfPage": f"{site}blog/{p['slug']}", "image": f"{site}assets/img/og-axina.jpg",
            "author": {"@type": "Organization", "name": "AXINA", "url": site},
            "publisher": {"@id": site + "#organisation"}, "keywords": ", ".join(p["tags"])}
