<script>
/* ================================================================
   EINSTELLUNGEN DER TERMINABFRAGE – hier alles anpassen
   ================================================================ */
const CONFIG = {
  title: "Wann kannst du nicht?",

  // Vorgegebene Namen (Auswahlfeld)
  names: ["Laura","Emilia", "Travis", "Lilly"],

  // Vorgegebene Tage (werden als Auswahl-Chips angezeigt)
  days: ["Do 15.10.2026", "Fr 16.10.2026"],

  // Hierhin wird bei jedem Abschicken eine E-Mail geschickt (über formsubmit.co)
  notifyEmail: "8998a0038060bc1959aedd555bca6fdb",

  // Schlüssel für die Speicherung im Browser
  storageKey: "terminabfrage_antworten"
};

/* HINWEIS ZUM SPEICHERN:
   Eine reine HTML-Datei hat keinen Server. Jede Antwort wird per E-Mail
   (formsubmit.co) an notifyEmail geschickt. Zusätzlich wird eine lokale Kopie im
   Browser gespeichert, damit die eigene Auswahl beim erneuten Öffnen vorausgefüllt ist.
   Beim allerersten Absenden schickt formsubmit.co eine Aktivierungs-Mail an
   notifyEmail. Dort einmal auf den Bestätigungs-Link klicken.
   Gespeichert werden die Tage, an denen jemand NICHT kann. */

/* ================================================================
   THEME
   ================================================================ */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  let stored = null;
  try { stored = localStorage.getItem('bga-theme'); } catch (e) {}

  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  updateMetaTheme(initial);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('bga-theme', next); } catch (e) {}
      updateMetaTheme(next);
    });
  }

  function updateMetaTheme(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', theme === 'dark' ? '#1A1111' : '#B4101F');
  }
})();

/* ================================================================
   SNOW
   ================================================================ */
(function snow() {
  const field = document.getElementById('snowfield');
  if (!field) return;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const count = window.innerWidth < 700 ? 26 : 52;

  for (let i = 0; i < count; i++) {
    const flake = document.createElement('span');
    flake.className = 'snowflake';

    const size = (Math.random() * 5 + 2).toFixed(2);
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    flake.style.left = (Math.random() * 100).toFixed(2) + 'vw';
    flake.style.animationDuration = (Math.random() * 14 + 12).toFixed(2) + 's';
    flake.style.animationDelay = (Math.random() * -26).toFixed(2) + 's';
    flake.style.setProperty('--drift', (Math.random() * 90 - 45).toFixed(0) + 'px');

    field.appendChild(flake);
  }
})();

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el) => observer.observe(el));
})();

/* ================================================================
   PROGRESS BARS
   ================================================================ */
(function progressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach((bar) => { bar.style.width = (bar.dataset.progress || 0) + '%'; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.dataset.progress || 0;
        setTimeout(() => { bar.style.width = value + '%'; }, 220);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
})();

/* ================================================================
   RIPPLE (global, auch für dynamisch erzeugte Elemente)
   ================================================================ */
function attachRipple(el) {
  el.addEventListener('pointerdown', (event) => {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = size + 'px';
    span.style.height = size + 'px';
    span.style.left = (event.clientX - rect.left - size / 2) + 'px';
    span.style.top = (event.clientY - rect.top - size / 2) + 'px';
    el.appendChild(span);
    setTimeout(() => span.remove(), 640);
  });
}

/* ================================================================
   TOP APP BAR + FAB + SCROLL SPY
   ================================================================ */
(function scrollUI() {
  const bar = document.getElementById('topAppBar');
  const fab = document.getElementById('fabTop');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    if (bar) bar.classList.toggle('scrolled', y > 12);
    if (fab) fab.classList.toggle('show', y > 520);

    let activeIndex = -1;
    const offset = 140;

    sections.forEach((section, index) => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      if (y >= top && y < bottom) activeIndex = index;
    });

    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === activeIndex);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  if (fab) {
    fab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

/* ================================================================
   HERO PARALLAX
   ================================================================ */
(function parallax() {
  const art = document.querySelector('.hero-art');
  if (!art) return;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let raf = null;

  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < 900) art.style.transform = 'translateY(' + (y * 0.06) + 'px)';
      raf = null;
    });
  }, { passive: true });
})();

