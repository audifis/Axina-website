"""Traduction des pages générées : chaque texte visible (et quelques attributs) est cherché dans
tools/i18n/<lang>.json, un dictionnaire « phrase française -> traduction ».

Une phrase absente du dictionnaire reste en français et est signalée par build.py (« manquantes »).
Les blocs <script> et <style> ne sont jamais touchés.
"""
import html
import json
import pathlib
import re

ATTRS = ("alt", "placeholder", "aria-label", "title", "data-preset", "content")
META_CONTENT = re.compile(r'<meta\s+(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)"')
TAG = re.compile(r"(<!--.*?-->|<[^>]+>)", re.S)
SKIP = {"AXINA", "SHA-256", "DIP v1.0.2", "OHADA", "SYSCOHADA", "FCFA", "WhatsApp", "LinkedIn", "X", "Facebook", "Bank Ready",
        "FR", "EN", "ES", "Premium", "Business", "Essentiel", "Enterprise", "Start", "Pro"}


def norm(s):
    return " ".join(html.unescape(s).split())


def worth(s):
    t = norm(s)
    if not t or t in SKIP:
        return False
    return len(re.findall(r"[A-Za-zÀ-ÿ]", t)) >= 2 and not re.fullmatch(r"[A-Z]{2,4}", t)


def _attr_iter(tag):
    for a in ATTRS:
        for m in re.finditer(r'\s%s="([^"]*)"' % a, tag):
            yield a, m


def segments(page_html):
    """Textes et attributs traduisibles d'une page, dans l'ordre d'apparition."""
    out, skip = [], False
    for part in TAG.split(page_html):
        if part.startswith("<"):
            low = part[:8].lower()
            if low.startswith("<script") or low.startswith("<style"):
                skip = True
            elif low.startswith("</script") or low.startswith("</style"):
                skip = False
            for a, m in _attr_iter(part):
                if a == "content" and not META_CONTENT.match(part):
                    continue
                if worth(m.group(1)):
                    out.append(norm(m.group(1)))
        elif not skip and worth(part):
            out.append(norm(part))
    return out


class Translator:
    def __init__(self, root, lang):
        self.lang = lang
        p = pathlib.Path(root) / "tools/i18n" / f"{lang}.json"
        self.table = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
        self.missing = set()

    def t(self, s):
        k = norm(s)
        if not worth(k):
            return s
        v = self.table.get(k)
        if v is None:
            self.missing.add(k)
            return s
        return v

    def html(self, page_html):
        res, skip = [], False
        for part in TAG.split(page_html):
            if part.startswith("<"):
                low = part[:8].lower()
                if low.startswith("<script") or low.startswith("<style"):
                    skip = True
                elif low.startswith("</script") or low.startswith("</style"):
                    skip = False

                def rep(m):
                    a, val = m.group(1), m.group(2)
                    if a == "content" and not META_CONTENT.match(part):
                        return m.group(0)
                    if not worth(val):
                        return m.group(0)
                    return ' %s="%s"' % (a, html.escape(self.t(val), quote=True))
                part = re.sub(r'\s(%s)="([^"]*)"' % "|".join(ATTRS), rep, part)
                res.append(part)
            elif skip or not worth(part):
                res.append(part)
            else:
                lead = part[: len(part) - len(part.lstrip())]
                tail = part[len(part.rstrip()):]
                tr = self.t(part)
                res.append(part if tr is part else lead + html.escape(tr, quote=False) + tail)
        return "".join(res)
