# Blog AXINA : procédure de publication

Rythme : un article par semaine. Pas d'article publié sans relecture humaine.

## Écrire un article

1. Créer `content/blog/AAAA-MM-JJ-mot-cle-du-sujet.md` (le nom après la date devient l'adresse `/blog/mot-cle-du-sujet`).
2. En-tête obligatoire :

```
---
title: Titre clair, la question que se pose un dirigeant (65 caractères visés)
description: Résumé de 140 à 160 caractères, utilisé par Google et les aperçus de partage.
date: AAAA-MM-JJ
category: Fiscalité | Comptabilité | Financement | Cabinets | Actualité
tags: mot, mot, mot
related: entreprises/facturation   (une page du site : entreprises/…, cabinets/…, bank-ready, ressources/glossaire)
---
```

3. Corps en Markdown : intertitres `##`, listes, tableaux. Terminer par `## Sources`, une source par ligne : `- Titre, date : URL`.

## Règles de fond (non négociables)

- Chaque règle comptable ou fiscale cite sa source : SYSCOHADA, AUDCIF (avec l'article), code général des impôts du pays, communiqué officiel.
- Une date ou un taux qu'on n'a pas pu vérifier ne s'écrit pas. On écrit « à vérifier auprès de la DGI » plutôt qu'un chiffre incertain.
- Vocabulaire : « scellé », « vérifiable », « traçable ». Jamais « garanti », « certifié par AXINA », « opposable » comme état, « non falsifiable ».
- Aucune promesse : AXINA ne garantit ni un financement, ni l'absence de redressement.
- Ce qu'AXINA ne fait pas encore se dit (ex. transmission aux plateformes fiscales).
- Phrases simples. Un article = une question, une réponse utile, un lien vers la page AXINA concernée.

## Publier

1. Générer : `pip install -r tools/requirements.txt` puis `python3 tools/build.py`.
2. Ouvrir une pull request sur `main` avec l'article et les fichiers générés (`blog.html`, `blog/…`, `sitemap.xml`, `blog/feed.xml`).
3. Relecture humaine, puis fusion : Vercel met en ligne.
4. Posts réseaux sociaux (LinkedIn, X, Facebook) : préparés dans la description de la pull request, publiés après la mise en ligne. Le flux `https://axina.pro/blog/feed.xml` peut alimenter un outil de programmation.
