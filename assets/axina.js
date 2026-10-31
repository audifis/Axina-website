/* AXINA — interactions du site (sans dépendance). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG = (document.documentElement.lang || 'fr').slice(0, 2);
  var I18N = {"en": {"Code introuvable dans votre saisie. Collez le lien du QR code ou le code de vérification imprimé sur le document.": "No code found in what you entered. Paste the QR code link or the verification code printed on the document.", "Ouverture du registre de vérification…": "Opening the verification register…", "Envoi…": "Sending…", "Demande envoyée. Nous revenons vers vous rapidement.": "Request sent. We will get back to you shortly.", "L'envoi n'a pas abouti. Réessayez, ou écrivez-nous sur": "Sending failed. Try again, or write to us on", "Envoyer ma demande": "Send my request", "Préparer un dossier de financement solide.": "Build a solid financing file.", "AXINA tient votre comptabilité OHADA au fil de l'eau et assemble un dossier bancaire à partir de chiffres scellés et vérifiables. La décision reste à la banque, mais elle lit un dossier propre.": "AXINA keeps your OHADA accounts as you go and assembles a bank file from sealed, verifiable figures. The decision stays with the bank, but it reads a clean file.", "États financiers SYSCOHADA à jour": "Up-to-date SYSCOHADA financial statements", "Ratios et indicateurs déjà calculés": "Ratios and indicators already calculated", "Dossiers bancaires illimités avec l'offre Premium": "Unlimited bank files with the Premium plan", "Voir le dossier Bank Ready": "See the Bank Ready file", "Comprendre ce que disent vos chiffres.": "Understand what your figures say.", "Le score AXINA se calcule à partir de votre trésorerie, de la régularité de vos écritures et de l'intégrité de votre grand livre. C'est un indicateur, pas une note de crédit.": "The AXINA score is calculated from your cash, the regularity of your entries and the integrity of your ledger. It is an indicator, not a credit rating.", "Trésorerie, marges et dettes en temps réel": "Cash, margins and debts in real time", "Alertes quand un indicateur se dégrade": "Alerts when an indicator deteriorates", "Explication de chaque alerte en langage clair": "Each alert explained in plain language", "Voir la démo": "See the demo", "Un atelier de production pour votre portefeuille.": "A production workshop for your portfolio.", "AXINA Cabinet relie votre cabinet aux entreprises clientes abonnées, sous mandat. Vos collaborateurs préparent, révisent, visent et scellent les dossiers dans une même bannette.": "AXINA for Firms connects your firm to subscribed client companies, under mandate. Your staff prepare, review, sign off and seal files in one work queue.", "De 5 à 60 entreprises connectées selon la formule": "From 5 to 60 connected companies depending on the plan", "Préparation, révision, visa et scellement tracés": "Preparation, review, sign-off and sealing, all traced", "Accès limité au périmètre du mandat signé": "Access limited to the scope of the signed mandate", "Voir les tarifs Cabinet": "See firm pricing", "Rendre chaque franc traçable.": "Make every franc traceable.", "Pour les ONG, entreprises publiques et administrations, AXINA suit les budgets par projet, programme ou entité, et rattache chaque dépense à sa pièce et à son écriture.": "For NGOs, state-owned companies and public administrations, AXINA tracks budgets by project, programme or entity, and links every expense to its document and its entry.", "Budgets par projet, bailleur ou programme": "Budgets by project, donor or programme", "Rapports scellés, vérifiables par QR code": "Sealed reports, verifiable by QR code", "Déploiement et tarif adaptés à votre organisation": "Deployment and pricing suited to your organisation", "Voir les offres institutions": "See institution plans", "Toute votre gestion au même endroit.": "All your management in one place.", "Facturation, trésorerie, comptabilité OHADA et tableau de bord : AXINA enregistre chaque opération une fois et en tire vos journaux, votre balance et vos états.": "Invoicing, cash, OHADA accounting and dashboard: AXINA records each transaction once and derives your journals, trial balance and statements from it.", "Offre Essentiel gratuite pour démarrer": "Free Essentiel plan to get started", "Business à 5 000 FCFA par mois": "Business at 5,000 FCFA a month", "Connexion à votre cabinet en temps réel dès Business": "Real-time connection to your firm from Business", "Voir les tarifs": "See pricing", "Écrire sur WhatsApp": "Write on WhatsApp", "Cabinet Start": "Firm Start", "Cabinet Business": "Firm Business", "Cabinet Pro": "Firm Pro", "Cabinet Premium": "Firm Premium", "Cabinet Enterprise": "Firm Enterprise", "15 000 FCFA / mois": "15,000 FCFA / month", "30 000 FCFA / mois": "30,000 FCFA / month", "50 000 FCFA / mois": "50,000 FCFA / month", "90 000 FCFA / mois": "90,000 FCFA / month", "Sur devis": "On quote", "plus de 60": "more than 60", "Masquer l'explication": "Hide the explanation", "Pourquoi cette alerte ?": "Why this alert?", "Relancer l'assemblage": "Run the assembly again", "Facture FV-0418 · Ndiaye Distribution": "Invoice FV-0418 · Ndiaye Distribution", "Encaissement virement CBAO": "CBAO transfer received", "Achat marchandises · Sotiba": "Goods purchase · Sotiba", "Salaires d'octobre": "October salaries", "Facture FV-0419 · Kaba Services": "Invoice FV-0419 · Kaba Services", "Règlement fournisseur Sotiba": "Supplier payment Sotiba", "Loyer et charges · novembre": "Rent and charges · November", "TVA collectée · octobre": "Output VAT · October", "scellement…": "sealing…", "Empreinte SHA-256 : ": "SHA-256 fingerprint: ", " articles": " articles", " article": " article", "n° ": "no. "}, "es": {"Code introuvable dans votre saisie. Collez le lien du QR code ou le code de vérification imprimé sur le document.": "No se encontró ningún código. Pegue el enlace del código QR o el código de verificación impreso en el documento.", "Ouverture du registre de vérification…": "Abriendo el registro de verificación…", "Envoi…": "Enviando…", "Demande envoyée. Nous revenons vers vous rapidement.": "Solicitud enviada. Le responderemos en breve.", "L'envoi n'a pas abouti. Réessayez, ou écrivez-nous sur": "El envío no se completó. Inténtelo de nuevo o escríbanos por", "Envoyer ma demande": "Enviar mi solicitud", "Préparer un dossier de financement solide.": "Preparar un expediente de financiación sólido.", "AXINA tient votre comptabilité OHADA au fil de l'eau et assemble un dossier bancaire à partir de chiffres scellés et vérifiables. La décision reste à la banque, mais elle lit un dossier propre.": "AXINA lleva su contabilidad OHADA al día y arma un expediente bancario a partir de cifras selladas y verificables. La decisión sigue siendo del banco, pero lee un expediente limpio.", "États financiers SYSCOHADA à jour": "Estados financieros SYSCOHADA al día", "Ratios et indicateurs déjà calculés": "Ratios e indicadores ya calculados", "Dossiers bancaires illimités avec l'offre Premium": "Expedientes bancarios ilimitados con el plan Premium", "Voir le dossier Bank Ready": "Ver el expediente Bank Ready", "Comprendre ce que disent vos chiffres.": "Entender lo que dicen sus cifras.", "Le score AXINA se calcule à partir de votre trésorerie, de la régularité de vos écritures et de l'intégrité de votre grand livre. C'est un indicateur, pas une note de crédit.": "La puntuación AXINA se calcula a partir de su tesorería, la regularidad de sus asientos y la integridad de su libro mayor. Es un indicador, no una calificación crediticia.", "Trésorerie, marges et dettes en temps réel": "Tesorería, márgenes y deudas en tiempo real", "Alertes quand un indicateur se dégrade": "Alertas cuando un indicador se deteriora", "Explication de chaque alerte en langage clair": "Cada alerta explicada en lenguaje claro", "Voir la démo": "Ver la demo", "Un atelier de production pour votre portefeuille.": "Un taller de producción para su cartera.", "AXINA Cabinet relie votre cabinet aux entreprises clientes abonnées, sous mandat. Vos collaborateurs préparent, révisent, visent et scellent les dossiers dans une même bannette.": "AXINA Despachos conecta su despacho con las empresas clientes suscritas, bajo mandato. Sus colaboradores preparan, revisan, visan y sellan los expedientes en una misma bandeja.", "De 5 à 60 entreprises connectées selon la formule": "De 5 a 60 empresas conectadas según el plan", "Préparation, révision, visa et scellement tracés": "Preparación, revisión, visado y sellado trazados", "Accès limité au périmètre du mandat signé": "Acceso limitado al alcance del mandato firmado", "Voir les tarifs Cabinet": "Ver los precios para despachos", "Rendre chaque franc traçable.": "Hacer trazable cada franco.", "Pour les ONG, entreprises publiques et administrations, AXINA suit les budgets par projet, programme ou entité, et rattache chaque dépense à sa pièce et à son écriture.": "Para ONG, empresas públicas y administraciones, AXINA sigue los presupuestos por proyecto, programa o entidad, y vincula cada gasto a su justificante y a su asiento.", "Budgets par projet, bailleur ou programme": "Presupuestos por proyecto, donante o programa", "Rapports scellés, vérifiables par QR code": "Informes sellados, verificables por código QR", "Déploiement et tarif adaptés à votre organisation": "Despliegue y precio adaptados a su organización", "Voir les offres institutions": "Ver los planes para instituciones", "Toute votre gestion au même endroit.": "Toda su gestión en un mismo lugar.", "Facturation, trésorerie, comptabilité OHADA et tableau de bord : AXINA enregistre chaque opération une fois et en tire vos journaux, votre balance et vos états.": "Facturación, tesorería, contabilidad OHADA y panel: AXINA registra cada operación una vez y obtiene de ella sus diarios, su balance y sus estados.", "Offre Essentiel gratuite pour démarrer": "Plan Essentiel gratuito para empezar", "Business à 5 000 FCFA par mois": "Business a 5 000 FCFA al mes", "Connexion à votre cabinet en temps réel dès Business": "Conexión en tiempo real con su despacho desde Business", "Voir les tarifs": "Ver los precios", "Écrire sur WhatsApp": "Escribir por WhatsApp", "Cabinet Start": "Despacho Start", "Cabinet Business": "Despacho Business", "Cabinet Pro": "Despacho Pro", "Cabinet Premium": "Despacho Premium", "Cabinet Enterprise": "Despacho Enterprise", "15 000 FCFA / mois": "15 000 FCFA / mes", "30 000 FCFA / mois": "30 000 FCFA / mes", "50 000 FCFA / mois": "50 000 FCFA / mes", "90 000 FCFA / mois": "90 000 FCFA / mes", "Sur devis": "Bajo presupuesto", "plus de 60": "más de 60", "Masquer l'explication": "Ocultar la explicación", "Pourquoi cette alerte ?": "¿Por qué esta alerta?", "Relancer l'assemblage": "Volver a armar", "Facture FV-0418 · Ndiaye Distribution": "Factura FV-0418 · Ndiaye Distribution", "Encaissement virement CBAO": "Cobro de transferencia CBAO", "Achat marchandises · Sotiba": "Compra de mercancías · Sotiba", "Salaires d'octobre": "Salarios de octubre", "Facture FV-0419 · Kaba Services": "Factura FV-0419 · Kaba Services", "Règlement fournisseur Sotiba": "Pago a proveedor Sotiba", "Loyer et charges · novembre": "Alquiler y gastos · noviembre", "TVA collectée · octobre": "IVA repercutido · octubre", "scellement…": "sellando…", "Empreinte SHA-256 : ": "Huella SHA-256: ", " articles": " artículos", " article": " artículo", "n° ": "n.º "}};
  var T = function (t) { var d = I18N[LANG]; return (d && d[t]) || t; };
  var P = function (h) { return LANG !== 'fr' && h.charAt(0) === '/' ? '/' + LANG + h : h; };
  var VERIFY_URL = 'https://verify.axina.online/?token=';
  var WA = 'https://wa.me/240222619606?text=';

  /* Navigation */
  var nav = $('.nav');
  function onScroll() { if (nav) nav.classList.toggle('is-solid', window.scrollY > 24 || nav.hasAttribute('data-solid')); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var burger = $('.burger'), menu = $('.mobile-menu');
  function closeMenu() { if (!menu) return; menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      if (open) nav.classList.add('is-solid');
    });
    $$('a, button', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* Menus déroulants : clic (tactile, clavier) ; survol géré en CSS */
  var dds = $$('.dd');
  dds.forEach(function (d) {
    var b = $('.dd-btn', d);
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('open');
      dds.forEach(function (x) { x.classList.remove('open'); $('.dd-btn', x).setAttribute('aria-expanded', 'false'); });
      d.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function () { dds.forEach(function (x) { x.classList.remove('open'); $('.dd-btn', x).setAttribute('aria-expanded', 'false'); }); });

  /* Modales */
  var lastFocus = null;
  function openModal(id, preset) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (preset && id === 'm-contact') { var s = $('#f-objet'); if (s) s.value = preset; }
    var f = $('input, select, textarea, button.modal-close', m);
    setTimeout(function () { if (f) f.focus(); }, 30);
  }
  function closeModal(m) {
    m.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openModal(b.getAttribute('data-open'), b.getAttribute('data-preset')); });
  });
  $$('.modal').forEach(function (m) {
    $$('.modal-bg, .modal-close', m).forEach(function (c) { c.addEventListener('click', function () { closeModal(m); }); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $$('.modal.open').forEach(closeModal);
  });

  /* Vérification d'un document : code ou lien du QR */
  var vf = $('#verify-form');
  if (vf) vf.addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = ($('#verify-input').value || '').trim();
    var m = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    var st = $('#verify-status');
    if (!m) {
      st.className = 'status err';
      st.textContent = T('Code introuvable dans votre saisie. Collez le lien du QR code ou le code de vérification imprimé sur le document.');
      return;
    }
    st.className = 'status ok';
    st.textContent = T('Ouverture du registre de vérification…');
    window.open(VERIFY_URL + encodeURIComponent(m[0]), '_blank', 'noopener');
  });

  /* Formulaire de contact (Formspree) */
  var cf = $('#contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('button[type=submit]', cf), st = $('.status', cf);
    btn.disabled = true; btn.textContent = T('Envoi…');
    st.className = 'status';
    var email = $('input[name=email]', cf);
    var rt = $('input[name=_replyto]', cf);
    if (rt && email) rt.value = email.value;
    fetch(cf.action, { method: 'POST', body: new FormData(cf), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('http');
        st.className = 'status ok';
        st.textContent = T('Demande envoyée. Nous revenons vers vous rapidement.');
        cf.reset();
      })
      .catch(function () {
        st.className = 'status err';
        st.innerHTML = T('L\'envoi n\'a pas abouti. Réessayez, ou écrivez-nous sur') + ' <a href="' + WA + 'Bonjour%20AXINA" target="_blank" rel="noopener">WhatsApp</a>.';
      })
      .then(function () { btn.disabled = false; btn.textContent = T('Envoyer ma demande'); });
  });

  /* Onglets génériques (univers, tarifs, démo) */
  $$('[data-tabs]').forEach(function (group) {
    var tabs = $$('[role=tab]', group);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* Guide : situation → réponse */
  var GUIDE = {
    finance: {
      t: T('Préparer un dossier de financement solide.'),
      p: T('AXINA tient votre comptabilité OHADA au fil de l\'eau et assemble un dossier bancaire à partir de chiffres scellés et vérifiables. La décision reste à la banque, mais elle lit un dossier propre.'),
      l: [T('États financiers SYSCOHADA à jour'), T('Ratios et indicateurs déjà calculés'), T('Dossiers bancaires illimités avec l\'offre Premium')],
      cta: T('Voir le dossier Bank Ready'), href: P('/bank-ready'),
      wa: 'Bonjour%2C%20je%20veux%20pr%C3%A9parer%20un%20dossier%20de%20financement%20avec%20AXINA'
    },
    score: {
      t: T('Comprendre ce que disent vos chiffres.'),
      p: T('Le score AXINA se calcule à partir de votre trésorerie, de la régularité de vos écritures et de l\'intégrité de votre grand livre. C\'est un indicateur, pas une note de crédit.'),
      l: [T('Trésorerie, marges et dettes en temps réel'), T('Alertes quand un indicateur se dégrade'), T('Explication de chaque alerte en langage clair')],
      cta: T('Voir la démo'), href: P('/demo'),
      wa: 'Bonjour%2C%20je%20veux%20comprendre%20mon%20score%20AXINA'
    },
    cabinet: {
      t: T('Un atelier de production pour votre portefeuille.'),
      p: T('AXINA Cabinet relie votre cabinet aux entreprises clientes abonnées, sous mandat. Vos collaborateurs préparent, révisent, visent et scellent les dossiers dans une même bannette.'),
      l: [T('De 5 à 60 entreprises connectées selon la formule'), T('Préparation, révision, visa et scellement tracés'), T('Accès limité au périmètre du mandat signé')],
      cta: T('Voir les tarifs Cabinet'), href: '#tarifs', tab: 'pt-cab',
      wa: 'Bonjour%2C%20je%20suis%20un%20cabinet%20et%20je%20veux%20utiliser%20AXINA'
    },
    gov: {
      t: T('Rendre chaque franc traçable.'),
      p: T('Pour les ONG, entreprises publiques et administrations, AXINA suit les budgets par projet, programme ou entité, et rattache chaque dépense à sa pièce et à son écriture.'),
      l: [T('Budgets par projet, bailleur ou programme'), T('Rapports scellés, vérifiables par QR code'), T('Déploiement et tarif adaptés à votre organisation')],
      cta: T('Voir les offres institutions'), href: '#tarifs', tab: 'pt-inst',
      wa: 'Bonjour%2C%20je%20veux%20en%20savoir%20plus%20sur%20AXINA%20pour%20mon%20organisation'
    },
    business: {
      t: T('Toute votre gestion au même endroit.'),
      p: T('Facturation, trésorerie, comptabilité OHADA et tableau de bord : AXINA enregistre chaque opération une fois et en tire vos journaux, votre balance et vos états.'),
      l: [T('Offre Essentiel gratuite pour démarrer'), T('Business à 5 000 FCFA par mois'), T('Connexion à votre cabinet en temps réel dès Business')],
      cta: T('Voir les tarifs'), href: '#tarifs', tab: 'pt-ent',
      wa: 'Bonjour%2C%20je%20veux%20structurer%20mon%20entreprise%20avec%20AXINA'
    }
  };
  var ans = $('#guide-answer');
  $$('.guide-opt').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = GUIDE[b.getAttribute('data-k')];
      if (!g || !ans) return;
      $$('.guide-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      ans.innerHTML = '<div><h3>' + g.t + '</h3><p>' + g.p + '</p><ul>' + g.l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="guide-actions"><a class="btn btn-seal" href="' + g.href + '"' + (g.tab ? ' data-goto="' + g.tab + '"' : '') + '>' + g.cta + '</a>' +
        '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + WA + g.wa + '">' + T('Écrire sur WhatsApp') + '</a></div>';
      bindGoto(ans);
    });
  });
  function bindGoto(root) {
    $$('[data-goto]', root).forEach(function (a) {
      a.addEventListener('click', function () { var t = document.getElementById(a.getAttribute('data-goto')); if (t) t.click(); });
    });
  }
  bindGoto(document);

  /* Calculateur cabinet */
  var range = $('#cab-range');
  if (range) {
    var PLANS = [
      { max: 5, id: 'cp-start', name: T('Cabinet Start'), price: T('15 000 FCFA / mois') },
      { max: 15, id: 'cp-business', name: T('Cabinet Business'), price: T('30 000 FCFA / mois') },
      { max: 30, id: 'cp-pro', name: T('Cabinet Pro'), price: T('50 000 FCFA / mois') },
      { max: 60, id: 'cp-premium', name: T('Cabinet Premium'), price: T('90 000 FCFA / mois') },
      { max: Infinity, id: 'cp-ent', name: T('Cabinet Enterprise'), price: T('Sur devis') }
    ];
    var upd = function () {
      var n = +range.value, p = PLANS.filter(function (x) { return n <= x.max; })[0];
      $('#cab-n').textContent = n >= 61 ? T('plus de 60') : String(n);
      $('#cab-plan').textContent = p.name;
      $('#cab-price').textContent = p.price;
      PLANS.forEach(function (x) { var el = document.getElementById(x.id); if (el) el.classList.toggle('match', x === p); });
    };
    range.addEventListener('input', upd);
    upd();
  }

  /* Radar : explication à la demande */
  $$('.alert button').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.closest('.alert'), open = !a.classList.contains('open');
      a.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
      b.textContent = open ? T('Masquer l\'explication') : T('Pourquoi cette alerte ?');
    });
  });

  /* Démo : génération du dossier */
  var gen = $('#gen-btn');
  if (gen) gen.addEventListener('click', function () {
    var items = $$('#gen-steps li'), i = 0;
    gen.disabled = true;
    items.forEach(function (li) { li.classList.remove('done'); });
    var out = $('#gen-out'); if (out) out.hidden = true;
    (function step() {
      if (i < items.length) { items[i].classList.add('done'); i++; setTimeout(step, reduce ? 0 : 420); }
      else { gen.disabled = false; gen.textContent = T('Relancer l\'assemblage'); if (out) out.hidden = false; }
    })();
  });

  /* Grand livre scellé (hero) : vraie empreinte SHA-256 chaînée, calculée dans le navigateur */
  var list = $('#ledger-list');
  if (list) {
    var SAMPLE = [
      { j: 'VT', c: 'vt', l: T('Facture FV-0418 · Ndiaye Distribution'), a: 2360000, s: '411 / 701' },
      { j: 'BQ', c: 'bq', l: T('Encaissement virement CBAO'), a: 1180000, s: '521 / 411' },
      { j: 'HA', c: 'ha', l: T('Achat marchandises · Sotiba'), a: 845000, s: '601 / 401' },
      { j: 'OD', c: '', l: T('Salaires d\'octobre'), a: 1920000, s: '661 / 422' },
      { j: 'VT', c: 'vt', l: T('Facture FV-0419 · Kaba Services'), a: 590000, s: '411 / 706' },
      { j: 'BQ', c: 'bq', l: T('Règlement fournisseur Sotiba'), a: 845000, s: '401 / 521' },
      { j: 'HA', c: 'ha', l: T('Loyer et charges · novembre'), a: 650000, s: '622 / 401' },
      { j: 'OD', c: '', l: T('TVA collectée · octobre'), a: 424800, s: '4431 / 4441' }
    ];
    var fmt = function (n) { return n.toLocaleString(LANG === 'en' ? 'en-US' : LANG === 'es' ? 'es-ES' : 'fr-FR').replace(/ | /g, ' '); };
    var idx = 0, chainNo = 1180, prev = '0'.repeat(64), stamp = $('#stamp'), count = $('#ledger-count');
    var enc = new TextEncoder();
    var sha = function (txt) {
      if (!window.crypto || !crypto.subtle) return Promise.resolve(fakeHash(txt));
      return crypto.subtle.digest('SHA-256', enc.encode(txt)).then(function (b) {
        return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      });
    };
    function fakeHash(t) { var h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return (h.toString(16) + '0'.repeat(64)).slice(0, 64); }
    var lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    function add(animate) {
      var d = SAMPLE[idx % SAMPLE.length]; idx++; chainNo++;
      var el = document.createElement('div');
      el.className = 'entry' + (animate ? ' enter sealing' : '');
      el.innerHTML = '<div class="j ' + d.c + '">' + d.j + '</div><div class="lbl"><b>' + d.l + '</b><span>' + T('n° ') + chainNo + ' · ' + d.s + '</span></div>' +
        '<div class="amt">' + fmt(d.a) + '<small class="pending-chip">' + T('scellement…') + '</small></div><i class="chain-link"></i>';
      list.insertBefore(el, list.firstChild);
      var payload = prev + '|' + chainNo + '|' + d.j + '|' + d.l + '|' + d.a;
      return sha(payload).then(function (h) {
        prev = h;
        var finish = function () {
          el.classList.remove('sealing');
          var s = $('.amt small', el);
          s.className = 'seal-chip';
          s.innerHTML = lock + h.slice(0, 10);
          s.title = T('Empreinte SHA-256 : ') + h;
          if (count) count.textContent = String(chainNo);
          if (animate && stamp) { stamp.classList.add('hit'); setTimeout(function () { stamp.classList.remove('hit'); }, 900); }
        };
        if (animate) { requestAnimationFrame(function () { el.classList.remove('enter'); }); setTimeout(finish, 900); }
        else finish();
        while (list.children.length > 7) list.removeChild(list.lastChild);
      });
    }
    var seq = Promise.resolve();
    for (var k = 0; k < 5; k++) seq = seq.then(function () { return add(false); });
    if (!reduce) {
      var visible = true, timer = null;
      var tick = function () { if (visible && !document.hidden) add(true); };
      seq.then(function () { timer = setInterval(tick, 3200); });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(list);
      }
    }
  }

  /* Blog : recherche et catégories */
  var bq = $('#blog-q');
  if (bq) {
    var cards = $$('#blog-list .post-card'), cat = '';
    var norm = function (t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    var filter = function () {
      var words = norm(bq.value).split(/\s+/).filter(Boolean), n = 0;
      cards.forEach(function (c) {
        var hay = norm(c.getAttribute('data-search'));
        var ok = (!cat || c.getAttribute('data-cat') === cat) && words.every(function (w) { return hay.indexOf(w) >= 0; });
        c.hidden = !ok; if (ok) n++;
      });
      $('#blog-count').textContent = n + (n > 1 ? T(' articles') : T(' article'));
      $('#blog-empty').hidden = n > 0;
    };
    bq.addEventListener('input', filter);
    $$('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.getAttribute('data-cat');
        $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        filter();
      });
    });
  }

  /* Année du pied de page */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
