(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  /* =========== Comum: toast, menu, fallback de imagem, busca do topo =========== */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2600);
  };

  const header = $('.header');
  const menuToggle = $('#menuToggle');
  menuToggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', open);
  });

  const bindFallbacks = (root = document) => {
    $$('img[data-fallback]', root).forEach(img => {
      img.addEventListener('error', () => {
        const box = img.parentElement;
        const span = document.createElement('span');
        span.textContent = img.dataset.fallback;
        span.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;font-size:56px';
        img.remove();
        box.prepend(span);
      }, { once: true });
    });
  };
  bindFallbacks();

  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  const topSearch = $('#searchInput');

  /* =========================================================
     CATÁLOGO
     ========================================================= */
  const grid = $('#grid');
  if (grid) {
    const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;
    const TEMP = {
      docil: ['Dócil', 'Dócil'], brincalhao: ['Brincalhão', 'Brincalhona'], calmo: ['Calmo', 'Calma'],
      sociavel: ['Sociável', 'Sociável'], independente: ['Independente', 'Independente'],
      amoroso: ['Amoroso', 'Amorosa'], silencioso: ['Silencioso', 'Silenciosa'], facil: ['Fácil Cuidado', 'Fácil Cuidado']
    };
    // id maior = cadastro mais recente · m = idade em meses · km = distância
    const PETS = [
      { id: 18, n: 'Paçoca', sp: 'cao', sx: 'M', m: 12, sz: 'Médio', br: 'Caramelo', t: ['docil', 'brincalhao'], loc: 'Pinheiros, SP', km: 3.2, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1587300003388-59208cc962cb') },
      { id: 17, n: 'Mel', sp: 'gato', sx: 'F', m: 6, sz: 'Pequeno', br: 'Tricolor', t: ['amoroso', 'calmo'], loc: 'Vila Mariana, SP', km: 5.1, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1573865526739-10659fec78a5') },
      { id: 16, n: 'Pipoca', sp: 'cao', sx: 'F', m: 24, sz: 'Pequeno', br: 'Spitz Mix', t: ['docil'], loc: 'Santana, SP', km: 8.4, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1561037404-61cd46aa615b') },
      { id: 15, n: 'Amora', sp: 'cao', sx: 'F', m: 18, sz: 'Médio', br: 'Vira-lata', t: ['sociavel'], loc: 'Tatuapé, SP', km: 6.7, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1548199973-03cce0bbc87b') },
      { id: 14, n: 'Frederico', sp: 'coelho', sx: 'M', m: 8, sz: 'Pequeno', br: 'Angorá', t: ['docil', 'silencioso', 'facil'], loc: 'Santo André, SP', km: 14.0, rg: 'sp', c: 0, v: 1, vm: 1, pne: 0, img: U('photo-1585110396000-c9ffd4e4b4ec') },
      { id: 13, n: 'Thor', sp: 'cao', sx: 'M', m: 3, sz: 'Grande', br: 'Golden Retriever', t: ['brincalhao'], loc: 'Moema, SP', km: 4.3, rg: 'sp', c: 0, v: 1, vm: 1, pne: 0, img: U('photo-1552053831-71594a27632d') },
      { id: 12, n: 'Milo', sp: 'gato', sx: 'M', m: 8, sz: 'Pequeno', br: 'Preto e Branco', t: ['brincalhao', 'docil'], loc: 'Itaim Bibi, SP', km: 7.9, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1514888286974-6c03e2ca1dba') },
      { id: 11, n: 'Nina', sp: 'gato', sx: 'F', m: 30, sz: 'Pequeno', br: 'Siamês', t: ['independente', 'calmo'], loc: 'Lapa, SP', km: 9.2, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1533738363-b7f9aef128ce') },
      { id: 10, n: 'Bento', sp: 'cao', sx: 'M', m: 60, sz: 'Grande', br: 'Pastor Mix', t: ['calmo', 'sociavel'], loc: 'Butantã, SP', km: 11.5, rg: 'sp', c: 1, v: 1, vm: 0, pne: 0, img: U('photo-1583511655857-d19b40a7a54e') },
      { id: 9, n: 'Lola', sp: 'cao', sx: 'F', m: 10, sz: 'Pequeno', br: 'Dachshund', t: ['brincalhao', 'sociavel'], loc: 'Perdizes, SP', km: 6.0, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1612774412771-005ed8e861d2') },
      { id: 8, n: 'Simba', sp: 'gato', sx: 'M', m: 14, sz: 'Pequeno', br: 'Laranja', t: ['brincalhao', 'amoroso'], loc: 'Mooca, SP', km: 7.1, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1495360010541-f48722b34f7d') },
      { id: 7, n: 'Mingau', sp: 'cao', sx: 'M', m: 96, sz: 'Médio', br: 'Poodle', t: ['calmo', 'docil'], loc: 'Ipiranga, SP', km: 10.3, rg: 'sp', c: 1, v: 1, vm: 1, pne: 1, img: U('photo-1543466835-00a7907e9de1') },
      { id: 6, n: 'Cacau', sp: 'cao', sx: 'F', m: 30, sz: 'Médio', br: 'Labrador Mix', t: ['sociavel', 'brincalhao'], loc: 'Campinas, SP', km: 96.0, rg: 'camp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1517849845537-4d257902454a') },
      { id: 5, n: 'Luna', sp: 'cao', sx: 'F', m: 24, sz: 'Grande', br: 'Golden Mix', t: ['calmo', 'sociavel'], loc: 'Barão Geraldo, Campinas', km: 98.5, rg: 'camp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1561037404-61cd46aa615b') },
      { id: 4, n: 'Pipa', sp: 'gato', sx: 'F', m: 4, sz: 'Pequeno', br: 'Cinza', t: ['brincalhao', 'docil'], loc: 'Liberdade, SP', km: 4.9, rg: 'sp', c: 0, v: 1, vm: 1, pne: 0, img: U('photo-1514888286974-6c03e2ca1dba') },
      { id: 3, n: 'Zeca', sp: 'cao', sx: 'M', m: 20, sz: 'Médio', br: 'Caramelo', t: ['docil', 'sociavel'], loc: 'Penha, SP', km: 12.8, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1587300003388-59208cc962cb') },
      { id: 2, n: 'Tom', sp: 'gato', sx: 'M', m: 120, sz: 'Pequeno', br: 'Preto', t: ['calmo', 'independente'], loc: 'Santana, SP', km: 8.8, rg: 'sp', c: 1, v: 1, vm: 1, pne: 1, img: U('photo-1573865526739-10659fec78a5') },
      { id: 1, n: 'Biscoito', sp: 'cao', sx: 'M', m: 36, sz: 'Médio', br: 'Beagle Mix', t: ['brincalhao', 'sociavel'], loc: 'Vila Prudente, SP', km: 13.4, rg: 'sp', c: 1, v: 1, vm: 1, pne: 0, img: U('photo-1548199973-03cce0bbc87b') }
    ];
    const PER_PAGE = 6;
    const ageGroup = (m) => (m <= 12 ? 'filhote' : m <= 36 ? 'jovem' : m <= 84 ? 'adulto' : 'senior');
    const ageText = (m) => {
      if (m < 12) return `${m} ${m === 1 ? 'mês' : 'meses'}`;
      const y = Math.floor(m / 12);
      return `${y} ${y === 1 ? 'ano' : 'anos'}`;
    };
    const joinPt = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]);
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    const form = $('#filterForm');
    const applyBtn = $('#applyBtn');
    const resCount = $('#resCount');
    const emptyMsg = $('#empty');
    const pager = $('#pager');
    const sortSel = $('#sort');
    const favs = new Set();
    let applied = null;
    let page = 1;

    const readFilters = () => {
      const all = (name) => $$(`[name="${name}"]:checked`, form).map(i => i.value);
      return {
        name: norm($('#fName').value.trim()),
        species: all('species'), sex: ($('[name="sex"]:checked', form) || {}).value || '',
        age: all('age'), size: all('size'), region: $('#fRegion').value,
        health: all('health'), temp: all('temp')
      };
    };

    const matches = (p, f) => {
      if (f.name && !norm(p.n).includes(f.name)) return false;
      if (f.species.length && !f.species.includes(p.sp)) return false;
      if (f.sex && p.sx !== f.sex) return false;
      if (f.age.length && !f.age.includes(ageGroup(p.m))) return false;
      if (f.size.length && !f.size.includes(p.sz)) return false;
      if (f.region && p.rg !== f.region) return false;
      const flags = { cast: p.c, vac: p.v, verm: p.vm, pne: p.pne };
      if (f.health.some(h => !flags[h])) return false;
      if (f.temp.length && !p.t.some(t => f.temp.includes(t))) return false;
      return true;
    };

    const updateApplyLabel = () => {
      const n = PETS.filter(p => matches(p, readFilters())).length;
      applyBtn.textContent = `Aplicar Filtros (${n})`;
    };

    const sorters = {
      recent: (a, b) => b.id - a.id,
      name: (a, b) => a.n.localeCompare(b.n, 'pt-BR'),
      near: (a, b) => a.km - b.km,
      young: (a, b) => a.m - b.m
    };

    const cardHTML = (p) => {
      const g = p.sx === 'F' ? 1 : 0;
      const temps = p.t.map(k => TEMP[k][g]);
      return `<article class="pcard">
        <div class="pcard__img">
          <img src="${p.img}" alt="${esc(p.n)}, ${esc(p.br)}" loading="lazy" data-fallback="${p.sp === 'gato' ? '🐱' : p.sp === 'coelho' ? '🐰' : '🐶'}">
          <button class="fav${favs.has(p.id) ? ' is-on' : ''}" data-id="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Favoritar ${esc(p.n)}">${favs.has(p.id) ? '♥' : '♡'}</button>
        </div>
        <div class="pcard__body">
          <div class="pcard__title"><h3>${esc(p.n)}</h3><span class="tag">${p.sz}</span></div>
          <p class="pcard__info">${esc(p.br)} • ${ageText(p.m)} • ${joinPt(temps)}</p>
          <p class="pcard__loc"><i>⌖</i> ${esc(p.loc)} • ${p.km.toFixed(1).replace('.', ',')} km</p>
          <a href="#" class="btn btn--sky" data-adopt="${esc(p.n)}">Conhecer &amp; Adotar →</a>
        </div>
      </article>`;
    };

    const pageList = (cur, total) => {
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
      const set = new Set([1, 2, total, cur - 1, cur, cur + 1]);
      if (cur <= 3) { set.add(2); set.add(3); }
      const nums = [...set].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
      const out = [];
      nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push('…'); out.push(n); });
      return out;
    };

    const renderPager = (total) => {
      pager.hidden = total <= 1;
      if (total <= 1) return;
      const pages = pageList(page, total).map(n =>
        n === '…' ? '<span>…</span>' : `<button type="button" data-page="${n}" ${n === page ? 'aria-current="page"' : ''} aria-label="Página ${n}">${n}</button>`).join('');
      pager.innerHTML = `<button type="button" class="pager__nav" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>‹ Anterior</button>
        <div class="pager__pages">${pages}</div>
        <button type="button" class="pager__nav" data-page="${page + 1}" ${page === total ? 'disabled' : ''}>Próximo ›</button>`;
    };

    const render = () => {
      const list = PETS.filter(p => matches(p, applied)).sort(sorters[sortSel.value]);
      const total = Math.max(1, Math.ceil(list.length / PER_PAGE));
      page = Math.min(page, total);
      resCount.textContent = `${list.length} ${list.length === 1 ? 'pet' : 'pets'}`;
      grid.innerHTML = list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(cardHTML).join('');
      bindFallbacks(grid);
      emptyMsg.hidden = list.length !== 0;
      renderPager(list.length ? total : 0);
    };

    const apply = () => { applied = readFilters(); page = 1; render(); };

    form.addEventListener('change', updateApplyLabel);
    $('#fName').addEventListener('input', updateApplyLabel);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      apply();
      $('.results__bar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#clearFilters').addEventListener('click', () => {
      $$('input[type="checkbox"]', form).forEach(i => (i.checked = false));
      $('[name="sex"][value=""]', form).checked = true;
      $('#fName').value = '';
      $('#fRegion').value = '';
      if (topSearch) topSearch.value = '';
      updateApplyLabel();
      apply();
      showToast('Filtros limpos');
    });
    sortSel.addEventListener('change', () => { page = 1; render(); });

    pager.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b || b.disabled) return;
      page = Number(b.dataset.page);
      render();
      $('.results__bar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    grid.addEventListener('click', (e) => {
      const fav = e.target.closest('.fav');
      if (fav) {
        const id = Number(fav.dataset.id);
        const pet = PETS.find(p => p.id === id);
        const on = !favs.has(id);
        on ? favs.add(id) : favs.delete(id);
        fav.classList.toggle('is-on', on);
        fav.textContent = on ? '♥' : '♡';
        fav.setAttribute('aria-pressed', on);
        showToast(on ? `${pet.n} adicionado aos favoritos` : `${pet.n} removido dos favoritos`);
        return;
      }
      const adopt = e.target.closest('[data-adopt]');
      if (adopt) { e.preventDefault(); showToast(`O perfil completo de ${adopt.dataset.adopt} estará disponível em breve`); }
    });

    // busca do topo ↔ campo "Buscar por Nome"
    let searchTimer;
    topSearch.addEventListener('input', () => {
      $('#fName').value = topSearch.value;
      updateApplyLabel();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(apply, 250);
    });
    $('#fName').addEventListener('input', () => { topSearch.value = $('#fName').value; });

    const q = new URLSearchParams(location.search).get('q');
    if (q) { $('#fName').value = q; topSearch.value = q; }

    updateApplyLabel();
    apply();
  }

  /* =========================================================
     DOAÇÃO
     ========================================================= */
  const itemsEl = $('#items');
  if (itemsEl) {
    // Enter na busca do topo leva ao catálogo
    topSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && topSearch.value.trim()) location.href = 'catalogo.html?q=' + encodeURIComponent(topSearch.value.trim());
    });

    /* barra de meta */
    const goalFill = $('#goalFill');
    new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) { goalFill.style.width = goalFill.dataset.value + '%'; obs.disconnect(); }
    }, { threshold: 0.3 }).observe(goalFill);

    /* carrinho */
    const cart = new Map(); // chave -> { label, price, qty }
    const feeEl = $('#fee');
    const totalEl = $('#total');
    let mode = 'coleta';

    const renderCart = () => {
      itemsEl.innerHTML = '';
      let total = 0;
      if (!cart.size) {
        itemsEl.innerHTML = '<li class="none">Nenhum item ainda. Escolha um pacote ou use o simulador.</li>';
      }
      cart.forEach((it, key) => {
        total += it.price * it.qty;
        const li = document.createElement('li');
        li.innerHTML = `<span></span><b>${brl(it.price * it.qty)}</b><button type="button" aria-label="Remover item">×</button>`;
        li.firstChild.textContent = it.label + (it.qty > 1 ? ` ×${it.qty}` : '');
        li.querySelector('button').addEventListener('click', () => {
          cart.delete(key);
          if (key === 'sim') $$('.kg').forEach(k => k.classList.remove('is-active'));
          renderCart();
        });
        itemsEl.appendChild(li);
      });
      totalEl.textContent = brl(total);
    };

    /* simulador */
    const impactText = $('#impactText');
    const setSim = (kg, price) => {
      const dogs = Math.max(1, Math.round(kg / 4.9));
      impactText.textContent = `${kg} kg de ração alimentam ${dogs} ${dogs === 1 ? 'cão resgatado' : 'cães resgatados'} por 2 semanas inteiras.`;
      cart.delete('sim');
      const rebuilt = new Map([['sim', { label: `Pacote Ração Cães (${kg}kg)`, price, qty: 1 }]]);
      cart.forEach((v, k) => rebuilt.set(k, v));
      cart.clear();
      rebuilt.forEach((v, k) => cart.set(k, v));
      renderCart();
    };
    $('#kgs').addEventListener('click', (e) => {
      const b = e.target.closest('.kg');
      if (!b) return;
      $$('.kg').forEach(k => k.classList.toggle('is-active', k === b));
      setSim(Number(b.dataset.kg), Number(b.dataset.price));
    });

    /* categorias */
    $$('.dcat__add').forEach(btn => btn.addEventListener('click', () => {
      const sel = $(`input[name="${btn.dataset.name}"]:checked`);
      const label = sel.dataset.label;
      const price = Number(sel.dataset.price);
      const cur = cart.get(label);
      cart.set(label, { label, price, qty: cur ? cur.qty + 1 : 1 });
      renderCart();
      showToast(`${label} adicionado à doação`);
    }));

    $('#clearCart').addEventListener('click', () => {
      cart.clear();
      $$('.kg').forEach(k => k.classList.remove('is-active'));
      renderCart();
    });

    /* pix */
    $('#copyPix').addEventListener('click', async () => {
      const key = $('#pixKey').textContent.trim();
      try {
        await navigator.clipboard.writeText(key);
        showToast('Chave Pix copiada: ' + key);
      } catch {
        const r = document.createRange();
        r.selectNodeContents($('#pixKey'));
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        showToast('Selecione e copie a chave Pix: ' + key);
      }
    });

    /* abrigos críticos */
    $$('.crit__btn').forEach(btn => btn.addEventListener('click', () => {
      $('#dest').textContent = btn.dataset.ong;
      showToast(`Sua doação será destinada ao abrigo ${btn.dataset.ong}`);
      $('.summary').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));

    /* logística */
    const coletaFields = $('#coletaFields');
    const pontoFields = $('#pontoFields');
    $('#delivs').addEventListener('click', (e) => {
      const b = e.target.closest('.deliv');
      if (!b) return;
      mode = b.dataset.mode;
      $$('.deliv').forEach(d => d.classList.toggle('is-active', d === b));
      coletaFields.hidden = mode !== 'coleta';
      pontoFields.hidden = mode !== 'ponto';
      feeEl.textContent = mode === 'coleta' ? 'Gratuita' : 'Não se aplica';
    });

    const dateEl = $('#date');
    dateEl.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    const cepEl = $('#cep');
    cepEl.addEventListener('input', () => {
      const d = cepEl.value.replace(/\D/g, '').slice(0, 8);
      cepEl.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    });
    $$('#logiForm .inp').forEach(i => i.addEventListener('input', () => i.removeAttribute('aria-invalid')));

    /* finalizar */
    $('#checkout').addEventListener('click', () => {
      if (!cart.size) return showToast('Adicione ao menos um item à doação');
      if (mode === 'coleta') {
        const required = [['#addr', 'o endereço de retirada'], ['#cep', 'um CEP válido'], ['#date', 'a data da coleta']];
        for (const [sel, txt] of required) {
          const el = $(sel);
          const bad = !el.value.trim() || (sel === '#cep' && el.value.replace(/\D/g, '').length !== 8);
          if (bad) {
            el.setAttribute('aria-invalid', 'true');
            el.focus();
            return showToast(`Informe ${txt}`);
          }
        }
      }
      const total = totalEl.textContent;
      showToast(`Obrigado! Doação de ${total} confirmada 💚 Certificado a caminho.`);
      cart.clear();
      $$('.kg').forEach(k => k.classList.remove('is-active'));
      renderCart();
    });

    /* abas do topo */
    $('#tabResgate').addEventListener('click', () => showToast('O cadastro de animais para resgate estará disponível em breve'));

    /* números */
    const fmt = new Intl.NumberFormat('pt-BR');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        const el = en.target;
        const end = Number(el.dataset.count), suffix = el.dataset.suffix || '';
        if (reduce) return;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / 1100, 1);
          el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - t, 3)))) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(el => numObs.observe(el));

    setSim(15, 124);
  }
})();
