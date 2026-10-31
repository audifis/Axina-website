/* AXINA — interactions du site (sans dépendance). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      st.textContent = 'Code introuvable dans votre saisie. Collez le lien du QR code ou le code de vérification imprimé sur le document.';
      return;
    }
    st.className = 'status ok';
    st.textContent = 'Ouverture du registre de vérification…';
    window.open(VERIFY_URL + encodeURIComponent(m[0]), '_blank', 'noopener');
  });

  /* Formulaire de contact (Formspree) */
  var cf = $('#contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('button[type=submit]', cf), st = $('.status', cf);
    btn.disabled = true; btn.textContent = 'Envoi…';
    st.className = 'status';
    var email = $('input[name=email]', cf);
    var rt = $('input[name=_replyto]', cf);
    if (rt && email) rt.value = email.value;
    fetch(cf.action, { method: 'POST', body: new FormData(cf), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('http');
        st.className = 'status ok';
        st.textContent = 'Demande envoyée. Nous revenons vers vous rapidement.';
        cf.reset();
      })
      .catch(function () {
        st.className = 'status err';
        st.innerHTML = 'L\'envoi n\'a pas abouti. Réessayez, ou écrivez-nous sur <a href="' + WA + 'Bonjour%20AXINA" target="_blank" rel="noopener">WhatsApp</a>.';
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Envoyer ma demande'; });
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
      t: 'Préparer un dossier de financement solide.',
      p: 'AXINA tient votre comptabilité OHADA au fil de l\'eau et assemble un dossier bancaire à partir de chiffres scellés et vérifiables. La décision reste à la banque, mais elle lit un dossier propre.',
      l: ['États financiers SYSCOHADA à jour', 'Ratios et indicateurs déjà calculés', 'Dossiers bancaires illimités avec l\'offre Premium'],
      cta: 'Voir le dossier Bank Ready', href: 'bank-ready.html',
      wa: 'Bonjour%2C%20je%20veux%20pr%C3%A9parer%20un%20dossier%20de%20financement%20avec%20AXINA'
    },
    score: {
      t: 'Comprendre ce que disent vos chiffres.',
      p: 'Le score AXINA se calcule à partir de votre trésorerie, de la régularité de vos écritures et de l\'intégrité de votre grand livre. C\'est un indicateur, pas une note de crédit.',
      l: ['Trésorerie, marges et dettes en temps réel', 'Alertes quand un indicateur se dégrade', 'Explication de chaque alerte en langage clair'],
      cta: 'Voir la démo', href: 'demo.html',
      wa: 'Bonjour%2C%20je%20veux%20comprendre%20mon%20score%20AXINA'
    },
    cabinet: {
      t: 'Un atelier de production pour votre portefeuille.',
      p: 'AXINA Cabinet relie votre cabinet aux entreprises clientes abonnées, sous mandat. Vos collaborateurs préparent, révisent, visent et scellent les dossiers dans une même bannette.',
      l: ['De 5 à 60 entreprises connectées selon la formule', 'Préparation, révision, visa et scellement tracés', 'Accès limité au périmètre du mandat signé'],
      cta: 'Voir les tarifs Cabinet', href: '#tarifs', tab: 'pt-cab',
      wa: 'Bonjour%2C%20je%20suis%20un%20cabinet%20et%20je%20veux%20utiliser%20AXINA'
    },
    gov: {
      t: 'Rendre chaque franc traçable.',
      p: 'Pour les ONG, entreprises publiques et administrations, AXINA suit les budgets par projet, programme ou entité, et rattache chaque dépense à sa pièce et à son écriture.',
      l: ['Budgets par projet, bailleur ou programme', 'Rapports scellés, vérifiables par QR code', 'Déploiement et tarif adaptés à votre organisation'],
      cta: 'Voir les offres institutions', href: '#tarifs', tab: 'pt-inst',
      wa: 'Bonjour%2C%20je%20veux%20en%20savoir%20plus%20sur%20AXINA%20pour%20mon%20organisation'
    },
    business: {
      t: 'Toute votre gestion au même endroit.',
      p: 'Facturation, trésorerie, comptabilité OHADA et tableau de bord : AXINA enregistre chaque opération une fois et en tire vos journaux, votre balance et vos états.',
      l: ['Offre Essentiel gratuite pour démarrer', 'Business à 5 000 FCFA par mois', 'Connexion à votre cabinet en temps réel dès Business'],
      cta: 'Voir les tarifs', href: '#tarifs', tab: 'pt-ent',
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
        '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + WA + g.wa + '">Écrire sur WhatsApp</a></div>';
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
      { max: 5, id: 'cp-start', name: 'Cabinet Start', price: '15 000 FCFA / mois' },
      { max: 15, id: 'cp-business', name: 'Cabinet Business', price: '30 000 FCFA / mois' },
      { max: 30, id: 'cp-pro', name: 'Cabinet Pro', price: '50 000 FCFA / mois' },
      { max: 60, id: 'cp-premium', name: 'Cabinet Premium', price: '90 000 FCFA / mois' },
      { max: Infinity, id: 'cp-ent', name: 'Cabinet Enterprise', price: 'Sur devis' }
    ];
    var upd = function () {
      var n = +range.value, p = PLANS.filter(function (x) { return n <= x.max; })[0];
      $('#cab-n').textContent = n >= 61 ? 'plus de 60' : String(n);
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
      b.textContent = open ? 'Masquer l\'explication' : 'Pourquoi cette alerte ?';
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
      else { gen.disabled = false; gen.textContent = 'Relancer l\'assemblage'; if (out) out.hidden = false; }
    })();
  });

  /* Grand livre scellé (hero) : vraie empreinte SHA-256 chaînée, calculée dans le navigateur */
  var list = $('#ledger-list');
  if (list) {
    var SAMPLE = [
      { j: 'VT', c: 'vt', l: 'Facture FV-0418 · Ndiaye Distribution', a: 2360000, s: '411 / 701' },
      { j: 'BQ', c: 'bq', l: 'Encaissement virement CBAO', a: 1180000, s: '521 / 411' },
      { j: 'HA', c: 'ha', l: 'Achat marchandises · Sotiba', a: 845000, s: '601 / 401' },
      { j: 'OD', c: '', l: 'Salaires d\'octobre', a: 1920000, s: '661 / 422' },
      { j: 'VT', c: 'vt', l: 'Facture FV-0419 · Kaba Services', a: 590000, s: '411 / 706' },
      { j: 'BQ', c: 'bq', l: 'Règlement fournisseur Sotiba', a: 845000, s: '401 / 521' },
      { j: 'HA', c: 'ha', l: 'Loyer et charges · novembre', a: 650000, s: '622 / 401' },
      { j: 'OD', c: '', l: 'TVA collectée · octobre', a: 424800, s: '4431 / 4441' }
    ];
    var fmt = function (n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' '); };
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
      el.innerHTML = '<div class="j ' + d.c + '">' + d.j + '</div><div class="lbl"><b>' + d.l + '</b><span>n° ' + chainNo + ' · ' + d.s + '</span></div>' +
        '<div class="amt">' + fmt(d.a) + '<small class="pending-chip">scellement…</small></div><i class="chain-link"></i>';
      list.insertBefore(el, list.firstChild);
      var payload = prev + '|' + chainNo + '|' + d.j + '|' + d.l + '|' + d.a;
      return sha(payload).then(function (h) {
        prev = h;
        var finish = function () {
          el.classList.remove('sealing');
          var s = $('.amt small', el);
          s.className = 'seal-chip';
          s.innerHTML = lock + h.slice(0, 10);
          s.title = 'Empreinte SHA-256 : ' + h;
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

  /* Année du pied de page */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
