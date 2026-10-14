(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2600);
  };

  /* ---------- Menu mobile ---------- */
  const header = $('.header');
  const menuToggle = $('#menuToggle');
  menuToggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Fallback de imagens ---------- */
  $$('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const box = img.parentElement;
      const span = document.createElement('span');
      span.textContent = img.dataset.fallback;
      span.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;font-size:64px';
      box.style.position = box.style.position || 'relative';
      img.remove();
      box.prepend(span);
    }, { once: true });
  });

  /* ---------- Pets: filtros ---------- */
  const cards = $$('.pet');
  const empty = $('#empty');
  const state = { tab: 'todos', species: '', size: '', uf: '', query: '' };

  const normalize = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const types = card.dataset.type.split(' ');
      const text = normalize(card.textContent);
      const ok =
        (state.tab === 'todos' || types.includes(state.tab)) &&
        (!state.species || types.includes(state.species)) &&
        (!state.size || card.dataset.size === state.size) &&
        (!state.uf || card.dataset.uf === state.uf) &&
        (!state.query || text.includes(normalize(state.query)));
      card.hidden = !ok;
      if (ok) visible++;
    });
    empty.hidden = visible !== 0;
  }

  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    state.tab = tab.dataset.filter;
    applyFilters();
  }));

  $('#finder').addEventListener('submit', (e) => {
    e.preventDefault();
    state.species = $('#fSpecies').value;
    state.size = $('#fSize').value;
    state.uf = $('#fLoc').value;
    applyFilters();
    $('#pets').scrollIntoView({ behavior: 'smooth' });
    const n = cards.filter(c => !c.hidden).length;
    showToast(n ? `${n} pet(s) encontrado(s)` : 'Nenhum pet encontrado');
  });

  const searchInput = $('#searchInput');
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = searchInput.value.trim();
      applyFilters();
    }, 200);
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.query) $('#pets').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Favoritos ---------- */
  const favs = new Set();
  $$('.fav').forEach(btn => btn.addEventListener('click', () => {
    const name = btn.closest('.pet').querySelector('h3').textContent;
    const on = btn.classList.toggle('is-on');
    btn.textContent = on ? '♥' : '♡';
    btn.setAttribute('aria-pressed', on);
    on ? favs.add(name) : favs.delete(name);
    showToast(on ? `${name} adicionado aos favoritos` : `${name} removido dos favoritos`);
  }));

  /* ---------- Salvar artigos ---------- */
  $$('.save').forEach(btn => btn.addEventListener('click', () => {
    const on = btn.classList.toggle('is-on');
    showToast(on ? 'Artigo salvo para ler depois' : 'Artigo removido dos salvos');
  }));

  /* ---------- Pacotes de doação ---------- */
  const packs = $$('.pack');
  const donateBtn = $('#donateBtn');
  packs.forEach(p => p.addEventListener('click', () => {
    packs.forEach(x => x.classList.remove('is-active'));
    p.classList.add('is-active');
  }));

  donateBtn.addEventListener('click', () => {
    const p = $('.pack.is-active');
    const kg = Number(p.dataset.kg);
    const price = Number(p.dataset.price);
    if (!kg) {
      const v = prompt('Quanto você gostaria de doar? (R$)');
      const n = parseFloat((v || '').replace(',', '.'));
      if (!n || n <= 0) return showToast('Informe um valor válido para doar');
      return showToast(`Obrigado! Doação de R$ ${n.toFixed(2).replace('.', ',')} iniciada 💚`);
    }
    showToast(`Obrigado! Pacote de ${kg} kg (R$ ${price}) iniciado 💚`);
  });

  /* ---------- Barra de progresso (anima ao aparecer) ---------- */
  const fill = $('#progressFill');
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        fill.style.width = fill.dataset.value + '%';
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  reveal.observe(fill);

  /* ---------- Contadores do hero ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = new Intl.NumberFormat('pt-BR');
  if (!reduce) {
    $$('[data-count]').forEach(el => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1200;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt.format(Math.round(end * eased)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Links placeholder ---------- */
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
})();