/* ================================================================
   TERMINABFRAGE
   ================================================================ */
(function terminabfrage() {
  const $ = (id) => document.getElementById(id);

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; }
    catch (e) { return {}; }
  }
  function saveAll(data) {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* Snackbar */
  let snackTimer = null;
  function showSnack(text, type) {
    const el = $('msg');
    el.textContent = text;
    el.className = 'snackbar show' + (type ? ' ' + type : '');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => {
      el.className = 'snackbar' + (type ? ' ' + type : '');
    }, 5200);
  }

  /* Formular aufbauen */
  const heading = $('tfHeading');
  if (heading) heading.textContent = CONFIG.title;

  CONFIG.names.forEach((n) => {
    const o = document.createElement('option');
    o.value = n;
    o.textContent = n;
    $('tfName').appendChild(o);
  });

  const CHECK_SVG = '<svg class="tf-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.55 17.6 4 12.05l1.4-1.4 4.15 4.15L18.6 5.7 20 7.1z"/></svg>';

  CONFIG.days.forEach((d) => {
    const l = document.createElement('label');
    l.className = 'tf-chip';
    l.innerHTML =
      '<input type="checkbox" name="day" value="' + esc(d) + '">' +
      '<span class="tf-chip-face">' + CHECK_SVG + '<span>' + esc(d) + '</span></span>';
    $('tfDays').appendChild(l);
    attachRipple(l);
  });

  /* Ripple für Buttons, Chips und Navigation */
  document.querySelectorAll('.btn, .icon-btn, .chip, .nav-link').forEach(attachRipple);

  /* Bei Namenswechsel frühere Antwort vorausfüllen */
  $('tfName').addEventListener('change', () => {
    const prev = loadAll()[$('tfName').value];
    document.querySelectorAll('input[name="day"]').forEach((cb) => {
      cb.checked = !!prev && prev.includes(cb.value);
    });
  });

  /* Abschicken */
  $('tfForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('tfName').value;
    if (!name) {
      showSnack('Bitte wähle deinen Namen aus.', 'err');
      $('tfName').focus();
      return;
    }

    const cannot = [...document.querySelectorAll('input[name="day"]:checked')].map((cb) => cb.value);
    const can = CONFIG.days.filter((d) => !cannot.includes(d));

    const data = loadAll();
    const existed = name in data;
    data[name] = cannot;
    saveAll(data);

    const btn = $('tfSubmit');
    btn.disabled = true;
    btn.classList.add('loading');

    try {
      const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(CONFIG.notifyEmail), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'Terminabfrage: ' + name,
          _template: 'table',
          _captcha: 'false',
          Name: name,
          'Kann an': can.length ? can.join(', ') : 'keinem Tag',
          'Kann nicht an': cannot.length ? cannot.join(', ') : 'keinem Tag',
          'Import-Code': JSON.stringify({ [name]: cannot })
        })
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.success !== 'false' && out.success !== false) {
        showSnack(
          existed
            ? 'Danke, ' + name + '! Deine Antwort wurde aktualisiert und gesendet.'
            : 'Danke, ' + name + '! Deine Antwort wurde gesendet.',
          'ok'
        );
      } else {
        throw new Error(out.message || 'Senden fehlgeschlagen');
      }
    } catch (err) {
      showSnack('Senden hat nicht geklappt. Bitte prüfe deine Internetverbindung und versuche es nochmal.', 'err');
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });
})();

console.log(
  '%c🎄 Christmas BGA Altena Show %c— Band-Site',
  'background:#B4101F;color:#fff;padding:4px 10px;border-radius:8px;font-weight:700;',
  'color:#888;padding:4px 0;'
);
</script>
