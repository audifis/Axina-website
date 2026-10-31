# AXINA — site axina.pro

Site statique (HTML, CSS, JS sans dépendance), servi par Vercel.

- `src/pages/*.html` : contenu des pages (en-tête YAML : titre, description, URL canonique).
- `src/partials/*.html` : en-tête, navigation, pied de page, fenêtres (contact, vérification).
- `assets/` : `axina.css`, `axina.js`, polices hébergées (SIL OFL), images WebP.
- Générer les pages à la racine : `python3 tools/build.py`, puis committer les `.html` générés.

Le formulaire envoie à Formspree. « Vérifier un document » ouvre le registre de vérification AXINA avec le code du QR.
